// Crypto Payment Listener
// Monitors blockchain transactions for USDT (ERC20/TRC20/BEP20), ETH, BNB

import { ethers } from 'ethers';

export type CryptoNetwork = 'ETH' | 'BSC' | 'TRON';
export type CryptoToken = 'USDT' | 'ETH' | 'BNB' | 'NATIVE';

interface PaymentDetails {
  network: CryptoNetwork;
  token: CryptoToken;
  fromAddress: string;
  toAddress: string;
  amount: string;
  txHash: string;
  blockNumber: number;
  confirmations: number;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
}

interface ListenerConfig {
  network: CryptoNetwork;
  token: CryptoToken;
  rpcUrl: string;
  contractAddress?: string; // For ERC20/BEP20 tokens
  recipientAddress: string;
  confirmationsRequired: number;
  onPaymentDetected: (payment: PaymentDetails) => void;
  onPaymentConfirmed: (payment: PaymentDetails) => void;
}

export class CryptoPaymentListener {
  private provider: ethers.JsonRpcProvider;
  private config: ListenerConfig;
  private isListening: boolean = false;
  private pendingPayments: Map<string, PaymentDetails> = new Map();

  // USDT Contract Addresses
  static readonly USDT_CONTRACTS = {
    ETH: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    BSC: '0x55d398326f99059fF775485246999027B3197955',
    TRON: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
  };

  // Minimum Confirmations
  static readonly MIN_CONFIRMATIONS = {
    ETH: 6,
    BSC: 15,
    TRON: 20,
  };

  constructor(config: ListenerConfig) {
    this.config = config;
    this.provider = new ethers.JsonRpcProvider(config.rpcUrl);
  }

  /**
   * Start listening for payments
   */
  async startListening(): Promise<void> {
    if (this.isListening) {
      console.warn('Listener already running');
      return;
    }

    this.isListening = true;
    console.log(`Started listening on ${this.config.network} for ${this.config.recipientAddress}`);

    if (this.config.token === 'NATIVE') {
      // Listen for native currency (ETH/BNB)
      await this.listenNativeTransfers();
    } else {
      // Listen for ERC20/BEP20 token transfers
      await this.listenTokenTransfers();
    }
  }

  /**
   * Stop listening
   */
  stopListening(): void {
    this.isListening = false;
    this.provider.removeAllListeners();
    console.log('Stopped listening');
  }

  /**
   * Listen for native currency transfers (ETH/BNB)
   */
  private async listenNativeTransfers(): Promise<void> {
    const _filter = {
      address: this.config.recipientAddress,
    };

    this.provider.on('block', async (blockNumber: number) => {
      if (!this.isListening) return;

      try {
        const block = await this.provider.getBlock(blockNumber, true);
        if (!block || !block.transactions) return;

        for (const txData of block.transactions) {
          if (typeof txData === 'string') continue;
          
          // Type assertion for transaction object
          const tx = txData as {
            to?: string;
            from?: string;
            value?: bigint;
            hash?: string;
          };
          
          if (tx.to?.toLowerCase() === this.config.recipientAddress.toLowerCase() && 
              tx.value && tx.value > BigInt(0)) {
            const payment: PaymentDetails = {
              network: this.config.network,
              token: this.config.token,
              fromAddress: tx.from || '',
              toAddress: tx.to || '',
              amount: ethers.formatEther(tx.value),
              txHash: tx.hash || '',
              blockNumber: blockNumber,
              confirmations: 0,
              timestamp: block.timestamp,
              status: 'pending',
            };

            this.pendingPayments.set(tx.hash || '', payment);
            this.config.onPaymentDetected(payment);
            this.trackConfirmations(tx.hash || '');
          }
        }
      } catch (error) {
        console.error('Error processing block:', error);
      }
    });
  }

  /**
   * Listen for ERC20/BEP20 token transfers
   */
  private async listenTokenTransfers(): Promise<void> {
    if (!this.config.contractAddress) {
      throw new Error('Contract address required for token transfers');
    }

    // ERC20 Transfer event signature
    const transferEventTopic = ethers.id('Transfer(address,address,uint256)');

    const filter = {
      address: this.config.contractAddress,
      topics: [
        transferEventTopic,
        null, // from (any address)
        ethers.zeroPadValue(this.config.recipientAddress, 32), // to (our address)
      ],
    };

    this.provider.on(filter, async (log: ethers.Log) => {
      if (!this.isListening) return;

      try {
        const iface = new ethers.Interface([
          'event Transfer(address indexed from, address indexed to, uint256 value)',
        ]);

        const parsedLog = iface.parseLog({
          topics: log.topics as string[],
          data: log.data,
        });

        if (!parsedLog) return;

        const tx = await this.provider.getTransaction(log.transactionHash);
        if (!tx) return;

        const payment: PaymentDetails = {
          network: this.config.network,
          token: this.config.token,
          fromAddress: parsedLog.args.from,
          toAddress: parsedLog.args.to,
          amount: ethers.formatUnits(parsedLog.args.value, 6), // USDT has 6 decimals
          txHash: log.transactionHash,
          blockNumber: log.blockNumber,
          confirmations: 0,
          timestamp: Date.now() / 1000,
          status: 'pending',
        };

        this.pendingPayments.set(log.transactionHash, payment);
        this.config.onPaymentDetected(payment);
        this.trackConfirmations(log.transactionHash);
      } catch (error) {
        console.error('Error processing token transfer:', error);
      }
    });
  }

  /**
   * Track confirmation count for a transaction
   */
  private async trackConfirmations(txHash: string): Promise<void> {
    const payment = this.pendingPayments.get(txHash);
    if (!payment) return;

    const checkConfirmations = async () => {
      try {
        const tx = await this.provider.getTransaction(txHash);
        if (!tx || !tx.blockNumber) {
          setTimeout(checkConfirmations, 5000);
          return;
        }

        const currentBlock = await this.provider.getBlockNumber();
        const confirmations = currentBlock - tx.blockNumber + 1;

        payment.confirmations = confirmations;

        if (confirmations >= this.config.confirmationsRequired) {
          payment.status = 'confirmed';
          this.config.onPaymentConfirmed(payment);
          this.pendingPayments.delete(txHash);
        } else {
          setTimeout(checkConfirmations, 15000); // Check every 15 seconds
        }
      } catch (error) {
        console.error('Error tracking confirmations:', error);
        payment.status = 'failed';
        this.pendingPayments.delete(txHash);
      }
    };

    checkConfirmations();
  }

  /**
   * Manually check if a transaction exists
   */
  async verifyTransaction(txHash: string): Promise<PaymentDetails | null> {
    try {
      const tx = await this.provider.getTransaction(txHash);
      if (!tx) return null;

      const receipt = await this.provider.getTransactionReceipt(txHash);
      if (!receipt) return null;

      const currentBlock = await this.provider.getBlockNumber();
      const confirmations = currentBlock - receipt.blockNumber + 1;

      let payment: PaymentDetails;

      if (this.config.token === 'NATIVE') {
        payment = {
          network: this.config.network,
          token: this.config.token,
          fromAddress: tx.from,
          toAddress: tx.to || '',
          amount: ethers.formatEther(tx.value),
          txHash: tx.hash,
          blockNumber: receipt.blockNumber,
          confirmations,
          timestamp: Date.now() / 1000,
          status: confirmations >= this.config.confirmationsRequired ? 'confirmed' : 'pending',
        };
      } else {
        // Parse token transfer from logs
        const transferLog = receipt.logs.find(log => 
          log.address.toLowerCase() === this.config.contractAddress?.toLowerCase()
        );

        if (!transferLog) return null;

        const iface = new ethers.Interface([
          'event Transfer(address indexed from, address indexed to, uint256 value)',
        ]);

        const parsedLog = iface.parseLog({
          topics: transferLog.topics as string[],
          data: transferLog.data,
        });

        if (!parsedLog) return null;

        payment = {
          network: this.config.network,
          token: this.config.token,
          fromAddress: parsedLog.args.from,
          toAddress: parsedLog.args.to,
          amount: ethers.formatUnits(parsedLog.args.value, 6),
          txHash: tx.hash,
          blockNumber: receipt.blockNumber,
          confirmations,
          timestamp: Date.now() / 1000,
          status: confirmations >= this.config.confirmationsRequired ? 'confirmed' : 'pending',
        };
      }

      return payment;
    } catch (error) {
      console.error('Error verifying transaction:', error);
      return null;
    }
  }

  /**
   * Get current balance
   */
  async getBalance(): Promise<string> {
    try {
      if (this.config.token === 'NATIVE') {
        const balance = await this.provider.getBalance(this.config.recipientAddress);
        return ethers.formatEther(balance);
      } else {
        if (!this.config.contractAddress) {
          throw new Error('Contract address required');
        }

        const contract = new ethers.Contract(
          this.config.contractAddress,
          ['function balanceOf(address) view returns (uint256)'],
          this.provider
        );

        const balance = await contract.balanceOf(this.config.recipientAddress);
        return ethers.formatUnits(balance, 6); // USDT has 6 decimals
      }
    } catch (error) {
      console.error('Error getting balance:', error);
      throw error;
    }
  }
}

// Example usage:
/*
// Listen for USDT on Ethereum
const usdtListener = new CryptoPaymentListener({
  network: 'ETH',
  rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY',
  contractAddress: CryptoPaymentListener.USDT_CONTRACTS.ETH,
  recipientAddress: '0xYourWalletAddress',
  confirmationsRequired: 6,
  onPaymentDetected: (payment) => {
    console.log('Payment detected:', payment);
    // Save to database with status 'pending'
  },
  onPaymentConfirmed: (payment) => {
    console.log('Payment confirmed:', payment);
    // Update database status to 'confirmed'
    // Allocate tokens to user
  },
});

await usdtListener.startListening();

// Listen for ETH
const ethListener = new CryptoPaymentListener({
  network: 'ETH',
  rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY',
  recipientAddress: '0xYourWalletAddress',
  confirmationsRequired: 6,
  token: 'NATIVE',
  onPaymentDetected: (payment) => {
    console.log('ETH payment detected:', payment);
  },
  onPaymentConfirmed: (payment) => {
    console.log('ETH payment confirmed:', payment);
  },
});

await ethListener.startListening();

// Manually verify a transaction
const payment = await usdtListener.verifyTransaction('0xTransactionHash');
if (payment && payment.status === 'confirmed') {
  console.log('Transaction verified:', payment);
}
*/
