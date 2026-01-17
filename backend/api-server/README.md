# VNC Blockchain Backend API Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend/api-server
npm install
```

### 2. Setup Database
```bash
# Create PostgreSQL database
createdb vnc_blockchain

# Copy environment file
cp .env.example .env

# Edit .env with your database credentials
# DATABASE_URL="postgresql://user:password@localhost:5432/vnc_blockchain"

# Run migrations
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate
```

### 3. Configure Environment Variables
Edit `.env` file:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/vnc_blockchain?schema=public"

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Cashfree
CASHFREE_APP_ID=YOUR_CASHFREE_APP_ID
CASHFREE_SECRET_KEY=YOUR_CASHFREE_SECRET_KEY
CASHFREE_ENVIRONMENT=PRODUCTION
CASHFREE_WEBHOOK_SECRET=your-webhook-secret

# Email (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Frontend
FRONTEND_URL=http://localhost:3002
```

### 4. Start Development Server
```bash
npm run dev
```

Server will run on: `http://localhost:5000`

## 📡 API Endpoints

### Authentication (`/api/auth`)
- `POST /signup` - Register new user
- `POST /login` - User login
- `POST /verify-2fa` - Verify 2FA code
- `POST /setup-2fa` - Setup 2FA
- `POST /enable-2fa` - Enable 2FA
- `POST /disable-2fa` - Disable 2FA

### Users (`/api/users`)
- `GET /me` - Get current user
- `PUT /me` - Update profile
- `GET /balance` - Get wallet balances

### Deposits (`/api/deposits`)
- `POST /create-order` - Create Cashfree deposit order
- `GET /` - Get user deposits
- `GET /:id` - Get deposit details

### Presale (`/api/presale`)
- `GET /status` - Get presale status
- `GET /stages` - Get all stages
- `POST /purchase` - Purchase tokens
- `GET /my-purchases` - Get user purchases

### Webhooks (`/api/webhooks`)
- `POST /cashfree` - Cashfree payment webhook

### Admin (`/api/admin`)
- `GET /users` - List all users
- `PUT /users/:id/kyc` - Approve/reject KYC
- `POST /presale/advance` - Advance presale stage
- `POST /presale/pause` - Pause presale

## 🧪 Testing Cashfree Webhook Locally

### Option 1: Using ngrok (Recommended)
```bash
# Install ngrok
npm install -g ngrok

# Start your API server
npm run dev

# In another terminal, start ngrok tunnel
ngrok http 5000

# Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
# Update Cashfree webhook URL to: https://abc123.ngrok.io/api/webhooks/cashfree
```

### Option 2: Using LocalTunnel
```bash
# Install localtunnel
npm install -g localtunnel

# Start tunnel
lt --port 5000 --subdomain vnc-blockchain

# Use URL: https://vnc-blockchain.loca.lt/api/webhooks/cashfree
```

### Option 3: Using Cloudflare Tunnel
```bash
# Install cloudflared
# Download from: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/

# Start tunnel
cloudflared tunnel --url http://localhost:5000
```

## 🔐 2FA Setup for Admin

### Enable 2FA for Super Admin:
```bash
# 1. Login as admin
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@vncblockchain.com",
    "password": "Admin@123456"
  }'

# 2. Setup 2FA (use token from step 1)
curl -X POST http://localhost:5000/api/auth/setup-2fa \
  -H "Authorization: Bearer YOUR_TOKEN"

# Response will include QR code and secret
# Scan QR code with Google Authenticator or Authy

# 3. Enable 2FA with code from authenticator
curl -X POST http://localhost:5000/api/auth/enable-2fa \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "123456"
  }'
```

## 📧 Email Configuration

### Gmail Setup:
1. Enable 2-Step Verification in your Google Account
2. Generate App Password:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Copy the 16-character password
3. Update `.env`:
```env
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
```

### SendGrid Setup (Alternative):
```env
SENDGRID_API_KEY=your-sendgrid-api-key
```

## 🔗 Connect Smart Contract

### 1. Deploy VNCPresale.sol
```bash
cd ../../contracts
npx hardhat run scripts/deploy.js --network mainnet
```

### 2. Update .env
```env
PRESALE_CONTRACT_ADDRESS=0xYourContractAddress
NETWORK_RPC_URL=https://mainnet.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=your-deployer-private-key
```

### 3. Copy Contract ABI
```bash
cp artifacts/contracts/VNCPresale.sol/VNCPresale.json ../backend/api-server/contracts/
```

## 📊 Database Schema

### Main Tables:
- `User` - User accounts
- `Transaction` - All transactions
- `Deposit` - Cashfree deposits
- `Withdrawal` - User withdrawals
- `Presale` - Presale configurations
- `Referral` - Referral system
- `Airdrop` - Airdrop campaigns
- `AuditLog` - Admin action logs

### View Database:
```bash
npx prisma studio
```

Opens at: `http://localhost:5555`

## 🔍 Monitoring & Logs

### View Logs:
```bash
# Development logs
npm run dev

# Production logs
pm2 logs vnc-api
```

### Health Check:
```bash
curl http://localhost:5000/health
```

## 🚀 Production Deployment

### 1. Build
```bash
npm run build
```

### 2. Start with PM2
```bash
npm install -g pm2
pm2 start dist/server.js --name vnc-api
pm2 save
pm2 startup
```

### 3. Environment
```bash
export NODE_ENV=production
```

### 4. Database Migration
```bash
npx prisma migrate deploy
```

## 📝 Frontend Integration

Update frontend `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Replace localStorage calls with API calls:
```typescript
// Before (localStorage):
localStorage.setItem('vnc_auth_token', token);

// After (API):
const response = await fetch(`${API_URL}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
const { token } = await response.json();
```

## ⚡ Performance Tips

1. **Enable caching** for frequently accessed data
2. **Use connection pooling** for database
3. **Implement rate limiting** per user
4. **Add Redis** for session storage
5. **Enable compression** for responses

## 🔒 Security Checklist

- [ ] Change all default passwords
- [ ] Enable 2FA for all admin accounts
- [ ] Use HTTPS in production
- [ ] Validate all webhook signatures
- [ ] Implement rate limiting
- [ ] Enable CORS properly
- [ ] Store secrets in environment variables
- [ ] Regular security audits
- [ ] Monitor audit logs
- [ ] Backup database regularly

## 📞 Support

- Email: support@vncblockchain.com
- Docs: https://docs.vncblockchain.com
- API Docs: http://localhost:5000/api-docs (coming soon)
