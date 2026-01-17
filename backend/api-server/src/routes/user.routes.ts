/**
 * User Routes
 */

import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import prisma from '../config/database';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

/**
 * GET /api/users/me
 * Get current user profile
 */
router.get('/me', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        wallet_address: true,
        kyc_status: true,
        two_fa_enabled: true,
        total_invested: true,
        tokens_owned: true,
        inr_balance: true,
        vnc_balance: true,
        eth_balance: true,
        usdt_balance: true,
        is_active: true,
        is_suspended: true,
        created_at: true,
        last_login: true
      }
    });

    if (!user) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found'
      });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch user'
    });
  }
});

/**
 * PUT /api/users/me
 * Update user profile
 */
router.put('/me',
  authenticate,
  [
    body('name').optional().trim().notEmpty(),
    body('phone').optional().isMobilePhone('any')
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userId = req.user!.id;
      const { name, phone } = req.body;

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          ...(name && { name }),
          ...(phone && { phone })
        },
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          role: true,
          wallet_address: true
        }
      });

      res.json({
        message: 'Profile updated successfully',
        user: updatedUser
      });
    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to update profile'
      });
    }
  }
);

/**
 * GET /api/users/balance
 * Get user balances
 */
router.get('/balance', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        inr_balance: true,
        vnc_balance: true,
        eth_balance: true,
        usdt_balance: true
      }
    });

    if (!user) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found'
      });
    }

    res.json({ balance: user });
  } catch (error) {
    console.error('Get balance error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch balance'
    });
  }
});

/**
 * GET /api/users/transactions
 * Get user transactions
 */
router.get('/transactions', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { limit = 50, offset = 0 } = req.query;

    const transactions = await prisma.transaction.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      take: Number(limit),
      skip: Number(offset)
    });

    const total = await prisma.transaction.count({
      where: { user_id: userId }
    });

    res.json({
      transactions,
      pagination: {
        total,
        limit: Number(limit),
        offset: Number(offset)
      }
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch transactions'
    });
  }
});

export default router;
