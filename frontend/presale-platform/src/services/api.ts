/**
 * VNC Blockchain API Service
 * Centralized API calls to backend server
 * Replaces localStorage-based authentication
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('vnc_auth_token');
};

// Helper function to get auth headers
const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Error handler
class APIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public errors?: string[]
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// Generic fetch wrapper
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new APIError(
        data.message || 'API request failed',
        response.status,
        data.errors
      );
    }

    return data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError('Network error occurred');
  }
}

// ============================================
// AUTHENTICATION APIs
// ============================================

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  twoFactorCode?: string;
}

export interface Transaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  created_at: string;
  [key: string]: unknown;
}

export interface TransactionsResponse {
  transactions: Transaction[];
  total: number;
}

export interface Deposit {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  payment_method: string;
  [key: string]: unknown;
}

export interface Purchase {
  id: string;
  amount: number;
  vnc_amount: number;
  status: string;
  created_at: string;
  [key: string]: unknown;
}

export interface PresaleStage {
  id: string;
  name: string;
  price: number;
  target_amount: number;
  current_amount: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  [key: string]: unknown;
}

export interface AdminStats {
  total_users: number;
  total_deposits: number;
  total_purchases: number;
  total_revenue: number;
  [key: string]: unknown;
}

export interface AuditLog {
  id: string;
  action: string;
  user_id: string;
  details: string;
  created_at: string;
  [key: string]: unknown;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    wallet_address: string;
    two_fa_enabled: boolean;
  };
  requires2FA?: boolean;
}

export const authAPI = {
  /**
   * Register new user
   */
  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    const response = await apiFetch<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data)
    });

    // Store token and user info
    if (response.token) {
      localStorage.setItem('vnc_auth_token', response.token);
      localStorage.setItem('vnc_user', JSON.stringify(response.user));
    }

    return response;
  },

  /**
   * Login user
   */
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiFetch<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data)
    });

    // Store token if 2FA not required
    if (response.token && !response.requires2FA) {
      localStorage.setItem('vnc_auth_token', response.token);
      localStorage.setItem('vnc_user', JSON.stringify(response.user));
    }

    return response;
  },

  /**
   * Verify 2FA code
   */
  verify2FA: async (code: string): Promise<AuthResponse> => {
    const response = await apiFetch<AuthResponse>('/auth/verify-2fa', {
      method: 'POST',
      body: JSON.stringify({ code })
    });

    if (response.token) {
      localStorage.setItem('vnc_auth_token', response.token);
      localStorage.setItem('vnc_user', JSON.stringify(response.user));
    }

    return response;
  },

  /**
   * Setup 2FA (get QR code)
   */
  setup2FA: async (): Promise<{ qrCode: string; secret: string; manual: string }> => {
    return apiFetch('/auth/setup-2fa', { method: 'POST' });
  },

  /**
   * Enable 2FA
   */
  enable2FA: async (code: string): Promise<{ message: string }> => {
    return apiFetch('/auth/enable-2fa', {
      method: 'POST',
      body: JSON.stringify({ code })
    });
  },

  /**
   * Disable 2FA
   */
  disable2FA: async (code: string): Promise<{ message: string }> => {
    return apiFetch('/auth/disable-2fa', {
      method: 'POST',
      body: JSON.stringify({ code })
    });
  },

  /**
   * Logout user
   */
  logout: () => {
    localStorage.removeItem('vnc_auth_token');
    localStorage.removeItem('vnc_user');
    localStorage.removeItem('vnc_user_email');
    localStorage.removeItem('vnc_user_role');
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return !!getAuthToken();
  },

  /**
   * Get current user from localStorage
   */
  getCurrentUser: () => {
    const userStr = localStorage.getItem('vnc_user');
    return userStr ? JSON.parse(userStr) : null;
  }
};

// ============================================
// USER APIs
// ============================================

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: string;
  wallet_address: string;
  kyc_status: string;
  two_fa_enabled: boolean;
  total_invested: number;
  tokens_owned: number;
  inr_balance: number;
  vnc_balance: number;
  eth_balance: number;
  usdt_balance: number;
  is_active: boolean;
  is_suspended: boolean;
  created_at: string;
  last_login: string | null;
}

export interface Balance {
  inr_balance: number;
  vnc_balance: number;
  eth_balance: number;
  usdt_balance: number;
}

export const userAPI = {
  /**
   * Get current user profile
   */
  getProfile: async (): Promise<{ user: User }> => {
    return apiFetch('/users/me', { method: 'GET' });
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: { name?: string; phone?: string }): Promise<{ user: User }> => {
    return apiFetch('/users/me', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  /**
   * Get user balance
   */
  getBalance: async (): Promise<{ balance: Balance }> => {
    return apiFetch('/users/balance', { method: 'GET' });
  },

  /**
   * Get user transactions
   */
  getTransactions: async (limit = 50, offset = 0): Promise<TransactionsResponse> => {
    return apiFetch(`/users/transactions?limit=${limit}&offset=${offset}`, {
      method: 'GET'
    });
  }
};

// ============================================
// DEPOSIT APIs
// ============================================

export interface CreateDepositRequest {
  amount: number;
  paymentMethod: 'upi' | 'card' | 'netbanking';
}

export interface CreateDepositResponse {
  status: string;
  orderId: string;
  paymentSessionId: string;
  amount: number;
}

export const depositAPI = {
  /**
   * Create deposit order
   */
  createOrder: async (data: CreateDepositRequest): Promise<CreateDepositResponse> => {
    return apiFetch('/deposits/create-order', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  /**
   * Get deposit history
   */
  getDeposits: async (): Promise<{ deposits: Deposit[] }> => {
    return apiFetch('/deposits', { method: 'GET' });
  },

  /**
   * Get deposit details
   */
  getDeposit: async (id: string): Promise<{ deposit: Deposit }> => {
    return apiFetch(`/deposits/${id}`, { method: 'GET' });
  }
};

// ============================================
// PRESALE APIs
// ============================================

export interface PresaleStatus {
  presale: {
    id: string;
    stage: number;
    price_inr: number;
    price_usd: number;
    tokens_sold: number;
    tokens_available: number;
    total_raised: number;
    participants: number;
    is_active: boolean;
  };
}

export interface PurchaseRequest {
  amountINR: number;
  paymentMethod: 'INR' | 'CRYPTO';
}

export const presaleAPI = {
  /**
   * Get presale status
   */
  getStatus: async (): Promise<PresaleStatus> => {
    return apiFetch('/presale/status', { method: 'GET' });
  },

  /**
   * Get all presale stages
   */
  getStages: async (): Promise<{ stages: PresaleStage[] }> => {
    return apiFetch('/presale/stages', { method: 'GET' });
  },

  /**
   * Purchase VNC tokens
   */
  purchase: async (data: PurchaseRequest): Promise<{ purchase: Purchase }> => {
    return apiFetch('/presale/purchase', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  /**
   * Get my purchases
   */
  getMyPurchases: async (): Promise<{ purchases: Purchase[] }> => {
    return apiFetch('/presale/my-purchases', { method: 'GET' });
  }
};

// ============================================
// ADMIN APIs (Super Admin / Admin only)
// ============================================

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  kyc_status: string;
  suspended: boolean;
  [key: string]: unknown;
}

export const adminAPI = {
  /**
   * Get all users
   */
  getUsers: async (params?: {
    limit?: number;
    offset?: number;
    role?: string;
    kyc_status?: string;
  }): Promise<{ users: User[]; total: number }> => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return apiFetch(`/admin/users?${query}`, { method: 'GET' });
  },

  /**
   * Approve/Reject KYC
   */
  updateKYC: async (
    userId: string,
    status: 'APPROVED' | 'REJECTED',
    reason?: string
  ): Promise<{ user: User }> => {
    return apiFetch(`/admin/users/${userId}/kyc`, {
      method: 'PUT',
      body: JSON.stringify({ status, reason })
    });
  },

  /**
   * Suspend/Unsuspend user
   */
  suspendUser: async (userId: string, suspended: boolean): Promise<{ user: User }> => {
    return apiFetch(`/admin/users/${userId}/suspend`, {
      method: 'PUT',
      body: JSON.stringify({ suspended })
    });
  },

  /**
   * Get admin stats
   */
  getStats: async (): Promise<{ stats: AdminStats }> => {
    return apiFetch('/admin/stats', { method: 'GET' });
  },

  /**
   * Get audit logs
   */
  getAuditLogs: async (limit = 100, offset = 0): Promise<{ logs: AuditLog[]; total: number }> => {
    return apiFetch(`/admin/audit-logs?limit=${limit}&offset=${offset}`, {
      method: 'GET'
    });
  }
};

// ============================================
// EXPORT ALL
// ============================================

const api = {
  auth: authAPI,
  user: userAPI,
  deposit: depositAPI,
  presale: presaleAPI,
  admin: adminAPI
};

export default api;
