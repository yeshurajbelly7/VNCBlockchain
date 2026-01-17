import * as bip39 from 'bip39';
import { ethers } from 'ethers';
import CryptoJS from 'crypto-js';
import HDKey from 'hdkey';

// Extend Window interface for ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on?: (event: string, callback: (...args: unknown[]) => void) => void;
      removeListener?: (event: string, callback: (...args: unknown[]) => void) => void;
      selectedAddress?: string | null;
      isMetaMask?: boolean;
    };
  }
}

export interface WalletAddress {
  chain: string;
  address: string;
  privateKey?: string;
  balance?: string;
}

export interface WalletData {
  mnemonic: string;
  addresses: WalletAddress[];
  encryptedMnemonic?: string;
}

/**
 * Generate a new HD wallet with mnemonic
 */
export async function generateWallet(): Promise<WalletData> {
  // Generate 12-word mnemonic
  const mnemonic = bip39.generateMnemonic();
  
  // Derive addresses for different chains
  const addresses = await deriveAddresses(mnemonic);
  
  return {
    mnemonic,
    addresses,
  };
}

/**
 * Derive addresses from mnemonic for multiple chains
 */
export async function deriveAddresses(mnemonic: string): Promise<WalletAddress[]> {
  const seed = await bip39.mnemonicToSeed(mnemonic);
  const hdkey = HDKey.fromMasterSeed(seed);
  
  const addresses: WalletAddress[] = [];
  
  // Ethereum / BSC / VNC Chain (EVM compatible) - m/44'/60'/0'/0/0
  const ethPath = "m/44'/60'/0'/0/0";
  const ethWallet = hdkey.derive(ethPath);
  const ethPrivateKey = ethWallet.privateKey;
  
  if (ethPrivateKey) {
    // Convert Buffer to hex string
    const privateKeyHex = '0x' + ethPrivateKey.toString('hex');
    const wallet = new ethers.Wallet(privateKeyHex);
    
    addresses.push({
      chain: 'VNC',
      address: wallet.address,
      privateKey: wallet.privateKey,
    });
    
    addresses.push({
      chain: 'ETH',
      address: wallet.address,
      privateKey: wallet.privateKey,
    });
    
    addresses.push({
      chain: 'BSC',
      address: wallet.address,
      privateKey: wallet.privateKey,
    });
  }
  
  // TRON would require different derivation - placeholder
  addresses.push({
    chain: 'TRON',
    address: 'T' + addresses[0].address.substring(2, 36), // Simplified
    privateKey: '', // Would require TronWeb
  });
  
  return addresses;
}

/**
 * Encrypt mnemonic with password
 */
export function encryptMnemonic(mnemonic: string, password: string): string {
  return CryptoJS.AES.encrypt(mnemonic, password).toString();
}

/**
 * Decrypt mnemonic with password
 */
export function decryptMnemonic(encryptedMnemonic: string, password: string): string {
  const bytes = CryptoJS.AES.decrypt(encryptedMnemonic, password);
  return bytes.toString(CryptoJS.enc.Utf8);
}

/**
 * Validate mnemonic
 */
export function validateMnemonic(mnemonic: string): boolean {
  return bip39.validateMnemonic(mnemonic);
}

/**
 * Restore wallet from mnemonic
 */
export async function restoreWallet(mnemonic: string): Promise<WalletData | null> {
  if (!validateMnemonic(mnemonic)) {
    return null;
  }
  
  const addresses = await deriveAddresses(mnemonic);
  
  return {
    mnemonic,
    addresses,
  };
}

/**
 * Get balance for an address on a specific chain
 */
export async function getBalance(chain: string, address: string): Promise<string> {
  try {
    let provider: ethers.JsonRpcProvider;
    
    switch (chain) {
      case 'VNC':
        provider = new ethers.JsonRpcProvider('https://rpc.bharatqchain.com');
        break;
      case 'ETH':
        provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_ETH_RPC_URL || 'https://eth.llamarpc.com');
        break;
      case 'BSC':
        provider = new ethers.JsonRpcProvider('https://bsc-dataseed.binance.org');
        break;
      default:
        return '0';
    }
    
    const balance = await provider.getBalance(address);
    return ethers.formatEther(balance);
  } catch (error) {
    console.error('Error fetching balance:', error);
    return '0';
  }
}

/**
 * Send transaction
 */
export async function sendTransaction(
  chain: string,
  privateKey: string,
  toAddress: string,
  amount: string
): Promise<string> {
  try {
    let provider: ethers.JsonRpcProvider;
    
    switch (chain) {
      case 'VNC':
        provider = new ethers.JsonRpcProvider('https://rpc.vncblockchain.com');
        break;
      case 'ETH':
        provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_ETH_RPC_URL || 'https://eth.llamarpc.com');
        break;
      case 'BSC':
        provider = new ethers.JsonRpcProvider('https://bsc-dataseed.binance.org');
        break;
      default:
        throw new Error('Unsupported chain');
    }
    
    const wallet = new ethers.Wallet(privateKey, provider);
    
    const tx = await wallet.sendTransaction({
      to: toAddress,
      value: ethers.parseEther(amount),
    });
    
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error('Error sending transaction:', error);
    throw error;
  }
}

/**
 * Get transaction history
 */
export async function getTransactionHistory(
  _chain: string,
  _address: string
): Promise<unknown[]> {
  // This would require blockchain indexer or API like Etherscan
  // Placeholder implementation
  return [];
}

/**
 * Connect to MetaMask
 */
export async function connectMetaMask(): Promise<string | null> {
  if (typeof window.ethereum !== 'undefined') {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }) as string[];
      return accounts[0];
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      return null;
    }
  }
  return null;
}

/**
 * Add custom network to MetaMask
 */
export async function addNetworkToMetaMask() {
  if (typeof window.ethereum !== 'undefined') {
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0x' + (20250001).toString(16),
          chainName: 'VNC Blockchain',
          nativeCurrency: {
            name: 'VNC',
            symbol: 'VNC',
            decimals: 18
          },
          rpcUrls: ['https://rpc.vncblockchain.com'],
          blockExplorerUrls: ['https://explorer.vncblockchain.com']
        }]
      });
    } catch (error) {
      console.error('Error adding network:', error);
    }
  }
}
