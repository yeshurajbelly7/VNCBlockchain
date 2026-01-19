# 🚀 Production Deployment Guide - Fresh Start

**IMPORTANT:** This guide ensures your live server starts with clean data (no demo/test data)

---

## 📋 Pre-Deployment Checklist

### 1. **Environment Configuration** ✅

Create a **NEW** `.env` file on your live server with production values:

```bash
# Server Configuration
PORT=5000
NODE_ENV=production

# Database Configuration (PRODUCTION)
DATABASE_URL="postgresql://prod_user:STRONG_PASSWORD@localhost:5432/vnc_blockchain_prod?schema=public"

# JWT Configuration (GENERATE NEW SECRET)
JWT_SECRET=GENERATE-A-STRONG-64-CHARACTER-SECRET-HERE
JWT_EXPIRES_IN=7d

# Cashfree Configuration (PRODUCTION KEYS)
CASHFREE_APP_ID=your-production-app-id
CASHFREE_SECRET_KEY=your-production-secret-key
CASHFREE_ENVIRONMENT=PRODUCTION
CASHFREE_WEBHOOK_SECRET=your-production-webhook-secret

# Smart Contract Configuration (PRODUCTION)
PRESALE_CONTRACT_ADDRESS=0xYourProductionContractAddress
PRESALE_CONTRACT_ABI_PATH=./contracts/VNCPresale.json
NETWORK_RPC_URL=https://mainnet.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=your-production-deployer-private-key

# Email Configuration (PRODUCTION)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-production-email@gmail.com
SMTP_PASS=your-production-app-password
EMAIL_FROM=VNC Blockchain <noreply@vncblockchain.com>

# Admin Configuration
SUPER_ADMIN_EMAIL=admin@vncblockchain.com
SUPER_ADMIN_PASSWORD=GENERATE-STRONG-PASSWORD-HERE
```

---

## 🗄️ Database Setup (Fresh Installation)

### Step 1: Create Production Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create production database
CREATE DATABASE vnc_blockchain_prod;

# Create production user with strong password
CREATE USER prod_user WITH PASSWORD 'YOUR_STRONG_PASSWORD_HERE';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE vnc_blockchain_prod TO prod_user;

# Exit
\q
```

### Step 2: Run Migrations (Fresh Schema)

```bash
# Navigate to backend
cd backend/api-server

# Install dependencies
npm install --production

# Run migrations (creates tables with NO data)
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate
```

**RESULT:** ✅ Fresh database with all tables but **ZERO data**

---

## 🔐 Initial Setup (First-Time Only)

### Create Super Admin Account

The system will be completely empty. You need to create the first admin account.

**Option 1: Using Installation Wizard** (Recommended)

1. Start the application
2. Visit: `https://yourdomain.com/install`
3. Follow the setup wizard to create super admin
4. The wizard will be disabled after first use

**Option 2: Using API Endpoint**

```bash
# Create super admin via API
curl -X POST https://yourdomain.com/api/auth/setup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@vncblockchain.com",
    "password": "YourStrongPassword123!",
    "name": "Super Administrator"
  }'
```

**Option 3: Using Prisma Studio** (Manual)

```bash
# Open Prisma Studio
npx prisma studio

# Manually create a user with:
# - email: admin@vncblockchain.com
# - password_hash: (use bcrypt to hash your password)
# - role: SUPER_ADMIN
# - wallet_address: (generate one)
```

---

## 🚫 What NOT to Include in Production

### Files to EXCLUDE:

```
❌ .env.development
❌ .env.test
❌ seed.ts / seed.js (if exists)
❌ demo-data/ folder
❌ test-data/ folder
❌ *.test.ts files
❌ node_modules/ (reinstall on server)
```

### Scripts to NEVER Run:

```bash
❌ npm run seed           # If it exists
❌ npm run demo           # If it exists
❌ npm run test-data      # If it exists
❌ npx prisma db seed     # Seeds demo data
```

---

## 📦 Production Deployment Steps

### Step 1: Upload Code to Server

```bash
# On your server
cd /var/www/vnc-blockchain

# Clone from GitHub (recommended)
git clone https://github.com/yeshurajbelly7/VNCBlockchain.git .

# Or upload via FTP/SFTP
```

### Step 2: Backend Setup

```bash
cd backend/api-server

# Install ONLY production dependencies
npm install --production

# Create .env with production values (see above)
nano .env

# Run migrations (creates empty tables)
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate

# Build TypeScript
npm run build

# Start production server
npm start
```

### Step 3: Frontend Setup

```bash
# Presale Platform
cd frontend/presale-platform
npm install
npm run build
npm start  # Or deploy to Vercel/Netlify

# Public Website
cd frontend/public-website
npm install
npm run build
npm start  # Or deploy to Vercel/Netlify
```

---

## ✅ Verification (Ensure Clean Start)

### Check Database is Empty:

```bash
# Connect to database
psql -U prod_user -d vnc_blockchain_prod

# Check user count (should be 0 initially)
SELECT COUNT(*) FROM "User";

# Check transaction count (should be 0)
SELECT COUNT(*) FROM "Transaction";

# Check all tables are empty
SELECT 
  schemaname,
  tablename,
  (xpath('/row/cnt/text()', query_to_xml(format('select count(*) as cnt from %I.%I', schemaname, tablename), false, true, '')))[1]::text::int as row_count
FROM pg_tables 
WHERE schemaname = 'public';

# Exit
\q
```

**Expected Result:** All tables exist but have 0 rows ✅

---

## 🔒 Production Security Checklist

### 1. Environment Variables

- ✅ Strong JWT_SECRET (64+ characters)
- ✅ Strong database password
- ✅ Production Cashfree keys
- ✅ Production RPC URL
- ✅ Production email credentials

### 2. Database Security

- ✅ Dedicated production database
- ✅ Strong database password
- ✅ Limited user privileges
- ✅ Database backups enabled
- ✅ SSL/TLS connection enabled

### 3. Application Security

- ✅ `NODE_ENV=production`
- ✅ CORS configured for production domain only
- ✅ Rate limiting enabled
- ✅ Helmet security headers
- ✅ No debug/console logs

### 4. Data Privacy

- ✅ No test/demo data
- ✅ No hardcoded secrets
- ✅ No development data
- ✅ Fresh installation only

---

## 🔄 Database Reset (If Needed)

**DANGER:** Only use if you need to completely reset production database

```bash
# Backup first (IMPORTANT!)
pg_dump -U prod_user vnc_blockchain_prod > backup_$(date +%Y%m%d).sql

# Reset database
npx prisma migrate reset --force

# This will:
# 1. Drop all tables
# 2. Recreate all tables
# 3. Result: Fresh database with ZERO data
```

---

## 📊 Post-Deployment Monitoring

### Check Application Status:

```bash
# Backend API
curl https://yourdomain.com/api/health

# Expected response:
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2026-01-19T..."
}
```

### Check Database Connection:

```bash
# In backend directory
npx prisma db pull
# Should connect successfully
```

### Monitor Logs:

```bash
# Application logs
pm2 logs vnc-backend

# Database logs
sudo tail -f /var/log/postgresql/postgresql-*.log
```

---

## 📝 First User Registration

After deployment, the first user to register through `/signup` will be a regular USER role. You must:

1. ✅ Create SUPER_ADMIN first (using installation wizard)
2. ✅ Then allow user registrations
3. ✅ Regular users start with:
   - Role: `USER`
   - KYC Status: `PENDING`
   - Balance: `0`
   - Tokens: `0`

---

## 🎯 Clean Data Guarantee

Your production deployment will have:

✅ **Database:** Fresh PostgreSQL database  
✅ **Tables:** All schema tables created (empty)  
✅ **Users:** 0 users initially  
✅ **Transactions:** 0 transactions  
✅ **Tokens:** 0 tokens distributed  
✅ **Balances:** All start at 0  
✅ **KYC:** No pending KYC  
✅ **Referrals:** No referral data  
✅ **Airdrops:** No airdrops  

**Everything starts from ZERO on live server!** 🎉

---

## 🚨 Important Notes

### DO:
- ✅ Use separate production database
- ✅ Use production environment variables
- ✅ Run `prisma migrate deploy` (not `migrate dev`)
- ✅ Use `npm install --production`
- ✅ Set `NODE_ENV=production`
- ✅ Create backups before any changes

### DON'T:
- ❌ Copy development database to production
- ❌ Use development `.env` file
- ❌ Run seed scripts
- ❌ Import demo/test data
- ❌ Use development API keys
- ❌ Skip the installation wizard

---

## 📞 Support

If you encounter issues during production deployment:

1. Check logs: `pm2 logs` or `journalctl -u vnc-backend`
2. Verify database connection: `npx prisma db pull`
3. Check environment variables: `printenv | grep DATABASE_URL`
4. Verify migrations: `npx prisma migrate status`

---

**Generated:** January 19, 2026  
**Status:** Production-Ready Deployment Guide  
**Result:** Clean, fresh start with ZERO demo data ✅
