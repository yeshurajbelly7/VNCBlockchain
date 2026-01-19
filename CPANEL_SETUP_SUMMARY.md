# ✅ cPanel Deployment - Complete Setup Summary

**Date:** January 19, 2026  
**Platform:** cPanel Shared Hosting  
**Status:** Ready for Deployment

---

## 📦 What's Been Created for cPanel

### 1. **Documentation**
- ✅ `CPANEL_DEPLOYMENT.md` - Complete 900-line deployment guide
- ✅ `CPANEL_QUICK_START.md` - 15-minute quick deployment guide
- ✅ `PRODUCTION_DEPLOYMENT.md` - Production environment setup
- ✅ `PRODUCTION_CHECKLIST.md` - Step-by-step verification

### 2. **Deployment Scripts**
- ✅ `deploy-cpanel.sh` - Linux/Mac automated deployment
- ✅ `deploy-cpanel.ps1` - Windows deployment package builder

### 3. **Configuration Files**
- ✅ `.htaccess.cpanel` for backend API (security + Node.js)
- ✅ `.htaccess.cpanel` for presale platform (Next.js routing)
- ✅ `.htaccess.cpanel` for public website (optimization)
- ✅ `.env.production` - Production environment template

---

## 🚀 Two Ways to Deploy

### Method 1: Automated (Recommended) ⚡

**On Your Computer:**
```powershell
# Windows
cd "d:\VNC Crypto Blockchan"
.\deploy-cpanel.ps1
```

```bash
# Linux/Mac
cd /path/to/vnc-blockchain
chmod +x deploy-cpanel.sh
./deploy-cpanel.sh
```

**Result:** Creates `cpanel_deployment_YYYYMMDD.zip` ready to upload

**On cPanel:**
1. Upload zip to File Manager
2. Extract in home directory
3. Follow 10 simple steps (15 minutes)
4. Done! ✅

### Method 2: Manual Upload 📤

1. Upload files via FTP/File Manager:
   - `backend/api-server/` → `/home/username/api/`
   - `frontend/presale-platform/` → `/home/username/presale/`
   - `frontend/public-website/` → `/home/username/public_html/`

2. Create PostgreSQL database in cPanel

3. Setup 3 Node.js apps in cPanel

4. Install dependencies and build

5. Configure subdomains and SSL

6. Restart apps

---

## 📊 cPanel Requirements

### Hosting Features Needed:
- ✅ Node.js 18+ (via Setup Node.js App)
- ✅ PostgreSQL database
- ✅ SSH access (optional but helpful)
- ✅ SSL support (Let's Encrypt - free)
- ✅ Multiple domains/subdomains

### Recommended Hosting Specs:
- **RAM:** 2GB+ recommended
- **Storage:** 10GB+ available
- **Bandwidth:** Unlimited or 50GB+
- **Domains:** Support for subdomains

---

## 🗂️ Directory Structure on cPanel

```
/home/username/
├── api/                              # Backend API
│   ├── src/
│   ├── dist/                         # Built files
│   ├── prisma/
│   ├── .env                          # Production config
│   ├── .htaccess                     # Node.js + security
│   ├── package.json
│   └── node_modules/
│
├── presale/                          # Presale Platform
│   ├── src/
│   ├── .next/                        # Next.js build
│   ├── .env.local
│   ├── .htaccess                     # Next.js routing
│   └── node_modules/
│
├── public_html/                      # Public Website
│   ├── src/
│   ├── .next/                        # Next.js build
│   ├── .env.local
│   ├── .htaccess                     # Next.js routing
│   └── node_modules/
│
└── .well-known/                      # SSL verification
```

---

## 🌐 Domain Configuration

### Required Domains:

| Domain/Subdomain | Points To | Purpose |
|------------------|-----------|---------|
| `yourdomain.com` | `/home/username/public_html` | Public website |
| `presale.yourdomain.com` | `/home/username/presale` | Presale platform |
| `api.yourdomain.com` | `/home/username/api` | Backend API |

### SSL Certificates:
All domains get free SSL via Let's Encrypt (AutoSSL in cPanel)

---

## 💾 Database Setup

### PostgreSQL Configuration:

1. **Database Name:** `username_vncblockchain`
2. **Database User:** `username_vncprod`
3. **Password:** Strong 20+ character password
4. **Privileges:** ALL PRIVILEGES
5. **Initial State:** EMPTY (0 tables)

After migrations run:
- ✅ All tables created
- ✅ Zero data in all tables
- ✅ No demo or test data

---

## 🔧 Node.js Application Settings

### App 1: Backend API
```
Node.js Version: 18.x
Application Mode: Production
Application Root: /home/username/api
Application URL: api.yourdomain.com
Startup File: dist/server.js
Environment: NODE_ENV=production
```

### App 2: Presale Platform
```
Node.js Version: 18.x
Application Mode: Production
Application Root: /home/username/presale
Application URL: presale.yourdomain.com
Startup File: node_modules/next/dist/bin/next
Startup Command: start
```

### App 3: Public Website
```
Node.js Version: 18.x
Application Mode: Production
Application Root: /home/username/public_html
Application URL: yourdomain.com
Startup File: node_modules/next/dist/bin/next
Startup Command: start
```

---

## ✅ Deployment Checklist

### Pre-Deployment:
- [ ] cPanel login credentials ready
- [ ] Domain/subdomains registered
- [ ] Deployment package prepared
- [ ] Production API keys ready (Cashfree, RPC, Email)

### During Deployment:
- [ ] Files uploaded to cPanel
- [ ] PostgreSQL database created
- [ ] .env file configured
- [ ] Dependencies installed
- [ ] Database migrations run
- [ ] Apps built successfully
- [ ] Node.js apps created in cPanel
- [ ] Subdomains configured
- [ ] SSL certificates enabled

### Post-Deployment:
- [ ] Backend API health check passes
- [ ] Presale platform loads
- [ ] Public website loads
- [ ] Database verified empty
- [ ] Installation wizard accessible
- [ ] Admin account created

---

## 🔒 Security Features

### Implemented:
- ✅ `.env` files protected (not web-accessible)
- ✅ Sensitive files blocked in `.htaccess`
- ✅ Security headers configured
- ✅ SSL/TLS enabled on all domains
- ✅ Database credentials secured
- ✅ JWT secrets auto-generated
- ✅ Production environment enforced

### .htaccess Protection:
```apache
<FilesMatch "^\.env.*">
    Order allow,deny
    Deny from all
</FilesMatch>
```

---

## 📈 Performance Optimization

### Enabled Features:
- ✅ Gzip compression for text files
- ✅ Browser caching for static assets
- ✅ Passenger performance settings
- ✅ Optimized Node.js pool size
- ✅ Next.js production build
- ✅ ETag removal for better caching

### Expected Performance:
- Page Load: 1-3 seconds
- API Response: 100-500ms
- SSL Handshake: ~100ms

---

## 🎯 Clean Data Guarantee

### Database State After Deployment:

| Table | Row Count | Status |
|-------|-----------|--------|
| User | 0 | Empty ✅ |
| Transaction | 0 | Empty ✅ |
| Deposit | 0 | Empty ✅ |
| Withdrawal | 0 | Empty ✅ |
| Referral | 0 | Empty ✅ |
| Presale | 0 | Empty ✅ |
| AuditLog | 0 | Empty ✅ |
| **All Tables** | **0** | **Empty ✅** |

**No demo data. No test data. Clean start guaranteed!**

---

## 📞 Quick Reference

### Common Commands (SSH):

```bash
# Check Node.js version
node --version

# Activate Node.js environment
source ~/nodevenv/api/18/bin/activate

# View application logs
tail -f ~/api/tmp/log/production.log

# Restart application
touch ~/api/tmp/restart.txt

# Check database
psql $DATABASE_URL -c "SELECT COUNT(*) FROM \"User\";"

# View running processes
ps aux | grep node
```

### cPanel Access Points:

| Feature | Location in cPanel |
|---------|-------------------|
| Node.js Apps | Software → Setup Node.js App |
| PostgreSQL | Databases → PostgreSQL Databases |
| File Manager | Files → File Manager |
| Subdomains | Domains → Subdomains |
| SSL/TLS | Security → SSL/TLS Status |
| Cron Jobs | Advanced → Cron Jobs |
| Error Logs | Metrics → Errors |

---

## 🚨 Common Issues & Solutions

### Issue: "Application failed to start"
✅ Check logs in cPanel Node.js app  
✅ Verify .env file exists and is correct  
✅ Ensure dependencies are installed  

### Issue: "Cannot connect to database"
✅ Verify DATABASE_URL in .env  
✅ Check PostgreSQL user privileges  
✅ Ensure database was created  

### Issue: "502 Bad Gateway"
✅ Restart Node.js application  
✅ Check if build completed (dist/ folder exists)  
✅ Verify Passenger is enabled  

### Issue: "Module not found"
✅ Run `npm ci` in application directory  
✅ Check Node.js version (must be 18+)  
✅ Ensure package.json is present  

---

## 📖 Documentation Reference

| Document | Purpose | When to Use |
|----------|---------|-------------|
| `CPANEL_QUICK_START.md` | 15-min deployment | Quick setup |
| `CPANEL_DEPLOYMENT.md` | Complete guide (900 lines) | Detailed setup |
| `PRODUCTION_DEPLOYMENT.md` | Environment config | Configuration help |
| `PRODUCTION_CHECKLIST.md` | Step verification | During deployment |
| `CLEAN_START_SUMMARY.md` | Clean data guarantee | Understanding data state |

---

## ⏱️ Deployment Timeline

**Automated Method:**
1. Run script on computer: **2 minutes**
2. Upload to cPanel: **3 minutes**
3. Setup in cPanel: **5 minutes**
4. Install dependencies: **5 minutes**
5. Configure & test: **3 minutes**

**Total: 15-20 minutes** ⚡

**Manual Method:**
**Total: 25-35 minutes**

---

## 🎉 Final Result

After deployment, you will have:

✅ **Backend API:** `https://api.yourdomain.com` (healthy & running)  
✅ **Presale Platform:** `https://presale.yourdomain.com` (built & optimized)  
✅ **Public Website:** `https://yourdomain.com` (fast & secure)  
✅ **Database:** PostgreSQL with empty tables (0 records)  
✅ **SSL:** Enabled on all domains (HTTPS)  
✅ **Security:** Production-grade (.htaccess, headers, etc.)  
✅ **Performance:** Optimized (caching, compression, etc.)  

**Everything starts from ZERO on your cPanel hosting!** 🎊

---

## 📝 Next Steps

1. ✅ Review `CPANEL_QUICK_START.md` for deployment steps
2. ✅ Prepare your production credentials (Cashfree, RPC, Email)
3. ✅ Run deployment script or upload files
4. ✅ Follow the 10-step process in cPanel
5. ✅ Visit `/install` to create admin account
6. ✅ Start accepting real users!

---

**Generated:** January 19, 2026  
**Platform:** cPanel Shared Hosting ✅  
**Clean Start:** Guaranteed (0 demo data) ✅  
**Ready to Deploy:** Yes! 🚀
