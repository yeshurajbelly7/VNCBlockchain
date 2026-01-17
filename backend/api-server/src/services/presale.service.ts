/**
 * Presale Smart Contract Service
 * Interacts with VNCPresale.sol
 */

import { ethers } from 'ethers';
import { promises as fs } from 'fs';
import path from 'path';

// Contract configuration
const PRESALE_CONTRACT_ADDRESS = process.env.PRESALE_CONTRACT_ADDRESS!;
const NETWORK_RPC_URL = process.env.NETWORK_RPC_URL!;
const PRIVATE_KEY = process.env.PRIVATE_KEY!;

let contract: ethers.Contract;
let provider: ethers.JsonRpcProvider;
let signer: ethers.Wallet;

/**
 * Initialize presale contract
 */
export async function initializePresaleContract(): Promise<void> {
  try {
    // Load contract ABI
    const abiPath = path.join(__dirname, '../../contracts/VNCPresale.json');
    const abiData = await fs.readFile(abiPath, 'utf-8');
    const abi = JSON.parse(abiData).abi;

    // Create provider and signer
    provider = new ethers.JsonRpcProvider(NETWORK_RPC_URL);
    signer = new ethers.Wallet(PRIVATE_KEY, provider);

    // Create contract instance
    contract = new ethers.Contract(PRESALE_CONTRACT_ADDRESS, abi, signer);

    console.log('✅ Presale contract initialized');
    console.log('📍 Contract address:', PRESALE_CONTRACT_ADDRESS);
  } catch (error) {
    console.error('❌ Failed to initialize presale contract:', error);
    throw error;
  }
}

/**
 * Get current presale stage
 */
export async function getCurrentStage(): Promise<number> {
  try {
    const stage = await contract.currentStage();
    return Number(stage);
  } catch (error) {
    console.error('Error getting current stage:', error);
    throw error;
  }
}

/**
 * Get stage configuration
 */
export async function getStageConfig(stage: number) {
  try {
    const config = await contract.stageConfigs(stage);
    return {
      tokenPrice: ethers.formatUnits(config.tokenPrice, 18),
      tokensAvailable: ethers.formatUnits(config.tokensAvailable, 18),
      tokensSold: ethers.formatUnits(config.tokensSold, 18),
      startTime: Number(config.startTime),
      endTime: Number(config.endTime)
    };
  } catch (error) {
    console.error('Error getting stage config:', error);
    throw error;
  }
}

/**
 * Buy tokens with ETH
 */
export async function buyTokensWithETH(
  userAddress: string,
  amountETH: string
): Promise<{ txHash: string; tokensReceived: string }> {
  try {
    const tx = await contract.buyTokens({
      value: ethers.parseEther(amountETH)
    });

    const receipt = await tx.wait();

    // Parse TokensPurchased event
    const event = receipt.logs.find((log: any) => {
      try {
        return contract.interface.parseLog(log)?.name === 'TokensPurchased';
      } catch {
        return false;
      }
    });

    let tokensReceived = '0';
    if (event) {
      const parsed = contract.interface.parseLog(event);
      tokensReceived = ethers.formatUnits(parsed?.args[1], 18);
    }

    return {
      txHash: receipt.hash,
      tokensReceived
    };
  } catch (error) {
    console.error('Error buying tokens with ETH:', error);
    throw error;
  }
}

/**
 * Buy tokens with USDT/stablecoin
 */
export async function buyTokensWithStablecoin(
  userAddress: string,
  tokenAddress: string,
  amount: string
): Promise<{ txHash: string; tokensReceived: string }> {
  try {
    // First, user needs to approve the presale contract to spend their tokens
    // This should be done on the frontend

    const tx = await contract.buyTokensWithStablecoin(
      tokenAddress,
      ethers.parseUnits(amount, 6) // USDT has 6 decimals
    );

    const receipt = await tx.wait();

    // Parse TokensPurchased event
    const event = receipt.logs.find((log: any) => {
      try {
        return contract.interface.parseLog(log)?.name === 'TokensPurchased';
      } catch {
        return false;
      }
    });

    let tokensReceived = '0';
    if (event) {
      const parsed = contract.interface.parseLog(event);
      tokensReceived = ethers.formatUnits(parsed?.args[1], 18);
    }

    return {
      txHash: receipt.hash,
      tokensReceived
    };
  } catch (error) {
    console.error('Error buying tokens with stablecoin:', error);
    throw error;
  }
}

/**
 * Get user purchase details
 */
export async function getUserPurchase(userAddress: string) {
  try {
    const purchase = await contract.purchases(userAddress);
    return {
      totalTokens: ethers.formatUnits(purchase.totalTokens, 18),
      claimedTokens: ethers.formatUnits(purchase.claimedTokens, 18),
      purchaseTime: Number(purchase.purchaseTime),
      exists: purchase.exists
    };
  } catch (error) {
    console.error('Error getting user purchase:', error);
    throw error;
  }
}

/**
 * Calculate tokens for INR amount
 */
export async function calculateTokensForINR(amountINR: number, stage: number): Promise<string> {
  try {
    const config = await getStageConfig(stage);
    const priceINR = parseFloat(config.tokenPrice) * 83; // Assuming 1 USD = ₹83
    const tokens = amountINR / priceINR;
    return tokens.toFixed(2);
  } catch (error) {
    console.error('Error calculating tokens:', error);
    throw error;
  }
}

/**
 * Get total raised amount
 */
export async function getTotalRaised(): Promise<string> {
  try {
    const totalRaised = await contract.totalRaised();
    return ethers.formatEther(totalRaised);
  } catch (error) {
    console.error('Error getting total raised:', error);
    throw error;
  }
}

/**
 * Get total participants
 */
export async function getTotalParticipants(): Promise<number> {
  try {
    const participants = await contract.totalParticipants();
    return Number(participants);
  } catch (error) {
    console.error('Error getting total participants:', error);
    throw error;
  }
}

/**
 * Admin: Advance to next stage
 */
export async function advanceToNextStage(): Promise<string> {
  try {
    const tx = await contract.advanceStage();
    const receipt = await tx.wait();
    return receipt.hash;
  } catch (error) {
    console.error('Error advancing stage:', error);
    throw error;
  }
}

/**
 * Admin: Pause presale
 */
export async function pausePresale(): Promise<string> {
  try {
    const tx = await contract.pause();
    const receipt = await tx.wait();
    return receipt.hash;
  } catch (error) {
    console.error('Error pausing presale:', error);
    throw error;
  }
}

/**
 * Admin: Unpause presale
 */
export async function unpausePresale(): Promise<string> {
  try {
    const tx = await contract.unpause();
    const receipt = await tx.wait();
    return receipt.hash;
  } catch (error) {
    console.error('Error unpausing presale:', error);
    throw error;
  }
}
