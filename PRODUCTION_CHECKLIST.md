# ✅ Production Deployment Checklist

**Purpose:** Ensure your live server starts with ZERO demo data

---

## 🎯 Overview

This checklist guarantees your production deployment has:
- ✅ Fresh, empty database
- ✅ No test or demo data
- ✅ Clean start from zero
- ✅ Production-ready configuration

---

## 📋 Pre-Deployment Checklist

### 1. Environment Configuration ⚠️ CRITICAL

- [ ] Created **NEW** `.env` file for production
- [ ] Changed `DATABASE_URL` to production database
- [ ] Generated **NEW** `JWT_SECRET` (use: `openssl rand -base64 64`)
- [ ] Added production Cashfree API keys (NOT sandbox)
- [ ] Added production RPC URL (NOT testnet)
- [ ] Added production email credentials
- [ ] Set `NODE_ENV=production`
- [ ] Set `CASHFREE_ENVIRONMENT=PRODUCTION`
- [ ] Configured production domain in `ALLOWED_ORIGINS`

**Verify:** No default values like "your-secret-key-here" remain

### 2. Database Setup ⚠️ CRITICAL

- [ ] Created **NEW** PostgreSQL database for production
- [ ] Database name is different from development (e.g., `vnc_blockchain_prod`)
- [ ] Created dedicated database user with strong password
- [ ] Granted appropriate privileges
- [ ] Verified database is empty (0 tables initially)
- [ ] Configured database backup system

**Verify:** `DATABASE_URL` points to new, empty production database

### 3. Code Preparation

- [ ] Latest code pulled from GitHub
- [ ] All changes committed and pushed
- [ ] Removed any test/demo seed files
- [ ] Removed any test data fixtures
- [ ] No hardcoded API keys in code
- [ ] All secrets use environment variables

**Verify:** Run `git status` - should be clean

### 4. Smart Contracts ⚠️ CRITICAL

- [ ] Deployed contracts to mainnet (NOT testnet)
- [ ] Updated `PRESALE_CONTRACT_ADDRESS` in `.env`
- [ ] Updated `NETWORK_RPC_URL` to mainnet
- [ ] Verified contract on blockchain explorer
- [ ] Updated ABI files if changed

**Verify:** Contract addresses are mainnet addresses

### 5. Payment Gateway ⚠️ CRITICAL

- [ ] Using Cashfree **PRODUCTION** credentials
- [ ] Webhook URL configured in Cashfree dashboard
- [ ] Webhook secret matches `.env` configuration
- [ ] Test payment completed successfully
- [ ] Refund process tested

**Verify:** `CASHFREE_ENVIRONMENT=PRODUCTION`

---

## 🚀 Deployment Steps

### Step 1: Server Preparation

```bash
# SSH into your server
ssh user@your-server-ip

# Create application directory
sudo mkdir -p /var/www/vnc-blockchain
sudo chown $USER:$USER /var/www/vnc-blockchain
cd /var/www/vnc-blockchain

# Clone repository
git clone https://github.com/yeshurajbelly7/VNCBlockchain.git .
```

- [ ] Completed

### Step 2: Backend Deployment

```bash
cd backend/api-server

# Create production .env file
nano .env
# Paste production configuration
# Save and exit (Ctrl+X, Y, Enter)

# Install dependencies (production only)
npm ci --production

# Generate Prisma Client
npx prisma generate

# Run migrations (creates empty tables)
npx prisma migrate deploy

# Build application
npm run build

# Verify build succeeded
ls -la dist/
```

- [ ] Completed
- [ ] Verified `dist/` folder exists with compiled files

### Step 3: Verify Empty Database

```bash
# Check tables are created but empty
npx prisma studio
# Or use psql:
psql $DATABASE_URL -c "SELECT COUNT(*) FROM \"User\";"
# Should return: 0
```

**IMPORTANT:** Verify these counts are ALL ZERO:
- [ ] Users: 0
- [ ] Transactions: 0
- [ ] Deposits: 0
- [ ] Withdrawals: 0
- [ ] Referrals: 0

### Step 4: Start Backend

```bash
# Option 1: Using PM2 (recommended)
npm install -g pm2
pm2 start dist/server.js --name vnc-backend
pm2 save
pm2 startup

# Option 2: Using systemd
sudo systemctl start vnc-backend
sudo systemctl enable vnc-backend

# Option 3: Direct
npm start
```

- [ ] Backend started successfully
- [ ] Check logs: `pm2 logs vnc-backend`

### Step 5: Frontend Deployment

```bash
# Presale Platform
cd frontend/presale-platform

# Create .env.local with production API URL
echo "NEXT_PUBLIC_API_URL=https://api.yourdomain.com" > .env.local

# Install and build
npm ci
npm run build

# Start (or deploy to Vercel)
npm start
# Or: vercel --prod

# Public Website
cd ../public-website
npm ci
npm run build
npm start
```

- [ ] Presale platform deployed
- [ ] Public website deployed

---

## ✅ Post-Deployment Verification

### 1. API Health Check

```bash
curl https://api.yourdomain.com/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2026-01-19T..."
}
```

- [ ] API responding
- [ ] Database connected

### 2. Database Verification

```bash
# Connect to production database
psql $DATABASE_URL

# Check all tables are empty
SELECT 
  'User' as table_name, COUNT(*) as count FROM "User"
UNION ALL
SELECT 'Transaction', COUNT(*) FROM "Transaction"
UNION ALL
SELECT 'Deposit', COUNT(*) FROM "Deposit"
UNION ALL
SELECT 'Withdrawal', COUNT(*) FROM "Withdrawal";
```

**Expected result:** All counts = 0

- [ ] All tables exist
- [ ] All tables are EMPTY (0 rows)

### 3. Frontend Verification

- [ ] Visit presale platform: https://presale.yourdomain.com
- [ ] Visit public website: https://yourdomain.com
- [ ] Check SSL certificate is valid
- [ ] Test responsive design (mobile/desktop)
- [ ] All pages load without errors

### 4. Installation Wizard

- [ ] Visit: https://presale.yourdomain.com/install
- [ ] Installation wizard appears (because DB is empty)
- [ ] Complete wizard to create Super Admin
- [ ] Login with Super Admin credentials
- [ ] Access Super Admin dashboard

### 5. First User Journey

Test the complete user flow:

- [ ] New user can register at `/signup`
- [ ] Registration creates user with 0 balance
- [ ] Email verification works
- [ ] User can login
- [ ] User dashboard shows 0 tokens
- [ ] User can start KYC process
- [ ] Admin can approve/reject KYC

### 6. Payment Integration

- [ ] Test INR deposit (small amount)
- [ ] Verify Cashfree payment gateway works
- [ ] Check webhook receives confirmation
- [ ] Verify balance updates correctly
- [ ] Test token purchase
- [ ] Verify transaction recorded

### 7. Security Verification

- [ ] HTTPS enabled (SSL certificate)
- [ ] CORS configured correctly
- [ ] Rate limiting active
- [ ] JWT authentication working
- [ ] 2FA available for admins
- [ ] No CORS errors in console
- [ ] No mixed content warnings

---

## 🔒 Security Final Checks

### Environment Variables

```bash
# On server, verify no default values
grep -E "(your-|example-|test-|demo-)" .env
# Should return nothing

# Verify production values
grep "NODE_ENV" .env
# Should show: production

grep "CASHFREE_ENVIRONMENT" .env
# Should show: PRODUCTION
```

- [ ] No default secrets found
- [ ] All values are production values

### Database Security

- [ ] Database user has limited privileges (not superuser)
- [ ] Database password is strong (20+ characters)
- [ ] Database not accessible from public internet
- [ ] SSL/TLS enabled for database connections
- [ ] Regular backups configured

### Application Security

- [ ] No console.log statements in production build
- [ ] No error stack traces exposed to users
- [ ] Rate limiting tested and working
- [ ] API endpoints require authentication
- [ ] Admin endpoints require admin role
- [ ] File upload size limits configured

---

## 📊 Monitoring Setup

### Application Monitoring

```bash
# Set up PM2 monitoring
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7

# Set up alerts
pm2 install pm2-slack
# Configure Slack webhook
```

- [ ] Log rotation configured
- [ ] Monitoring enabled
- [ ] Alerts configured

### Database Monitoring

- [ ] Connection pool monitoring
- [ ] Slow query logging enabled
- [ ] Disk space alerts
- [ ] Backup verification

---

## 🎉 Final Confirmation

### Data Verification

- [ ] ✅ Database has 0 users initially
- [ ] ✅ Database has 0 transactions initially
- [ ] ✅ All balances start at 0
- [ ] ✅ No demo or test data present
- [ ] ✅ Production environment confirmed
- [ ] ✅ Production API keys confirmed
- [ ] ✅ Production blockchain network confirmed

### System Status

- [ ] ✅ Backend running and healthy
- [ ] ✅ Frontend accessible
- [ ] ✅ Database connected and empty
- [ ] ✅ SSL/HTTPS working
- [ ] ✅ Payment gateway tested
- [ ] ✅ Email notifications working
- [ ] ✅ Backups configured

### Access Control

- [ ] ✅ Super admin created via installation wizard
- [ ] ✅ Super admin can access all features
- [ ] ✅ Regular users cannot access admin panels
- [ ] ✅ Installation wizard disabled after first use
- [ ] ✅ All passwords changed from defaults

---

## 🚨 Troubleshooting

### Database Connection Issues

```bash
# Test database connection
npx prisma db pull

# Check database credentials
echo $DATABASE_URL

# Test with psql
psql $DATABASE_URL -c "SELECT version();"
```

### Application Not Starting

```bash
# Check logs
pm2 logs vnc-backend --lines 100

# Check environment
printenv | grep NODE_ENV

# Verify build
ls -la dist/
```

### Empty Response from API

```bash
# Check if process is running
pm2 list

# Check port binding
sudo netstat -tulpn | grep 5000

# Check firewall
sudo ufw status
```

---

## 📞 Support Resources

- **Documentation:** `/docs/` folder
- **API Docs:** `https://api.yourdomain.com/api-docs`
- **GitHub Issues:** https://github.com/yeshurajbelly7/VNCBlockchain/issues
- **Logs Location:** `/var/log/vnc-blockchain/` or `pm2 logs`

---

## 📝 Sign-Off

Once all items are checked, your production deployment is complete!

**Deployed by:** _________________  
**Date:** _________________  
**Server:** _________________  
**Database Status:** Empty (0 records) ✅  
**Production Ready:** Yes ✅  

---

**Your live server is running with ZERO demo data!** 🎉
