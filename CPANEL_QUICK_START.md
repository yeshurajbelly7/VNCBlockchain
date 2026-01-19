# 🚀 cPanel Deployment - Quick Start Guide

**Deploy VNC Blockchain to cPanel shared hosting in 15 minutes**

---

## ⚡ Quick Overview

Your cPanel hosting needs:
- ✅ Node.js 18+ support
- ✅ PostgreSQL database
- ✅ SSL certificate (free via Let's Encrypt)
- ✅ 3 domains/subdomains

---

## 📦 Method 1: Automated Deployment (Recommended)

### Step 1: Run Deployment Script (On Your Computer)

**Windows:**
```powershell
cd "d:\VNC Crypto Blockchan"
.\deploy-cpanel.ps1
```

**Linux/Mac:**
```bash
cd /path/to/VNC-Crypto-Blockchan
chmod +x deploy-cpanel.sh
./deploy-cpanel.sh
```

This creates a deployment package: `cpanel_deployment_YYYYMMDD.zip`

### Step 2: Upload to cPanel

1. Log into cPanel
2. Go to **File Manager**
3. Navigate to your home directory (`/home/username/`)
4. Click **Upload**
5. Upload the `cpanel_deployment_YYYYMMDD.zip` file
6. Right-click the zip file → **Extract**
7. Done! Files are in place ✅

### Step 3: Create Database

1. Go to **PostgreSQL Databases**
2. Create database: `username_vncblockchain`
3. Create user: `username_vncprod` with strong password
4. Add user to database with **ALL PRIVILEGES**

### Step 4: Setup Node.js Apps

Go to **Setup Node.js App** → Click **Create Application**

**App 1: Backend API**
- Node.js version: **18.x**
- Application mode: **Production**
- Application root: `/home/username/api`
- Application URL: `api.yourdomain.com`
- Application startup file: `dist/server.js`

**App 2: Presale Platform**
- Node.js version: **18.x**
- Application mode: **Production**
- Application root: `/home/username/presale`
- Application URL: `presale.yourdomain.com`
- Application startup file: `node_modules/next/dist/bin/next`
- Application startup command: `start`

**App 3: Public Website**
- Node.js version: **18.x**
- Application mode: **Production**
- Application root: `/home/username/public_html`
- Application URL: `yourdomain.com`
- Application startup file: `node_modules/next/dist/bin/next`

### Step 5: Install Dependencies

For each app, click **"Run NPM Install"** in cPanel or use terminal:

**Backend:**
```bash
cd /home/username/api
source /home/username/nodevenv/api/18/bin/activate
npm ci --production
npm install prisma --save-dev
npx prisma generate
npx prisma migrate deploy  # Creates empty database tables
npm run build
```

**Presale:**
```bash
cd /home/username/presale
source /home/username/nodevenv/presale/18/bin/activate
npm ci
npm run build
```

**Public Website:**
```bash
cd /home/username/public_html
source /home/username/nodevenv/public_html/18/bin/activate
npm ci
npm run build
```

### Step 6: Create Subdomains

1. Go to **Subdomains**
2. Create:
   - `api` → Document Root: `/home/username/api`
   - `presale` → Document Root: `/home/username/presale`

### Step 7: Enable SSL

1. Go to **SSL/TLS Status**
2. Click **Run AutoSSL**
3. Wait for SSL certificates to be issued

### Step 8: Update Configuration

Edit `/home/username/api/.env` (via File Manager or SSH):
- Update Cashfree production keys
- Update smart contract addresses
- Update email credentials

### Step 9: Restart Apps

In **Setup Node.js App**:
- Click **Restart** for each application

### Step 10: Create Admin

1. Visit: `https://presale.yourdomain.com/install`
2. Complete installation wizard
3. Create Super Admin account
4. Done! ✅

---

## 📋 Method 2: Manual Upload (No Scripts)

### 1. Download from GitHub

```bash
# On your computer
git clone https://github.com/yeshurajbelly7/VNCBlockchain.git
cd VNCBlockchain
```

### 2. Upload via FTP

**FTP Details:**
- Host: `ftp.yourdomain.com`
- Username: Your cPanel username
- Password: Your cPanel password
- Port: 21

**Upload Structure:**
```
/home/username/
├── api/
│   └── (upload all files from backend/api-server/)
├── presale/
│   └── (upload all files from frontend/presale-platform/)
└── public_html/
    └── (upload all files from frontend/public-website/)
```

### 3. Create .env File

In `/home/username/api/`, create `.env`:

```env
PORT=${PORT:-3000}
NODE_ENV=production
DATABASE_URL="postgresql://username_vncprod:PASSWORD@localhost:5432/username_vncblockchain"
JWT_SECRET=GENERATE_64_CHAR_SECRET
JWT_EXPIRES_IN=7d
CASHFREE_APP_ID=your-production-app-id
CASHFREE_SECRET_KEY=your-production-secret-key
CASHFREE_ENVIRONMENT=PRODUCTION
FRONTEND_PRESALE_URL=https://presale.yourdomain.com
FRONTEND_PUBLIC_URL=https://yourdomain.com
```

### 4. Follow Steps 3-10 from Method 1

---

## 🔍 Verification Checklist

After deployment, verify:

- [ ] Backend API responds: `https://api.yourdomain.com/api/health`
- [ ] Presale platform loads: `https://presale.yourdomain.com`
- [ ] Public website loads: `https://yourdomain.com`
- [ ] All domains have SSL (https://)
- [ ] Database is empty: 0 users, 0 transactions
- [ ] Installation wizard appears at `/install`

---

## 🎯 Expected Result

✅ **Backend API:** Running at `https://api.yourdomain.com`  
✅ **Presale Platform:** Running at `https://presale.yourdomain.com`  
✅ **Public Website:** Running at `https://yourdomain.com`  
✅ **Database:** Empty (0 records)  
✅ **SSL:** Enabled on all domains  
✅ **Security:** Production-grade  

---

## 🚨 Common Issues

### Issue: "Application failed to start"
**Solution:** Check Node.js app logs in cPanel, verify `.env` file exists

### Issue: "Database connection error"
**Solution:** Verify DATABASE_URL in .env matches database credentials

### Issue: "502 Bad Gateway"
**Solution:** Restart Node.js app, check if build completed successfully

### Issue: "Module not found"
**Solution:** Run `npm ci` again in the app directory

### Issue: "Permission denied"
**Solution:** Set permissions: `chmod -R 755 /home/username/api`

---

## 📞 Support

- **Detailed Guide:** See `CPANEL_DEPLOYMENT.md`
- **Troubleshooting:** See Section 11 in `CPANEL_DEPLOYMENT.md`
- **Configuration:** See `PRODUCTION_DEPLOYMENT.md`

---

## ⏱️ Deployment Time

- Method 1 (Automated): **10-15 minutes**
- Method 2 (Manual): **20-30 minutes**

---

## ✅ Final Checklist

Before going live:

- [ ] All files uploaded
- [ ] Database created and empty
- [ ] .env configured with production values
- [ ] All dependencies installed
- [ ] All apps built successfully
- [ ] Node.js apps created in cPanel
- [ ] Subdomains configured
- [ ] SSL enabled
- [ ] All apps restarted
- [ ] Health check passed
- [ ] Admin account created

---

**Your cPanel hosting is ready with ZERO demo data!** 🎉

**Generated:** January 19, 2026  
**Platform:** cPanel Shared Hosting  
**Deployment Time:** 15 minutes ⚡
