/**
 * Deposit Routes - Cashfree Integration
 */

import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import axios from 'axios';
import prisma from '../config/database';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

// Cashfree configuration
const CASHFREE_BASE_URL = process.env.CASHFREE_ENVIRONMENT === 'PRODUCTION'
  ? 'https://api.cashfree.com/pg'
  : 'https://sandbox.cashfree.com/pg';

const CASHFREE_HEADERS = {
  'x-client-id': process.env.CASHFREE_APP_ID!,
  'x-client-secret': process.env.CASHFREE_SECRET_KEY!,
  'x-api-version': '2023-08-01',
  'Content-Type': 'application/json'
};

/**
 * POST /api/deposits/create-order
 * Create Cashfree deposit order
 */
router.post('/create-order',
  authenticate,
  [
    body('amount').isFloat({ min: 10, max: 100000 }),
    body('paymentMethod').isIn(['upi', 'card', 'netbanking'])
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userId = req.user!.id;
      const { amount, paymentMethod } = req.body;

      // Generate order ID
      const orderId = `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`.toUpperCase();

      // Get user details
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'User not found'
        });
      }

      // Create deposit record
      await prisma.deposit.create({
        data: {
          user_id: userId,
          amount,
          payment_method: paymentMethod.toUpperCase(),
          order_id: orderId,
          status: 'PENDING'
        }
      });

      // Create Cashfree order
      const cashfreeOrder = {
        order_id: orderId,
        order_amount: amount,
        order_currency: 'INR',
        customer_details: {
          customer_id: user.id,
          customer_email: user.email,
          customer_phone: user.phone || '9999999999',
          customer_name: user.name
        },
        order_meta: {
          return_url: `${process.env.FRONTEND_URL}/dashboard?payment=success&amount=${amount}`,
          notify_url: `${process.env.FRONTEND_URL}/api/webhooks/cashfree`
        }
      };

      const response = await axios.post(
        `${CASHFREE_BASE_URL}/orders`,
        cashfreeOrder,
        { headers: CASHFREE_HEADERS }
      );

      // Update deposit with payment session ID
      await prisma.deposit.update({
        where: { order_id: orderId },
        data: {
          payment_session_id: response.data.payment_session_id
        }
      });

      res.json({
        status: 'OK',
        orderId,
        paymentSessionId: response.data.payment_session_id,
        amount
      });
    } catch (error: any) {
      console.error('Create order error:', error.response?.data || error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to create deposit order'
      });
    }
  }
);

/**
 * GET /api/deposits
 * Get user deposits
 */
router.get('/', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;

    const deposits = await prisma.deposit.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      take: 50
    });

    res.json({ deposits });
  } catch (error) {
    console.error('Get deposits error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch deposits'
    });
  }
});

/**
 * GET /api/deposits/:id
 * Get deposit details
 */
router.get('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const deposit = await prisma.deposit.findFirst({
      where: {
        id,
        user_id: userId
      }
    });

    if (!deposit) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Deposit not found'
      });
    }

    res.json({ deposit });
  } catch (error) {
    console.error('Get deposit error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch deposit'
    });
  }
});

export default router;
