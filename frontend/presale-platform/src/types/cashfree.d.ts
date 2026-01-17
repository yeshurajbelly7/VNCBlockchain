// Cashfree SDK Type Definitions
interface CashfreeConfig {
  mode: 'sandbox' | 'production';
}

interface CashfreeCheckoutOptions {
  paymentSessionId: string;
  returnUrl?: string;
  redirectTarget?: '_self' | '_blank' | '_parent' | '_top';
}

interface CashfreeSDKInstance {
  checkout(options: CashfreeCheckoutOptions): Promise<void>;
}

interface CashfreeSDKConstructor {
  new (config: CashfreeConfig): CashfreeSDKInstance;
}

interface Window {
  Cashfree?: CashfreeSDKConstructor;
}
