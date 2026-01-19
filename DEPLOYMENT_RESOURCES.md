# 🚀 Server Deployment Resources - Overview

## Complete Deployment Package for VNC Blockchain

This repository now includes everything needed to deploy VNC Blockchain to a fresh production server with a clean database start.

---

## 📁 What's Included

### 🎯 Quick Start Guides

1. **[QUICK_DEPLOYMENT.md](./QUICK_DEPLOYMENT.md)**
   - 30-minute quick deployment guide
   - Perfect for getting started fast
   - Essential steps only

2. **[FRESH_DEPLOYMENT_GUIDE.md](./FRESH_DEPLOYMENT_GUIDE.md)**
   - Complete step-by-step deployment walkthrough
   - Detailed explanations for each step
   - Troubleshooting section included
   - **Recommended for first-time deployment**

3. **[PRE_DEPLOYMENT_CHECKLIST.md](./PRE_DEPLOYMENT_CHECKLIST.md)**
   - Comprehensive checklist (200+ items)
   - Ensures nothing is missed
   - Can be printed and used as documentation
   - Sign-off section for accountability

4. **[DEPLOYMENT_STATUS.md](./DEPLOYMENT_STATUS.md)**
   - Track your deployment progress
   - Document all configuration details
   - Emergency contact information
   - Status tracking for each phase

---

## 🛠️ Deployment Scripts

All scripts are located in the `scripts/` directory:

### Core Deployment Scripts

1. **`setup-fresh-server.sh`**
   - Installs all server dependencies
   - Configures Ubuntu server from scratch
   - Run once on fresh server

2. **`init-fresh-database.sh`**
   - Creates fresh database with all tables
   - Runs all migrations
   - Creates super admin user
   - Initializes presale stages

3. **`deploy-production.sh`**
   - Builds backend and frontend
   - Configures PM2 processes
   - Sets up Nginx reverse proxy
   - Starts all services

4. **`verify-deployment.sh`**
   - Automated deployment verification
   - Tests all critical components
   - Reports any issues found

### Utility Scripts

5. **`clean-for-deployment.sh`**
   - Cleans repository before deployment
   - Removes build artifacts
   - Removes node_modules
   - Keeps essential files only

6. **`backup-database.sh`**
   - Creates database backup
   - Compresses backup
   - Manages retention (30 days)
   - Essential for maintenance

**📖 For detailed script documentation, see [scripts/README.md](./scripts/README.md)**

---

## ⚙️ Configuration Files

### Environment Configuration

1. **`.env.production.example`**
   - Complete production environment template
   - 150+ configuration variables
   - Detailed comments for each variable
   - Copy to `.env` and fill in your values

### Key Variables to Configure

```bash
# Database
DATABASE_URL="postgresql://user:pass@host:port/db"

# Security
JWT_SECRET="generate-64-char-secret"

# Payment Gateway
CASHFREE_APP_ID="your-production-app-id"
CASHFREE_SECRET_KEY="your-production-secret"

# Smart Contracts
PRESALE_CONTRACT_ADDRESS="0x..."
TOKEN_CONTRACT_ADDRESS="0x..."

# Email
SMTP_USER="noreply@yourdomain.com"
SMTP_PASSWORD="your-app-password"

# Admin
SUPER_ADMIN_EMAIL="admin@yourdomain.com"
SUPER_ADMIN_PASSWORD="secure-password"
```

---

## 📚 Documentation Structure

```
VNCBlockchain/
├── QUICK_DEPLOYMENT.md          ← Start here (30 min)
├── FRESH_DEPLOYMENT_GUIDE.md    ← Complete guide (recommended)
├── PRE_DEPLOYMENT_CHECKLIST.md  ← Don't miss anything
├── DEPLOYMENT_STATUS.md         ← Track progress
├── .env.production.example      ← Configuration template
│
├── scripts/
│   ├── README.md                ← Scripts documentation
│   ├── setup-fresh-server.sh    ← Server setup
│   ├── init-fresh-database.sh   ← Database initialization
│   ├── deploy-production.sh     ← Application deployment
│   ├── verify-deployment.sh     ← Verification
│   ├── clean-for-deployment.sh  ← Cleanup
│   └── backup-database.sh       ← Backup
│
└── Existing Documentation/
    ├── SERVER_DEPLOYMENT_GUIDE.md
    ├── AWS_DEPLOYMENT_GUIDE.md
    ├── PRODUCTION_READINESS_CHECKLIST.md
    └── ... (other guides)
```

---

## 🎯 Deployment Workflow

### For Complete Beginners

```
1. Read QUICK_DEPLOYMENT.md
   ↓
2. Follow FRESH_DEPLOYMENT_GUIDE.md step-by-step
   ↓
3. Use PRE_DEPLOYMENT_CHECKLIST.md to verify
   ↓
4. Track progress in DEPLOYMENT_STATUS.md
```

### For Experienced Developers

```
1. Run setup-fresh-server.sh
   ↓
2. Configure .env from .env.production.example
   ↓
3. Run init-fresh-database.sh
   ↓
4. Run deploy-production.sh
   ↓
5. Run verify-deployment.sh
```

---

## ⚡ Quick Start Commands

```bash
# On fresh Ubuntu server (as root)
sudo bash scripts/setup-fresh-server.sh

# Clone repository (as app user)
git clone https://github.com/yeshurajbelly7/VNCBlockchain.git
cd VNCBlockchain

# Configure environment
cp .env.production.example .env
nano .env  # Fill in all values

# Initialize database
bash scripts/init-fresh-database.sh

# Deploy application
bash scripts/deploy-production.sh

# Verify deployment
bash scripts/verify-deployment.sh

# Setup SSL
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com
```

---

## 🎓 Learning Path

### New to Deployment?

1. **Start:** [QUICK_DEPLOYMENT.md](./QUICK_DEPLOYMENT.md)
2. **Read:** [FRESH_DEPLOYMENT_GUIDE.md](./FRESH_DEPLOYMENT_GUIDE.md)
3. **Check:** [PRE_DEPLOYMENT_CHECKLIST.md](./PRE_DEPLOYMENT_CHECKLIST.md)
4. **Track:** [DEPLOYMENT_STATUS.md](./DEPLOYMENT_STATUS.md)

### Already Deployed?

1. **Maintain:** Use `backup-database.sh` regularly
2. **Monitor:** `pm2 logs` and `pm2 status`
3. **Update:** Pull latest code and run `deploy-production.sh`
4. **Troubleshoot:** Check [FRESH_DEPLOYMENT_GUIDE.md](./FRESH_DEPLOYMENT_GUIDE.md) troubleshooting section

---

## 🔧 What Each Script Does

| Script | Purpose | When to Use | Time |
|--------|---------|-------------|------|
| `setup-fresh-server.sh` | Install dependencies | First time on server | 10-15 min |
| `init-fresh-database.sh` | Setup database | Before first deployment | 5-10 min |
| `deploy-production.sh` | Deploy application | Initial & updates | 10-15 min |
| `verify-deployment.sh` | Test deployment | After deployment | 1-2 min |
| `clean-for-deployment.sh` | Clean repository | Before upload | 1-2 min |
| `backup-database.sh` | Backup database | Daily/weekly | 2-3 min |

---

## ✅ What Gets Deployed

### Infrastructure
- ✅ Node.js 20.x
- ✅ PostgreSQL 15
- ✅ Redis 7
- ✅ Nginx
- ✅ PM2 Process Manager
- ✅ Firewall (UFW)
- ✅ SSL Certificates

### Application
- ✅ Backend API (Express + TypeScript)
- ✅ Frontend (Next.js + React)
- ✅ Database (Prisma ORM)
- ✅ Smart Contract Integration
- ✅ Payment Gateway (Cashfree)
- ✅ Email Service
- ✅ Admin Dashboard

### Features
- ✅ User Authentication
- ✅ 2FA Support
- ✅ KYC System
- ✅ Presale Platform
- ✅ Wallet Integration
- ✅ Transaction History
- ✅ Admin Controls

---

## 🔐 Security Features

All scripts and guides include:
- ✅ HTTPS enforcement
- ✅ Strong password requirements
- ✅ JWT token authentication
- ✅ Rate limiting
- ✅ Input validation
- ✅ SQL injection protection
- ✅ XSS protection
- ✅ CORS configuration
- ✅ Security headers
- ✅ Firewall rules

---

## 📊 System Requirements

### Minimum
- 2 CPU cores
- 4GB RAM
- 50GB SSD
- Ubuntu 20.04+

### Recommended
- 4+ CPU cores
- 8GB+ RAM
- 100GB+ SSD
- Ubuntu 22.04 LTS

---

## 🆘 Need Help?

### Documentation
1. [FRESH_DEPLOYMENT_GUIDE.md](./FRESH_DEPLOYMENT_GUIDE.md) - Most comprehensive
2. [PRE_DEPLOYMENT_CHECKLIST.md](./PRE_DEPLOYMENT_CHECKLIST.md) - Don't miss steps
3. [scripts/README.md](./scripts/README.md) - Script details
4. [SERVER_DEPLOYMENT_GUIDE.md](./SERVER_DEPLOYMENT_GUIDE.md) - Advanced options

### Troubleshooting
- Check logs: `pm2 logs`
- View status: `pm2 status`
- Test backend: `curl http://localhost:5000/health`
- Review errors: Deployment guide troubleshooting section

### Common Issues
- **Database connection failed** → Check DATABASE_URL
- **Backend won't start** → Check logs with `pm2 logs vnc-backend`
- **Frontend not loading** → Verify build with `pm2 logs vnc-frontend`
- **SSL certificate issues** → Run `sudo certbot renew`

---

## 🎉 Success Criteria

Your deployment is successful when:

- [ ] Frontend loads at https://yourdomain.com
- [ ] Backend API responds at https://api.yourdomain.com/health
- [ ] Users can register and login
- [ ] Emails are being sent
- [ ] Payments work (test with small amount)
- [ ] Admin panel accessible
- [ ] All PM2 processes running
- [ ] SSL certificates valid
- [ ] No errors in logs

---

## 📅 Maintenance

### Daily
- Check `pm2 status`
- Review `pm2 logs` for errors
- Monitor server resources

### Weekly
- Run `bash scripts/backup-database.sh`
- Check SSL certificate validity
- Review user feedback
- Update dependencies if needed

### Monthly
- System updates: `sudo apt update && sudo apt upgrade`
- Database optimization
- Security audit
- Performance review

---

## 🚀 Ready to Deploy?

1. **Choose your guide:**
   - Quick (30 min): [QUICK_DEPLOYMENT.md](./QUICK_DEPLOYMENT.md)
   - Complete: [FRESH_DEPLOYMENT_GUIDE.md](./FRESH_DEPLOYMENT_GUIDE.md)

2. **Use the checklist:**
   - [PRE_DEPLOYMENT_CHECKLIST.md](./PRE_DEPLOYMENT_CHECKLIST.md)

3. **Track your progress:**
   - [DEPLOYMENT_STATUS.md](./DEPLOYMENT_STATUS.md)

4. **Run the scripts:**
   - See [scripts/README.md](./scripts/README.md)

---

## 📝 Updates

**Version:** 1.0.0  
**Last Updated:** January 17, 2026  
**Status:** Production Ready

---

**Questions?** Start with [FRESH_DEPLOYMENT_GUIDE.md](./FRESH_DEPLOYMENT_GUIDE.md)

**Issues?** Check the troubleshooting sections in the deployment guides

**Ready?** Begin with [QUICK_DEPLOYMENT.md](./QUICK_DEPLOYMENT.md)

---

**🎯 Everything you need for a successful fresh server deployment is now included!**
