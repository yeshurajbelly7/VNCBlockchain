/**
 * Cashfree Webhook Handler
 * Processes real-time payment notifications
 */

import express, { Request, Response } from 'express';
import crypto from 'crypto';
import prisma from '../config/database';
import { sendEmail } from '../services/email.service';

const router = express.Router();

/**
 * POST /api/webhooks/cashfree
 * Handle Cashfree payment webhooks
 */
router.post('/cashfree', async (req: Request, res: Response) => {
  try {
    // Verify webhook signature
    const signature = req.headers['x-webhook-signature'] as string;
    const timestamp = req.headers['x-webhook-timestamp'] as string;
    
    if (!verifyWebhookSignature(req.body, signature, timestamp)) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid webhook signature'
      });
    }

    const { type, data } = req.body;

    console.log('📥 Cashfree Webhook Received:', {
      type,
      orderId: data.order_id,
      status: data.payment_status
    });

    switch (type) {
      case 'PAYMENT_SUCCESS_WEBHOOK':
        await handlePaymentSuccess(data);
        break;

      case 'PAYMENT_FAILED_WEBHOOK':
        await handlePaymentFailed(data);
        break;

      case 'PAYMENT_USER_DROPPED_WEBHOOK':
        await handlePaymentDropped(data);
        break;

      default:
        console.log('Unhandled webhook type:', type);
    }

    res.json({ status: 'OK', message: 'Webhook processed' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to process webhook'
    });
  }
});

/**
 * Verify Cashfree webhook signature
 */
function verifyWebhookSignature(payload: any, signature: string, timestamp: string): boolean {
  if (!process.env.CASHFREE_WEBHOOK_SECRET) {
    console.warn('⚠️  CASHFREE_WEBHOOK_SECRET not set - skipping signature verification');
    return true; // Allow in development
  }

  try {
    const signatureString = timestamp + JSON.stringify(payload);
    const expectedSignature = crypto
      .createHmac('sha256', process.env.CASHFREE_WEBHOOK_SECRET)
      .update(signatureString)
      .digest('base64');

    return signature === expectedSignature;
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

/**
 * Handle successful payment
 */
async function handlePaymentSuccess(data: any) {
  const {
    order_id,
    order_amount,
    payment_status,
    customer_details,
    payment_time,
    cf_payment_id
  } = data;

  try {
    // Find deposit record
    const deposit = await prisma.deposit.findUnique({
      where: { order_id },
      include: { user: true }
    });

    if (!deposit) {
      console.error('Deposit not found for order:', order_id);
      return;
    }

    if (deposit.status === 'COMPLETED') {
      console.log('Payment already processed:', order_id);
      return;
    }

    // Start transaction
    await prisma.$transaction(async (tx: typeof prisma) => {
      // Update deposit status
      await tx.deposit.update({
        where: { order_id },
        data: {
          payment_id: cf_payment_id,
          payment_status: payment_status,
          status: 'COMPLETED',
          processed_at: new Date(payment_time)
        }
      });

      // Credit user's INR balance
      await tx.user.update({
        where: { id: deposit.user_id },
        data: {
          inr_balance: {
            increment: order_amount
          }
        }
      });

      // Create transaction record
      await tx.transaction.create({
        data: {
          user_id: deposit.user_id,
          type: 'DEPOSIT',
          amount: order_amount,
          currency: 'INR',
          status: 'COMPLETED',
          payment_id: cf_payment_id,
          order_id: order_id
        }
      });

      // Create audit log
      await tx.auditLog.create({
        data: {
          user_id: deposit.user_id,
          action: 'DEPOSIT_SUCCESS',
          entity_type: 'Deposit',
          entity_id: deposit.id,
          new_value: {
            amount: order_amount,
            orderId: order_id,
            paymentId: cf_payment_id
          }
        }
      });
    });

    console.log('✅ Payment processed successfully:', order_id);

    // Send confirmation email
    await sendEmail({
      to: deposit.user.email,
      subject: 'Deposit Successful',
      template: 'deposit-success',
      data: {
        name: deposit.user.name,
        amount: order_amount,
        orderId: order_id,
        paymentId: cf_payment_id,
        date: new Date(payment_time).toLocaleString()
      }
    });
  } catch (error) {
    console.error('Error processing payment success:', error);
    throw error;
  }
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(data: any) {
  const { order_id, payment_status, cf_payment_id } = data;

  try {
    const deposit = await prisma.deposit.findUnique({
      where: { order_id },
      include: { user: true }
    });

    if (!deposit) {
      console.error('Deposit not found for order:', order_id);
      return;
    }

    // Update deposit status
    await prisma.deposit.update({
      where: { order_id },
      data: {
        payment_id: cf_payment_id,
        payment_status: payment_status,
        status: 'FAILED',
        processed_at: new Date()
      }
    });

    console.log('❌ Payment failed:', order_id);

    // Send failure email
    await sendEmail({
      to: deposit.user.email,
      subject: 'Deposit Failed',
      template: 'deposit-failed',
      data: {
        name: deposit.user.name,
        amount: deposit.amount,
        orderId: order_id,
        reason: 'Payment was declined or failed'
      }
    });
  } catch (error) {
    console.error('Error processing payment failure:', error);
  }
}

/**
 * Handle dropped payment (user closed payment page)
 */
async function handlePaymentDropped(data: any) {
  const { order_id } = data;

  try {
    await prisma.deposit.update({
      where: { order_id },
      data: {
        payment_status: 'USER_DROPPED',
        status: 'FAILED'
      }
    });

    console.log('⚠️  Payment dropped by user:', order_id);
  } catch (error) {
    console.error('Error processing payment drop:', error);
  }
}

export default router;
