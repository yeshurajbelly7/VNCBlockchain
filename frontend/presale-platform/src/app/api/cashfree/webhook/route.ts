import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const CASHFREE_CONFIG = {
  appId: process.env.CASHFREE_APP_ID || '',
  secretKey: process.env.CASHFREE_SECRET_KEY || '',
};

/**
 * Cashfree Payment Webhook Handler
 * POST /api/cashfree/webhook
 * 
 * This endpoint receives payment status updates from Cashfree
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const signature = req.headers.get('x-webhook-signature');
    const timestamp = req.headers.get('x-webhook-timestamp');

    console.log('Cashfree Webhook Received:', {
      signature: signature ? 'Present' : 'Missing',
      timestamp: timestamp,
      eventType: body.type,
    });

    // Verify webhook signature
    if (!verifyWebhookSignature(body, signature, timestamp)) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { status: 'ERROR', message: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Process webhook data
    const {
      type,
      data: {
        order_id,
        order_amount,
        order_status: _order_status,
        payment_status,
        customer_details,
        payment_time: _payment_time,
      },
    } = body;

    console.log('Cashfree Webhook Received:', {
      type,
      orderId: order_id,
      status: payment_status,
      amount: order_amount,
    });

    // Handle different webhook events
    switch (type) {
      case 'PAYMENT_SUCCESS_WEBHOOK':
        await handlePaymentSuccess(order_id, order_amount, customer_details);
        break;

      case 'PAYMENT_FAILED_WEBHOOK':
        await handlePaymentFailed(order_id, customer_details);
        break;

      case 'PAYMENT_USER_DROPPED_WEBHOOK':
        await handlePaymentDropped(order_id, customer_details);
        break;

      default:
        console.log('Unhandled webhook type:', type);
    }

    return NextResponse.json({ status: 'OK', message: 'Webhook processed' });
  } catch (error: unknown) {
    console.error('Webhook Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        status: 'ERROR',
        message: 'Failed to process webhook',
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

/**
 * Verify webhook signature from Cashfree
 */
function verifyWebhookSignature(
  payload: Record<string, unknown>,
  signature: string | null,
  timestamp: string | null
): boolean {
  if (!signature || !timestamp) return false;

  try {
    const signatureData = `${timestamp}${JSON.stringify(payload)}`;
    const expectedSignature = crypto
      .createHmac('sha256', CASHFREE_CONFIG.secretKey)
      .update(signatureData)
      .digest('hex');

    return signature === expectedSignature;
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

/**
 * Handle successful payment
 */
async function handlePaymentSuccess(
  orderId: string,
  amount: number,
  customerDetails: Record<string, unknown>
) {
  console.log('Payment Success:', { orderId, amount, customerDetails });

  // TODO: In production, update your database
  // Example:
  // 1. Find user by email: customerDetails.customer_email
  // 2. Add amount to user's wallet balance
  // 3. Create transaction record
  // 4. Send confirmation email
  // 5. Trigger any post-payment workflows

  /*
  await db.transaction.create({
    orderId,
    amount,
    status: 'SUCCESS',
    userEmail: customerDetails.customer_email,
    timestamp: new Date(),
  });

  await db.wallet.increment({
    where: { userEmail: customerDetails.customer_email },
    data: { balance: amount },
  });
  */
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(orderId: string, customerDetails: Record<string, unknown>) {
  console.log('Payment Failed:', { orderId, customerDetails });

  // TODO: In production:
  // 1. Update transaction status to FAILED
  // 2. Send failure notification email
  // 3. Log for support team
}

/**
 * Handle dropped payment (user closed payment page)
 */
async function handlePaymentDropped(orderId: string, customerDetails: Record<string, unknown>) {
  console.log('Payment Dropped:', { orderId, customerDetails });

  // TODO: In production:
  // 1. Update transaction status to DROPPED
  // 2. Send reminder email after some time
}
