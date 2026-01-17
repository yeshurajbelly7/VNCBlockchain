// Presale Configuration
export const PRESALE_CONFIG = {
  stages: [
    {
      id: 1,
      name: 'Stage 1',
      supply: 15_000_000_000, // 15 Billion VNC
      priceINR: 0.50,
      priceUSD: 0.006, // Approx $0.006
      status: 'active',
      startDate: '2025-01-01',
      endDate: '2025-02-15',
    },
    {
      id: 2,
      name: 'Stage 2',
      supply: 10_000_000_000, // 10 Billion VNC
      priceINR: 0.60,
      priceUSD: 0.0072,
      status: 'upcoming',
      startDate: '2025-02-16',
      endDate: '2025-03-15',
    },
    {
      id: 3,
      name: 'Stage 3',
      supply: 10_000_000_000, // 10 Billion VNC
      priceINR: 0.70,
      priceUSD: 0.0084,
      status: 'upcoming',
      startDate: '2025-03-16',
      endDate: '2025-04-15',
    },
  ],
  launchDate: '2025-04-16',
  launchPriceINR: 1.50,
  launchPriceUSD: 0.018,
  totalPresaleSupply: 35_000_000_000, // 35 Billion VNC
  minPurchaseINR: 500,
  maxPurchaseINR: 500000,
};

// Payment Gateway Configuration
export const PAYMENT_CONFIG = {
  INR: {
    razorpay: {
      enabled: true,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
      keySecret: process.env.RAZORPAY_KEY_SECRET || '',
    },
    cashfree: {
      enabled: true,
      appId: process.env.NEXT_PUBLIC_CASHFREE_APP_ID || '',
      secretKey: process.env.CASHFREE_SECRET_KEY || '',
    },
    phonePe: {
      enabled: true,
      merchantId: process.env.PHONEPE_MERCHANT_ID || '',
    },
  },
  CRYPTO: {
    usdt: {
      erc20: '0x...',
      trc20: 'T...',
      bep20: '0x...',
    },
    usdc: {
      erc20: '0x...',
    },
    eth: '0x...',
    bnb: '0x...',
  },
};

// Blockchain Configuration
export const BLOCKCHAIN_CONFIG = {
  VNC_CHAIN: {
    chainId: 20250,
    name: 'VNC Blockchain',
    rpcUrl: 'https://rpc.vncblockchain.com',
    explorerUrl: 'https://explorer.vncblockchain.com',
    nativeCurrency: {
      name: 'VNC',
      symbol: 'VNC',
      decimals: 18,
    },
  },
  ETHEREUM: {
    chainId: 1,
    name: 'Ethereum Mainnet',
    rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/...',
    explorerUrl: 'https://etherscan.io',
  },
  BSC: {
    chainId: 56,
    name: 'BNB Smart Chain',
    rpcUrl: 'https://bsc-dataseed.binance.org',
    explorerUrl: 'https://bscscan.com',
  },
  TRON: {
    fullNode: 'https://api.trongrid.io',
    solidityNode: 'https://api.trongrid.io',
    eventServer: 'https://api.trongrid.io',
  },
};

// Wallet Configuration
export const WALLET_CONFIG = {
  derivationPath: "m/44'/60'/0'/0",
  supportedChains: ['VNC', 'ETH', 'BSC', 'TRON'],
  encryptionAlgorithm: 'AES-256-GCM',
};

// KYC Configuration (Optional)
export const KYC_CONFIG = {
  enabled: false,
  required: false,
  provider: 'manual', // or 'digio', 'signdesk'
  documentsRequired: ['PAN', 'Aadhaar'],
};

// Vesting Configuration
export const VESTING_CONFIG = {
  enabled: true,
  claimDate: '2025-04-16', // Same as launch date
  vestingSchedule: [
    { percentage: 30, date: '2025-04-16' }, // 30% at launch
    { percentage: 35, date: '2025-05-16' }, // 35% after 1 month
    { percentage: 35, date: '2025-06-16' }, // 35% after 2 months
  ],
};

// Exchange Listing Information
export const EXCHANGE_CONFIG = {
  listings: [
    {
      exchange: 'VNC DEX',
      date: '2025-04-16',
      initialPrice: 1.50,
    },
    {
      exchange: 'Pancakeswap',
      date: '2025-04-20',
      status: 'planned',
    },
    {
      exchange: 'Uniswap',
      date: '2025-04-25',
      status: 'planned',
    },
  ],
};

// API Endpoints
export const API_ENDPOINTS = {
  auth: {
    signup: '/api/auth/signup',
    login: '/api/auth/login',
    verify: '/api/auth/verify-otp',
    logout: '/api/auth/logout',
  },
  presale: {
    purchase: '/api/presale/purchase',
    status: '/api/presale/status',
    userPurchases: '/api/presale/user-purchases',
  },
  wallet: {
    create: '/api/wallet/create',
    balance: '/api/wallet/balance',
    send: '/api/wallet/send',
    transactions: '/api/wallet/transactions',
  },
  payment: {
    createOrder: '/api/payment/create-order',
    verifyPayment: '/api/payment/verify',
    cryptoStatus: '/api/payment/crypto-status',
  },
};
