// Razorpay Payment Integration
// Official Docs: https://razorpay.com/docs/

// Extend Window interface to include Razorpay
declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayInstance {
  open(): void;
  on(event: string, handler: (response: Record<string, unknown>) => void): void;
}

interface RazorpayOptions {
  key: string;
  amount: number; // in paise
  currency: string;
  name: string;
  description: string;
  orderId: string;
  handler?: (response: RazorpayResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export class RazorpayPayment {
  private keyId: string;
  private keySecret: string;

  constructor(keyId: string, keySecret: string) {
    this.keyId = keyId;
    this.keySecret = keySecret;
  }

  /**
   * Create a Razorpay order
   */
  async createOrder(amount: number, currency: string = 'INR', receipt?: string): Promise<unknown> {
    try {
      // In production, this should call your backend API
      const response = await fetch('/api/payment/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount * 100, // Convert to paise
          currency,
          receipt: receipt || `receipt_${Date.now()}`,
        }),
      });

      const order = await response.json();
      return order;
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      throw error;
    }
  }

  /**
   * Open Razorpay checkout
   */
  async openCheckout(options: RazorpayOptions, onSuccess: (response: RazorpayResponse) => void, onError: (error: Record<string, unknown>) => void): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.Razorpay) {
        reject(new Error('Razorpay SDK not loaded'));
        return;
      }

      const rzp = new window.Razorpay({
        ...options,
        key: this.keyId,
        handler: (response: RazorpayResponse) => {
          onSuccess(response);
          resolve();
        },
        modal: {
          ondismiss: () => {
            reject(new Error('Payment cancelled by user'));
          },
        },
      });

      rzp.on('payment.failed', (response: Record<string, unknown>) => {
        const error = response.error as Record<string, unknown>;
        onError(error);
        reject(response.error);
      });

      rzp.open();
    });
  }

  /**
   * Verify payment signature
   */
  async verifySignature(orderId: string, paymentId: string, signature: string): Promise<boolean> {
    try {
      // In production, this should call your backend API for verification
      const response = await fetch('/api/payment/razorpay/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order_id: orderId,
          payment_id: paymentId,
          signature,
        }),
      });

      const result = await response.json();
      return result.verified;
    } catch (error) {
      console.error('Error verifying payment:', error);
      return false;
    }
  }

  /**
   * Load Razorpay SDK
   */
  static loadSDK(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('Window is not defined'));
        return;
      }

      if (window.Razorpay) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
      document.body.appendChild(script);
    });
  }
}

// Example usage:
/*
const razorpay = new RazorpayPayment('rzp_test_key', 'rzp_test_secret');

// Load SDK first
await RazorpayPayment.loadSDK();

// Create order
const order = await razorpay.createOrder(50000, 'INR');

// Open checkout
await razorpay.openCheckout(
  {
    key: 'rzp_test_key',
    amount: order.amount,
    currency: order.currency,
    name: 'VNC Blockchain',
    description: 'VNC Token Purchase',
    orderId: order.id,
    prefill: {
      name: 'John Doe',
      email: 'john@example.com',
      contact: '9876543210',
    },
    theme: {
      color: '#0ea5e9',
    },
  },
  (response) => {
    console.log('Payment successful:', response);
    // Verify signature
    razorpay.verifySignature(response.razorpay_order_id, response.razorpay_payment_id, response.razorpay_signature);
  },
  (error) => {
    console.error('Payment failed:', error);
  }
);
*/


