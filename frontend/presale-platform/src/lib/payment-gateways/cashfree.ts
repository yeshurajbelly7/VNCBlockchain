// Cashfree Payment Integration
// Official Docs: https://docs.cashfree.com/

interface _CashfreeInstance {
  checkout(options: Record<string, unknown>): Promise<void>;
}

interface CashfreeOptions {
  orderId: string;
  orderAmount: number;
  orderCurrency: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  returnUrl: string;
  notifyUrl?: string;
}

// CashfreeResponse interface kept for future use
interface _CashfreeResponse {
  orderId: string;
  orderAmount: string;
  referenceId: string;
  txStatus: string;
  paymentMode: string;
  txMsg: string;
  txTime: string;
  signature: string;
}

export class CashfreePayment {
  private appId: string;
  private secretKey: string;
  private environment: 'TEST' | 'PROD';

  constructor(appId: string, secretKey: string, environment: 'TEST' | 'PROD' = 'TEST') {
    this.appId = appId;
    this.secretKey = secretKey;
    this.environment = environment;
  }

  /**
   * Create a Cashfree order
   */
  async createOrder(options: CashfreeOptions): Promise<unknown> {
    try {
      // In production, this should call your backend API
      const response = await fetch('/api/payment/cashfree/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: options.orderId || `order_${Date.now()}`,
          orderAmount: options.orderAmount,
          orderCurrency: options.orderCurrency,
          customerName: options.customerName,
          customerEmail: options.customerEmail,
          customerPhone: options.customerPhone,
          returnUrl: options.returnUrl,
          notifyUrl: options.notifyUrl,
        }),
      });

      const order = await response.json();
      return order;
    } catch (error) {
      console.error('Error creating Cashfree order:', error);
      throw error;
    }
  }

  /**
   * Open Cashfree checkout
   */
  async openCheckout(options: CashfreeOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.Cashfree) {
        reject(new Error('Cashfree SDK not loaded'));
        return;
      }

      const cashfree = new window.Cashfree({
        mode: this.environment === 'PROD' ? 'production' : 'sandbox',
      });

      const checkoutOptions = {
        paymentSessionId: options.orderId,
        returnUrl: options.returnUrl,
        notifyUrl: options.notifyUrl,
      };

      cashfree.checkout(checkoutOptions).then(() => {
        // Payment completed
        resolve();
      }).catch((error: unknown) => {
        reject(error);
      });
    });
  }

  /**
   * Verify payment signature
   */
  async verifySignature(orderId: string, orderAmount: string, referenceId: string, signature: string): Promise<boolean> {
    try {
      // In production, this should call your backend API for verification
      const response = await fetch('/api/payment/cashfree/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          orderAmount,
          referenceId,
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
   * Get order status
   */
  async getOrderStatus(orderId: string): Promise<unknown> {
    try {
      const response = await fetch(`/api/payment/cashfree/order-status/${orderId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const status = await response.json();
      return status;
    } catch (error) {
      console.error('Error fetching order status:', error);
      throw error;
    }
  }

  /**
   * Load Cashfree SDK
   */
  static loadSDK(environment: 'TEST' | 'PROD' = 'TEST'): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('Window is not defined'));
        return;
      }

      if (window.Cashfree) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = environment === 'PROD'
        ? 'https://sdk.cashfree.com/js/v3/cashfree.js'
        : 'https://sdk.cashfree.com/js/v3/cashfree.sandbox.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Cashfree SDK'));
      document.body.appendChild(script);
    });
  }
}

// Example usage:
/*
const cashfree = new CashfreePayment('test_app_id', 'test_secret_key', 'TEST');

// Load SDK first
await CashfreePayment.loadSDK('TEST');

// Create order
const order = await cashfree.createOrder({
  orderId: `order_${Date.now()}`,
  orderAmount: 50000,
  orderCurrency: 'INR',
  customerName: 'John Doe',
  customerEmail: 'john@example.com',
  customerPhone: '9876543210',
  returnUrl: 'https://yourdomain.com/payment/success',
  notifyUrl: 'https://yourdomain.com/api/payment/cashfree/webhook',
});

// Open checkout
await cashfree.openCheckout(order);

// After payment, verify on return URL
const verified = await cashfree.verifySignature(
  orderId,
  orderAmount,
  referenceId,
  signature
);
*/


