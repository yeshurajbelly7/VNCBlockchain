import { NextRequest, NextResponse } from 'next/server';

const CASHFREE_CONFIG = {
  appId: 'YOUR_CASHFREE_APP_ID',
  secretKey: 'YOUR_CASHFREE_SECRET_KEY',
  apiUrl: 'https://api.cashfree.com/pg/orders', // Production URL
  apiVersion: '2023-08-01',
};

/**
 * Create Cashfree Payment Order
 * POST /api/cashfree/create-order
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      orderId,
      orderAmount,
      orderCurrency,
      orderNote,
      customerName,
      customerEmail,
      customerPhone,
      returnUrl,
      notifyUrl,
    } = body;

    // Validate required fields
    if (!orderId || !orderAmount || !customerEmail || !customerPhone) {
      return NextResponse.json(
        { status: 'ERROR', message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create order payload for Cashfree
    const orderPayload = {
      order_id: orderId,
      order_amount: parseFloat(orderAmount),
      order_currency: orderCurrency || 'INR',
      order_note: orderNote || 'VNC Wallet Deposit',
      customer_details: {
        customer_id: customerEmail.split('@')[0] + '_' + Date.now(),
        customer_name: customerName || 'VNC User',
        customer_email: customerEmail,
        customer_phone: customerPhone,
      },
      order_meta: {
        return_url: returnUrl,
        notify_url: notifyUrl,
      },
    };

    // Make API call to Cashfree
    const response = await fetch(CASHFREE_CONFIG.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-version': CASHFREE_CONFIG.apiVersion,
        'x-client-id': CASHFREE_CONFIG.appId,
        'x-client-secret': CASHFREE_CONFIG.secretKey,
      },
      body: JSON.stringify(orderPayload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Cashfree API Error:', data);
      return NextResponse.json(
        {
          status: 'ERROR',
          message: data.message || 'Failed to create order',
          error: data,
        },
        { status: response.status }
      );
    }

    // Return payment session data
    return NextResponse.json({
      status: 'OK',
      message: 'Order created successfully',
      orderId: data.order_id,
      paymentSessionId: data.payment_session_id,
      orderStatus: data.order_status,
    });
  } catch (error: unknown) {
    console.error('Create Order Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        status: 'ERROR',
        message: 'Internal server error',
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
