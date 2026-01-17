// PhonePe Payment Integration
// Official Docs: https://developer.phonepe.com/

interface PhonePeOptions {
  merchantId: string;
  merchantTransactionId: string;
  amount: number; // in paise
  merchantUserId: string;
  redirectUrl: string;
  callbackUrl: string;
  mobileNumber?: string;
  paymentInstrument: {
    type: 'PAY_PAGE' | 'UPI_INTENT' | 'UPI_QR';
    targetApp?: string; // For UPI_INTENT
  };
}

interface PhonePeResponse {
  success: boolean;
  code: string;
  message: string;
  data: {
    merchantId: string;
    merchantTransactionId: string;
    transactionId: string;
    amount: number;
    state: 'COMPLETED' | 'FAILED' | 'PENDING';
    responseCode: string;
    paymentInstrument: {
      type: string;
      utr?: string;
    };
  };
}

export class PhonePePayment {
  private merchantId: string;
  private saltKey: string;
  private saltIndex: number;
  private environment: 'TEST' | 'PROD';
  private baseUrl: string;

  constructor(merchantId: string, saltKey: string, saltIndex: number = 1, environment: 'TEST' | 'PROD' = 'TEST') {
    this.merchantId = merchantId;
    this.saltKey = saltKey;
    this.saltIndex = saltIndex;
    this.environment = environment;
    this.baseUrl = environment === 'PROD'
      ? 'https://api.phonepe.com/apis/hermes'
      : 'https://api-preprod.phonepe.com/apis/pg-sandbox';
  }

  /**
   * Create a PhonePe payment request
   */
  async createPayment(options: PhonePeOptions): Promise<unknown> {
    try {
      // In production, this should call your backend API
      const response = await fetch('/api/payment/phonepe/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          merchantId: options.merchantId || this.merchantId,
          merchantTransactionId: options.merchantTransactionId || `TXN_${Date.now()}`,
          merchantUserId: options.merchantUserId,
          amount: options.amount,
          redirectUrl: options.redirectUrl,
          callbackUrl: options.callbackUrl,
          mobileNumber: options.mobileNumber,
          paymentInstrument: options.paymentInstrument,
        }),
      });

      const payment = await response.json();
      return payment;
    } catch (error) {
      console.error('Error creating PhonePe payment:', error);
      throw error;
    }
  }

  /**
   * Initiate payment (redirect to PhonePe)
   */
  async initiatePayment(options: PhonePeOptions): Promise<void> {
    try {
      const payment = await this.createPayment(options) as {
        success: boolean;
        data: {
          instrumentResponse: {
            redirectInfo?: {
              url: string;
            };
          };
        };
      };
      
      if (payment.success && payment.data.instrumentResponse.redirectInfo) {
        // Redirect to PhonePe payment page
        window.location.href = payment.data.instrumentResponse.redirectInfo.url;
      } else {
        throw new Error('Failed to initiate payment');
      }
    } catch (error) {
      console.error('Error initiating payment:', error);
      throw error;
    }
  }

  /**
   * Check payment status
   */
  async checkStatus(merchantTransactionId: string): Promise<PhonePeResponse> {
    try {
      const response = await fetch(`/api/payment/phonepe/status/${merchantTransactionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const status = await response.json();
      return status;
    } catch (error) {
      console.error('Error checking payment status:', error);
      throw error;
    }
  }

  /**
   * Verify payment callback
   */
  async verifyCallback(xVerify: string, response: string): Promise<boolean> {
    try {
      // In production, this should call your backend API for verification
      const result = await fetch('/api/payment/phonepe/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          xVerify,
          response,
        }),
      });

      const verification = await result.json();
      return verification.verified;
    } catch (error) {
      console.error('Error verifying callback:', error);
      return false;
    }
  }

  /**
   * Refund payment
   */
  async refund(merchantTransactionId: string, originalTransactionId: string, amount: number): Promise<unknown> {
    try {
      const response = await fetch('/api/payment/phonepe/refund', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          merchantId: this.merchantId,
          merchantTransactionId,
          originalTransactionId,
          amount,
        }),
      });

      const refund = await response.json();
      return refund;
    } catch (error) {
      console.error('Error processing refund:', error);
      throw error;
    }
  }
}

// Example usage:
/*
const phonepe = new PhonePePayment(
  'MERCHANTUAT',
  '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399',
  1,
  'TEST'
);

// Create and initiate payment
await phonepe.initiatePayment({
  merchantId: 'MERCHANTUAT',
  merchantTransactionId: `TXN_${Date.now()}`,
  merchantUserId: 'USER123',
  amount: 5000000, // â‚¹50,000 in paise
  redirectUrl: 'https://yourdomain.com/payment/success',
  callbackUrl: 'https://yourdomain.com/api/payment/phonepe/callback',
  mobileNumber: '9876543210',
  paymentInstrument: {
    type: 'PAY_PAGE',
  },
});

// After redirect back, check status
const status = await phonepe.checkStatus('TXN_1234567890');
console.log('Payment status:', status.data.state);

// Verify callback (on server-side)
const verified = await phonepe.verifyCallback(xVerifyHeader, responseBody);
*/


