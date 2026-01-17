# Cashfree Payment Gateway Integration

## 📋 Overview

VNC Blockchain platform integrates with **Cashfree** payment gateway to enable INR deposits via:
- **UPI** (Google Pay, PhonePe, Paytm, etc.)
- **Debit/Credit Cards** (Visa, Mastercard, RuPay, Amex)
- **Net Banking** (All major Indian banks)

---

## 🔑 Credentials

### Production Credentials
- **App ID**: `YOUR_CASHFREE_APP_ID`
- **Secret Key**: `YOUR_CASHFREE_SECRET_KEY`
- **Environment**: `PRODUCTION`

⚠️ **Security Note**: In production, store these credentials in environment variables, never hardcode them!

---

## 🏗️ Architecture

```
User Wallet Page
    ↓
Click "Deposit INR"
    ↓
Enter Amount & Select Payment Method
    ↓
Frontend calls /api/cashfree/create-order
    ↓
Backend creates order with Cashfree API
    ↓
Returns payment_session_id
    ↓
Frontend loads Cashfree SDK & opens payment page
    ↓
User completes payment
    ↓
Cashfree sends webhook to /api/cashfree/webhook
    ↓
Backend verifies signature & updates wallet balance
    ↓
User sees updated balance
```

---

## 📁 File Structure

```
frontend/presale-platform/src/
├── components/
│   └── CashfreeDepositForm.tsx       # Deposit form UI component
├── app/
│   ├── wallet/
│   │   └── page.tsx                   # Main wallet page with deposit tab
│   └── api/
│       └── cashfree/
│           ├── create-order/
│           │   └── route.ts           # API: Create payment order
│           └── webhook/
│               └── route.ts           # API: Receive payment status
```

---

## 🚀 Implementation Steps

### Step 1: Install Cashfree SDK (Optional for direct integration)

```bash
npm install --save cashfree-pg-sdk-javascript
```

### Step 2: Load Cashfree SDK in your HTML

Add to `app/layout.tsx`:

```tsx
<head>
  <script src="https://sdk.cashfree.com/js/v3/cashfree.js"></script>
</head>
```

### Step 3: Environment Variables

Create `.env.local`:

```env
CASHFREE_APP_ID=YOUR_CASHFREE_APP_ID
CASHFREE_SECRET_KEY=YOUR_CASHFREE_SECRET_KEY
CASHFREE_ENVIRONMENT=PRODUCTION
CASHFREE_API_URL=https://api.cashfree.com/pg/orders
```

### Step 4: Update API Routes

In `api/cashfree/create-order/route.ts`, use env variables:

```typescript
const CASHFREE_CONFIG = {
  appId: process.env.CASHFREE_APP_ID!,
  secretKey: process.env.CASHFREE_SECRET_KEY!,
  apiUrl: process.env.CASHFREE_API_URL!,
};
```

---

## 💳 Payment Flow (Frontend)

### CashfreeDepositForm.tsx

```typescript
const initiateCashfreePayment = async () => {
  // 1. Create order via backend API
  const response = await fetch('/api/cashfree/create-order', {
    method: 'POST',
    body: JSON.stringify({
      orderId: generateOrderId(),
      orderAmount: parseFloat(amount),
      orderCurrency: 'INR',
      customerEmail: userEmail,
      customerPhone: userPhone,
      returnUrl: `${window.location.origin}/wallet?payment=success`,
    }),
  });

  const data = await response.json();

  // 2. Load Cashfree SDK
  const cashfree = new window.Cashfree({
    mode: 'production', // or 'sandbox' for testing
  });

  // 3. Open payment page
  cashfree.checkout({
    paymentSessionId: data.paymentSessionId,
    returnUrl: returnUrl,
  });
};
```

---

## 🔧 Backend API

### Create Order API

**Endpoint**: `POST /api/cashfree/create-order`

**Request Body**:
```json
{
  "orderId": "ORDER_1234567890",
  "orderAmount": 1000,
  "orderCurrency": "INR",
  "orderNote": "VNC Wallet Deposit",
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "9999999999",
  "returnUrl": "https://vncblockchain.com/wallet?payment=success",
  "notifyUrl": "https://vncblockchain.com/api/cashfree/webhook"
}
```

**Response**:
```json
{
  "status": "OK",
  "message": "Order created successfully",
  "orderId": "ORDER_1234567890",
  "paymentSessionId": "session_abc123xyz",
  "orderStatus": "ACTIVE"
}
```

### Webhook API

**Endpoint**: `POST /api/cashfree/webhook`

**Headers**:
```
x-webhook-signature: <signature>
x-webhook-timestamp: <timestamp>
```

**Payload Example**:
```json
{
  "type": "PAYMENT_SUCCESS_WEBHOOK",
  "data": {
    "order_id": "ORDER_1234567890",
    "order_amount": 1000.00,
    "order_status": "PAID",
    "payment_status": "SUCCESS",
    "payment_time": "2026-01-08T10:30:00+05:30",
    "customer_details": {
      "customer_email": "john@example.com",
      "customer_phone": "9999999999"
    }
  }
}
```

---

## 🔒 Security Best Practices

### 1. Webhook Signature Verification

Always verify webhook signatures:

```typescript
function verifyWebhookSignature(payload, signature, timestamp) {
  const signatureData = `${timestamp}${JSON.stringify(payload)}`;
  const expectedSignature = crypto
    .createHmac('sha256', CASHFREE_SECRET_KEY)
    .update(signatureData)
    .digest('hex');
  
  return signature === expectedSignature;
}
```

### 2. Environment Variables

```bash
# Never commit these to Git!
CASHFREE_APP_ID=your_app_id
CASHFREE_SECRET_KEY=your_secret_key
```

### 3. HTTPS Only

- Ensure all API calls use HTTPS
- Set up SSL certificate for your domain

### 4. Rate Limiting

Implement rate limiting on API endpoints:

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
});
```

---

## 🧪 Testing

### Sandbox Environment

For testing, use sandbox credentials:

```typescript
const CASHFREE_CONFIG = {
  appId: 'TEST_APP_ID',
  secretKey: 'TEST_SECRET_KEY',
  apiUrl: 'https://sandbox.cashfree.com/pg/orders',
  environment: 'SANDBOX',
};
```

### Test Cards

**Success Card**:
- Card Number: `4111 1111 1111 1111`
- CVV: `123`
- Expiry: Any future date

**Failure Card**:
- Card Number: `4012 0010 3714 1112`
- CVV: `123`
- Expiry: Any future date

### Test UPI

- UPI ID: `success@payu`
- Pin: `1234`

---

## 📊 Transaction Management

### Database Schema (Recommended)

```sql
CREATE TABLE wallet_transactions (
  id SERIAL PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL,
  order_id VARCHAR(100) UNIQUE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  payment_method VARCHAR(50),
  status VARCHAR(20), -- PENDING, SUCCESS, FAILED, DROPPED
  payment_time TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_wallets (
  id SERIAL PRIMARY KEY,
  user_email VARCHAR(255) UNIQUE NOT NULL,
  inr_balance DECIMAL(10,2) DEFAULT 0,
  vnc_balance DECIMAL(18,8) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Update Wallet Balance

```typescript
async function updateWalletBalance(email: string, amount: number) {
  // Update database
  await db.query(
    'UPDATE user_wallets SET inr_balance = inr_balance + $1 WHERE user_email = $2',
    [amount, email]
  );
  
  // Create transaction record
  await db.query(
    'INSERT INTO wallet_transactions (user_email, order_id, amount, status) VALUES ($1, $2, $3, $4)',
    [email, orderId, amount, 'SUCCESS']
  );
}
```

---

## 📱 Mobile Support

Cashfree automatically detects mobile devices and shows mobile-optimized payment UI.

For React Native apps, use:

```bash
npm install react-native-cashfree-pg-sdk
```

---

## 🎯 Features Implemented

✅ INR deposit via UPI/Cards/Net Banking  
✅ Quick amount selection (₹500, ₹1000, etc.)  
✅ Payment method selection UI  
✅ Transaction summary before payment  
✅ Secure Cashfree integration  
✅ Webhook for payment confirmation  
✅ Success/Failure handling  
✅ Instant wallet credit  

---

## 🐛 Troubleshooting

### Issue: Payment page not opening

**Solution**: Ensure Cashfree SDK is loaded:

```html
<script src="https://sdk.cashfree.com/js/v3/cashfree.js"></script>
```

### Issue: Webhook not receiving

**Solution**: 
1. Check if webhook URL is accessible from internet
2. Verify SSL certificate is valid
3. Check Cashfree dashboard webhook logs

### Issue: Signature verification failed

**Solution**:
1. Ensure secret key matches
2. Verify timestamp is within 5 minutes
3. Check payload JSON formatting

---

## 📞 Support

- **Cashfree Docs**: https://docs.cashfree.com/
- **Support Email**: care@cashfree.com
- **Phone**: +91-80-61634719
- **Dashboard**: https://merchant.cashfree.com/

---

## 🔄 Next Steps

1. **Add Database**: Replace localStorage with PostgreSQL/MongoDB
2. **Transaction History**: Show all deposits in wallet page
3. **Email Notifications**: Send confirmation emails
4. **Withdrawal System**: Implement INR withdrawal to bank
5. **KYC Integration**: Add identity verification
6. **Invoice Generation**: PDF invoices for deposits
7. **Refund System**: Handle refund requests

---

**Version**: 1.0.0  
**Last Updated**: January 8, 2026  
**Integration Status**: ✅ Complete
