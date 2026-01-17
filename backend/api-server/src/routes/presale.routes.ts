/**
 * Presale Routes
 */

import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import prisma from '../config/database';
import { authenticate } from '../middleware/auth.middleware';
import {
  getCurrentStage,
  getStageConfig,
  calculateTokensForINR,
  getUserPurchase
} from '../services/presale.service';

const router = express.Router();

/**
 * GET /api/presale/status
 * Get presale status
 */
router.get('/status', async (req: Request, res: Response) => {
  try {
    const presale = await prisma.presale.findFirst({
      where: { is_active: true },
      orderBy: { stage: 'desc' }
    });

    if (!presale) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'No active presale found'
      });
    }

    res.json({ presale });
  } catch (error) {
    console.error('Get presale status error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch presale status'
    });
  }
});

/**
 * GET /api/presale/stages
 * Get all presale stages
 */
router.get('/stages', async (req: Request, res: Response) => {
  try {
    const stages = await prisma.presale.findMany({
      orderBy: { stage: 'asc' }
    });

    res.json({ stages });
  } catch (error) {
    console.error('Get presale stages error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch presale stages'
    });
  }
});

/**
 * POST /api/presale/purchase
 * Purchase VNC tokens
 */
router.post('/purchase',
  authenticate,
  [
    body('amountINR').isFloat({ min: 5000, max: 200000 }),
    body('paymentMethod').isIn(['INR', 'CRYPTO'])
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userId = req.user!.id;
      const { amountINR, paymentMethod } = req.body;

      // Get active presale
      const presale = await prisma.presale.findFirst({
        where: { is_active: true }
      });

      if (!presale) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'No active presale'
        });
      }

      // Calculate tokens
      const tokensAmount = amountINR / presale.price_inr;

      // Check if enough tokens available
      if (presale.tokens_sold + tokensAmount > presale.tokens_available) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Not enough tokens available'
        });
      }

      // Get user
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'User not found'
        });
      }

      // Check if user has enough balance
      if (paymentMethod === 'INR' && user.inr_balance < amountINR) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Insufficient INR balance'
        });
      }

      // Start transaction
      await prisma.$transaction(async (tx: typeof prisma) => {
        // Deduct from user balance
        if (paymentMethod === 'INR') {
          await tx.user.update({
            where: { id: userId },
            data: {
              inr_balance: { decrement: amountINR },
              vnc_balance: { increment: tokensAmount },
              total_invested: { increment: amountINR },
              tokens_owned: { increment: tokensAmount }
            }
          });
        }

        // Update presale stats
        await tx.presale.update({
          where: { id: presale.id },
          data: {
            tokens_sold: { increment: tokensAmount },
            total_raised: { increment: amountINR },
            participants: { increment: 1 }
          }
        });

        // Create transaction record
        await tx.transaction.create({
          data: {
            user_id: userId,
            type: 'PRESALE_PURCHASE',
            amount: tokensAmount,
            currency: 'VNC',
            status: 'COMPLETED'
          }
        });
      });

      res.json({
        message: 'Purchase successful',
        tokensReceived: tokensAmount,
        amountPaid: amountINR
      });
    } catch (error) {
      console.error('Purchase error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to process purchase'
      });
    }
  }
);

/**
 * GET /api/presale/my-purchases
 * Get user's presale purchases
 */
router.get('/my-purchases', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;

    const purchases = await prisma.transaction.findMany({
      where: {
        user_id: userId,
        type: 'PRESALE_PURCHASE'
      },
      orderBy: { created_at: 'desc' }
    });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        total_invested: true,
        tokens_owned: true
      }
    });

    res.json({
      purchases,
      summary: {
        totalInvested: user?.total_invested || 0,
        tokensOwned: user?.tokens_owned || 0
      }
    });
  } catch (error) {
    console.error('Get purchases error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch purchases'
    });
  }
});

export default router;
