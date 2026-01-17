/**
 * VNC Blockchain - Real-Time Data Hooks
 * React hooks for connecting components to the data synchronization service
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import dataStore, { 
  User, Transaction, Block, Validator, PresaleData, SystemStats,
  getCurrentUser, isAuthenticated, isSuperAdmin
} from '@/services/dataSync.service';

// ============================================================================
// USER HOOKS
// ============================================================================

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(getCurrentUser());
    setLoading(false);

    const unsubscribe = dataStore.subscribe('userUpdated', (...args: unknown[]) => {
      const updatedUser = args[0] as User;
      if (user && updatedUser.id === user.id) {
        setUser(updatedUser);
      }
    });

    return unsubscribe;
  }, [user]);

  return { user, loading, isAuthenticated: !!user };
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUsers(dataStore.getUsers());
    setLoading(false);

    const unsubscribeCreate = dataStore.subscribe('userCreated', (...args: unknown[]) => {
      const newUser = args[0] as User;
      setUsers(prev => [...prev, newUser]);
    });

    const unsubscribeUpdate = dataStore.subscribe('userUpdated', (...args: unknown[]) => {
      const updatedUser = args[0] as User;
      setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    });

    return () => {
      unsubscribeCreate();
      unsubscribeUpdate();
    };
  }, []);

  return { users, loading };
}

export function useUser(userId: string) {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(dataStore.getUser(userId));
    setLoading(false);

    const unsubscribe = dataStore.subscribe('userUpdated', (...args: unknown[]) => {
      const updatedUser = args[0] as User;
      if (updatedUser.id === userId) {
        setUser(updatedUser);
      }
    });

    return unsubscribe;
  }, [userId]);

  return { user, loading };
}

// ============================================================================
// TRANSACTION HOOKS
// ============================================================================

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTransactions(dataStore.getTransactions());
    setLoading(false);

    const unsubscribeCreate = dataStore.subscribe('transactionCreated', (...args: unknown[]) => {
      const newTx = args[0] as Transaction;
      setTransactions(prev => [newTx, ...prev]);
    });

    const unsubscribeUpdate = dataStore.subscribe('transactionUpdated', (...args: unknown[]) => {
      const updatedTx = args[0] as Transaction;
      setTransactions(prev => prev.map(tx => tx.id === updatedTx.id ? updatedTx : tx));
    });

    return () => {
      unsubscribeCreate();
      unsubscribeUpdate();
    };
  }, []);

  return { transactions, loading };
}

export function useUserTransactions(userId?: string) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useCurrentUser();

  useEffect(() => {
    const targetUserId = userId || user?.id;
    if (!targetUserId) {
      setLoading(false);
      return;
    }

    setTransactions(dataStore.getUserTransactions(targetUserId));
    setLoading(false);

    const unsubscribeCreate = dataStore.subscribe('transactionCreated', (...args: unknown[]) => {
      const newTx = args[0] as Transaction;
      if (newTx.userId === targetUserId) {
        setTransactions(prev => [newTx, ...prev]);
      }
    });

    const unsubscribeUpdate = dataStore.subscribe('transactionUpdated', (...args: unknown[]) => {
      const updatedTx = args[0] as Transaction;
      if (updatedTx.userId === targetUserId) {
        setTransactions(prev => prev.map(tx => tx.id === updatedTx.id ? updatedTx : tx));
      }
    });

    return () => {
      unsubscribeCreate();
      unsubscribeUpdate();
    };
  }, [userId, user?.id]);

  return { transactions, loading };
}

// ============================================================================
// BLOCK HOOKS
// ============================================================================

export function useBlocks(limit?: number) {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const allBlocks = dataStore.getBlocks();
    setBlocks(limit ? allBlocks.slice(0, limit) : allBlocks);
    setLoading(false);

    const unsubscribe = dataStore.subscribe('blockCreated', (...args: unknown[]) => {
      const newBlock = args[0] as Block;
      setBlocks(prev => {
        const updated = [newBlock, ...prev];
        return limit ? updated.slice(0, limit) : updated;
      });
    });

    return unsubscribe;
  }, [limit]);

  return { blocks, loading };
}

export function useLatestBlock() {
  const [block, setBlock] = useState<Block | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const blocks = dataStore.getBlocks();
    setBlock(blocks[0] || null);
    setLoading(false);

    const unsubscribe = dataStore.subscribe('blockCreated', (...args: unknown[]) => {
      const newBlock = args[0] as Block;
      setBlock(newBlock);
    });

    return unsubscribe;
  }, []);

  return { block, loading };
}

// ============================================================================
// VALIDATOR HOOKS
// ============================================================================

export function useValidators() {
  const [validators, setValidators] = useState<Validator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setValidators(dataStore.getValidators());
    setLoading(false);

    const unsubscribe = dataStore.subscribe('validatorUpdated', (...args: unknown[]) => {
      const updatedValidator = args[0] as Validator;
      setValidators(prev => prev.map(v => v.id === updatedValidator.id ? updatedValidator : v));
    });

    return unsubscribe;
  }, []);

  return { validators, loading };
}

export function useValidator(validatorId: string) {
  const [validator, setValidator] = useState<Validator | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setValidator(dataStore.getValidator(validatorId));
    setLoading(false);

    const unsubscribe = dataStore.subscribe('validatorUpdated', (...args: unknown[]) => {
      const updatedValidator = args[0] as Validator;
      if (updatedValidator.id === validatorId) {
        setValidator(updatedValidator);
      }
    });

    return unsubscribe;
  }, [validatorId]);

  return { validator, loading };
}

// ============================================================================
// PRESALE HOOKS
// ============================================================================

export function usePresale() {
  const [presaleData, setPresaleData] = useState<PresaleData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPresaleData(dataStore.getPresaleData());
    setLoading(false);

    const unsubscribe = dataStore.subscribe('presaleUpdated', (...args: unknown[]) => {
      const updated = args[0] as PresaleData;
      setPresaleData(updated);
    });

    return unsubscribe;
  }, []);

  const purchaseTokens = useCallback(async (amountINR: number) => {
    const user = getCurrentUser();
    if (!user) throw new Error('User not authenticated');
    
    try {
      const transaction = dataStore.purchasePresaleTokens(user.id, amountINR);
      return transaction;
    } catch (error) {
      console.error('Presale purchase failed:', error);
      throw error;
    }
  }, []);

  return { presaleData, loading, purchaseTokens };
}

// ============================================================================
// SYSTEM STATS HOOKS
// ============================================================================

export function useSystemStats() {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setStats(dataStore.getSystemStats());
    setLoading(false);

    const unsubscribe = dataStore.subscribe('statsUpdated', (...args: unknown[]) => {
      const updated = args[0] as SystemStats;
      setStats(updated);
    });

    return unsubscribe;
  }, []);

  return { stats, loading };
}

// ============================================================================
// WALLET HOOKS
// ============================================================================

export function useWallet() {
  const { user } = useCurrentUser();
  const [wallet, setWallet] = useState(user?.wallet || null);

  useEffect(() => {
    if (user) {
      setWallet(user.wallet);
    }

    const unsubscribe = dataStore.subscribe('userUpdated', (...args: unknown[]) => {
      const updatedUser = args[0] as User;
      if (user && updatedUser.id === user.id) {
        setWallet(updatedUser.wallet);
      }
    });

    return unsubscribe;
  }, [user]);

  const deposit = useCallback(async (amount: number, currency: string) => {
    if (!user) throw new Error('User not authenticated');

    const transaction = dataStore.createTransaction({
      type: 'deposit',
      userId: user.id,
      amount,
      currency,
      status: 'completed',
      timestamp: new Date().toISOString(),
    });

    return transaction;
  }, [user]);

  const withdraw = useCallback(async (amount: number, currency: string) => {
    if (!user) throw new Error('User not authenticated');

    const transaction = dataStore.createTransaction({
      type: 'withdrawal',
      userId: user.id,
      amount,
      currency,
      status: 'pending',
      timestamp: new Date().toISOString(),
    });

    return transaction;
  }, [user]);

  const transfer = useCallback(async (toAddress: string, amount: number, currency: string) => {
    if (!user) throw new Error('User not authenticated');

    const transaction = dataStore.createTransaction({
      type: 'transfer',
      userId: user.id,
      amount,
      currency,
      status: 'completed',
      timestamp: new Date().toISOString(),
      txHash: `0x${Math.random().toString(16).substring(2, 66)}`,
    });

    return transaction;
  }, [user]);

  return { wallet, deposit, withdraw, transfer };
}

// ============================================================================
// AUTHENTICATION HOOKS
// ============================================================================

export function useAuth() {
  const [authenticated, setAuthenticated] = useState(false);
  const [role, setRole] = useState<string>('guest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setAuthenticated(isAuthenticated());
    const user = getCurrentUser();
    setRole(user?.role || 'guest');
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, _password: string) => {
    // Mock login - replace with actual API call
    const user = dataStore.getUserByEmail(email);
    if (user) {
      localStorage.setItem('vnc_auth_token', 'mock_token_' + Date.now());
      localStorage.setItem('vnc_user_email', email);
      setAuthenticated(true);
      setRole(user.role);
      return user;
    }
    throw new Error('Invalid credentials');
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('vnc_auth_token');
    localStorage.removeItem('vnc_user_email');
    setAuthenticated(false);
    setRole('guest');
  }, []);

  const signup = useCallback(async (email: string, _password: string, name: string) => {
    // Mock signup - replace with actual API call
    const user = dataStore.createUser({
      email,
      name,
      walletAddress: `0x${Math.random().toString(16).substring(2, 42)}`,
      role: 'user',
      kyc: {
        status: 'pending',
        documents: [],
      },
      presale: {
        totalInvested: 0,
        tokensOwned: 0,
        vestingSchedule: [],
      },
      wallet: {
        inrBalance: 0,
        vncBalance: 0,
        ethBalance: 0,
        usdtBalance: 0,
      },
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
    });

    localStorage.setItem('vnc_auth_token', 'mock_token_' + Date.now());
    localStorage.setItem('vnc_user_email', email);
    setAuthenticated(true);
    setRole(user.role);
    return user;
  }, []);

  return { 
    authenticated, 
    role, 
    loading,
    isSuperAdmin: role === 'super-admin',
    isValidator: role === 'validator',
    isAdmin: role === 'admin' || role === 'super-admin',
    login, 
    logout, 
    signup 
  };
}

// ============================================================================
// REAL-TIME DATA CHANGE HOOK
// ============================================================================

export function useDataChanges() {
  const [changes, setChanges] = useState<unknown[]>([]);

  useEffect(() => {
    const unsubscribe = dataStore.subscribe('dataChanged', (...args: unknown[]) => {
      const change = args[0];
      setChanges(prev => [change, ...prev].slice(0, 100)); // Keep last 100 changes
    });

    return unsubscribe;
  }, []);

  return { changes };
}

// ============================================================================
// KYC HOOKS
// ============================================================================

export function useKYC() {
  const { user } = useCurrentUser();

  const submitKYC = useCallback(async (documents: Record<string, unknown>[]) => {
    if (!user) throw new Error('User not authenticated');

    const updatedUser = dataStore.updateUser(user.id, {
      kyc: {
        status: 'pending',
        documents,
      },
    });

    return updatedUser;
  }, [user]);

  const approveKYC = useCallback(async (userId: string) => {
    if (!isSuperAdmin()) throw new Error('Unauthorized');

    const existingUser = dataStore.getUser(userId);
    if (!existingUser) throw new Error('User not found');

    const updatedUser = dataStore.updateUser(userId, {
      kyc: {
        ...existingUser.kyc,
        status: 'verified',
      },
    });

    return updatedUser;
  }, []);

  const rejectKYC = useCallback(async (userId: string) => {
    if (!isSuperAdmin()) throw new Error('Unauthorized');

    const existingUser = dataStore.getUser(userId);
    if (!existingUser) throw new Error('User not found');

    const updatedUser = dataStore.updateUser(userId, {
      kyc: {
        ...existingUser.kyc,
        status: 'rejected',
      },
    });

    return updatedUser;
  }, []);

  return { 
    kycStatus: user?.kyc.status,
    submitKYC, 
    approveKYC, 
    rejectKYC 
  };
}
