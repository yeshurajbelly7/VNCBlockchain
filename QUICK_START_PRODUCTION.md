# 🚀 VNC Blockchain - Production Deployment Quick Start

## ⚡ Fastest Way to Get Started (Windows)

### Option 1: Automated Setup (Recommended)

Run the automated setup script as Administrator:

```powershell
# Right-click PowerShell and select "Run as Administrator"
cd "D:\VNC Crypto Blockchan"
.\setup-windows.ps1
```

**This script will automatically:**
- ✅ Check Node.js installation
- ✅ Install Chocolatey package manager
- ✅ Install PostgreSQL 15
- ✅ Create vnc_blockchain database
- ✅ Install backend dependencies
- ✅ Install frontend dependencies
- ✅ Run database migrations
- ✅ Build backend TypeScript
- ✅ Configure environment files

**Time: 10-15 minutes**

---

### Option 2: Manual Setup

#### Step 1: Install PostgreSQL

**Download:** https://www.postgresql.org/download/windows/

1. Download PostgreSQL 15.x installer
2. Run installer
3. Set password: `postgres`
4. Port: `5432`
5. Install pgAdmin 4 (included)

#### Step 2: Create Database

Open pgAdmin 4:
```sql
CREATE DATABASE vnc_blockchain;
```

Or use command line:
```powershell
createdb -U postgres vnc_blockchain
```

#### Step 3: Install Backend Dependencies

```powershell
cd "D:\VNC Crypto Blockchan\backend\api-server"
npm install --legacy-peer-deps
```

#### Step 4: Configure Environment

```powershell
# Copy .env.example to .env
copy .env.example .env

# Edit .env file
notepad .env
```

Update these values:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/vnc_blockchain?schema=public"
JWT_SECRET=vnc_jwt_secret_change_in_production
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
```

#### Step 5: Run Migrations

```powershell
npx prisma generate
npx prisma migrate dev --name init
```

#### Step 6: Build Backend

```powershell
npm run build
```

#### Step 7: Start Backend

```powershell
npm run dev
```

Backend API running at: http://localhost:5000

#### Step 8: Install Frontend Dependencies (New Terminal)

```powershell
cd "D:\VNC Crypto Blockchan\frontend\presale-platform"
npm install
```

#### Step 9: Start Frontend

```powershell
npm run dev
```

Frontend running at: http://localhost:3002

---

## 🧪 Testing Your Setup

### Test 1: Backend Health Check
```powershell
curl http://localhost:5000/health
```

Expected: `{"status":"OK","timestamp":"..."}`

### Test 2: Register User
```powershell
curl -X POST http://localhost:5000/api/auth/signup `
  -H "Content-Type: application/json" `
  -d '{"email":"test@example.com","password":"Test@123456","name":"Test User"}'
```

### Test 3: Login
```powershell
curl -X POST http://localhost:5000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"email":"test@example.com","password":"Test@123456"}'
```

### Test 4: View Database
```powershell
cd backend\api-server
npx prisma studio
```

Opens at: http://localhost:5555

---

## 🔧 Troubleshooting

### Issue: PostgreSQL not starting
```powershell
# Check service status
Get-Service postgresql*

# Start service
Start-Service postgresql-x64-15
```

### Issue: Port 5000 already in use
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process (replace PID)
taskkill /PID <PID> /F
```

### Issue: Database connection error
```env
# Check DATABASE_URL in .env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/vnc_blockchain?schema=public"

# Verify database exists
psql -U postgres -c "\l"
```

### Issue: npm install fails
```powershell
# Clear npm cache
npm cache clean --force

# Delete node_modules
Remove-Item -Recurse -Force node_modules

# Reinstall
npm install --legacy-peer-deps
```

---

## 🌐 Accessing Your Application

### Local Development:
- **Frontend**: http://localhost:3002
- **Backend API**: http://localhost:5000
- **Database Admin**: http://localhost:5555 (prisma studio)
- **API Docs**: http://localhost:5000/api-docs (to be added)

### Test Accounts:
Create via signup page or API

### Admin Account:
```sql
-- Run in Prisma Studio or psql
UPDATE "User" SET role = 'SUPER_ADMIN' WHERE email = 'your-email@example.com';
```

---

## 📱 Mobile Testing

### Test on your phone (same WiFi):

1. Find your computer's IP:
```powershell
ipconfig
```

2. Look for IPv4 Address (e.g., 192.168.1.100)

3. Update frontend .env.local:
```env
NEXT_PUBLIC_API_URL=http://192.168.1.100:5000/api
```

4. Rebuild frontend:
```powershell
npm run build
npm run dev
```

5. Open on phone:
```
http://192.168.1.100:3002
```

---

## 🚀 Production Deployment

### Deploy to AWS (Recommended)

Read comprehensive guide: `AWS_DEPLOYMENT_GUIDE.md`

**Key Steps:**
1. Create AWS account
2. Apply for AWS Activate credits ($5,000-$100,000 free)
3. Setup VPC, EC2, RDS
4. Deploy backend + frontend
5. Configure SSL certificate
6. Setup CloudFront CDN
7. Enable monitoring & backups

**Monthly Cost:**
- Development: $71/month
- Production: $611/month
- With credits: FREE for 2 years!

### Deploy to Google Cloud

Similar architecture, slightly cheaper but less blockchain support.

See: `GCP_DEPLOYMENT_GUIDE.md` (to be created)

---

## 📊 What's Working Now?

✅ **Backend API Server** (Express + TypeScript)
- Authentication (JWT + bcrypt)
- 2FA with QR codes (Speakeasy)
- Database (PostgreSQL + Prisma)
- Cashfree webhook handler
- Email notifications (Nodemailer)
- Smart contract integration (ethers.js)

✅ **Frontend** (Next.js + React)
- Homepage with investment section
- Presale platform
- User dashboard
- Super admin panel
- 5 role-based dashboards
- Authentication system

✅ **Database Schema**
- 11 models (User, Transaction, Deposit, etc.)
- 9 enums (Role, KYCStatus, etc.)
- Proper relationships and indexes
- Audit logging

✅ **Security**
- Password hashing (bcrypt 12 rounds)
- JWT authentication
- 2FA support
- Rate limiting
- CORS configuration
- Helmet security headers
- Webhook signature verification

---

## 📝 Still Need to Configure

### 1. Email Service (SMTP)

**Option A: Gmail (Easy)**
1. Go to https://myaccount.google.com/security
2. Enable 2-Step Verification
3. Generate App Password
4. Update .env:
```env
SMTP_USER=your-email@gmail.com
SMTP_PASS=generated-app-password
```

**Option B: SendGrid (Professional)**
1. Create account: https://sendgrid.com
2. Generate API key
3. Update .env:
```env
SENDGRID_API_KEY=your-api-key
```

### 2. Smart Contract Deployment

```powershell
cd contracts

# Install dependencies
npm install

# Configure Hardhat
# Edit hardhat.config.js with your network settings

# Deploy to testnet first
npx hardhat run scripts/deploy.js --network sepolia

# Then deploy to mainnet
npx hardhat run scripts/deploy.js --network mainnet

# Save contract addresses
# Update backend/.env:
PRESALE_CONTRACT_ADDRESS=0x...
```

### 3. Cashfree Webhook URL

**For Local Testing:**
```powershell
# Install ngrok
choco install ngrok -y

# Start tunnel
ngrok http 5000

# Copy HTTPS URL (e.g., https://abc123.ngrok.io)
# Update Cashfree dashboard webhook:
https://abc123.ngrok.io/api/webhooks/cashfree
```

**For Production:**
```
https://api.vncblockchain.com/api/webhooks/cashfree
```

### 4. Environment Variables for Production

Update all URLs from localhost to production domains:
```env
FRONTEND_URL=https://vncblockchain.com
DATABASE_URL=postgresql://user:pass@your-rds-endpoint:5432/vnc_blockchain
REDIS_URL=redis://your-elasticache-endpoint:6379
```

---

## 🎯 Development Workflow

### Daily Development:

**Terminal 1: Backend**
```powershell
cd backend\api-server
npm run dev
```

**Terminal 2: Frontend**
```powershell
cd frontend\presale-platform
npm run dev
```

**Terminal 3: Database**
```powershell
cd backend\api-server
npx prisma studio
```

### Making Changes:

**Backend API changes:**
1. Edit files in `backend/api-server/src/`
2. Server auto-restarts (ts-node-dev)
3. Test endpoints with curl/Postman

**Frontend changes:**
1. Edit files in `frontend/presale-platform/src/`
2. Next.js auto-reloads
3. View changes in browser

**Database schema changes:**
1. Edit `backend/api-server/prisma/schema.prisma`
2. Run `npx prisma migrate dev --name your_change_name`
3. Run `npx prisma generate`

---

## 📚 Documentation

- **Backend API**: `backend/api-server/README.md`
- **AWS Deployment**: `AWS_DEPLOYMENT_GUIDE.md`
- **Authentication**: `AUTHENTICATION_AUDIT_REPORT.md`
- **Blockchain**: `BLOCKCHAIN_FUNDAMENTALS_AUDIT.md`
- **Features**: `COMPLETE_FEATURES_LIST.md`

---

## 🆘 Getting Help

### Check Logs:

**Backend logs:**
```powershell
cd backend\api-server
npm run dev
# Watch console output
```

**Database logs:**
```powershell
# Check PostgreSQL logs
Get-Content "C:\Program Files\PostgreSQL\15\data\log\postgresql-*.log" -Tail 50
```

**Frontend logs:**
- Open browser DevTools (F12)
- Check Console tab for errors

### Common Commands:

```powershell
# Restart PostgreSQL
Restart-Service postgresql-x64-15

# View database
npx prisma studio

# Reset database
npx prisma migrate reset

# Check running processes
netstat -ano | findstr "5000 3002 5432"

# View environment variables
Get-Content .env
```

---

## 🎉 You're Ready!

Your VNC Blockchain platform is now ready for:
- ✅ Local development
- ✅ Testing with real payments
- ✅ User registration and authentication
- ✅ Token presale functionality
- ✅ Admin management
- ✅ Production deployment

**Next:** Follow `AWS_DEPLOYMENT_GUIDE.md` to deploy to production!

---

**Questions?** Check documentation or create an issue on GitHub.

**Last Updated:** January 17, 2026
