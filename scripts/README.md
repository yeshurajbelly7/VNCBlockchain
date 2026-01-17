# VNC Blockchain Deployment Scripts

This directory contains all scripts needed for fresh server deployment and maintenance.

## 📁 Scripts Overview

### 1. `setup-fresh-server.sh`
**Purpose:** Initial server setup with all dependencies  
**When to use:** First time on a fresh server  
**Requires:** Root/sudo access  
**Time:** ~10-15 minutes

```bash
sudo bash scripts/setup-fresh-server.sh
```

**What it does:**
- Updates system packages
- Installs Node.js 20.x
- Installs PostgreSQL 15
- Installs Redis
- Installs Nginx
- Installs PM2
- Configures firewall
- Creates application user

---

### 2. `init-fresh-database.sh`
**Purpose:** Initialize fresh database with schema and initial data  
**When to use:** After server setup, before deployment  
**Requires:** `.env` file configured  
**Time:** ~5-10 minutes

```bash
bash scripts/init-fresh-database.sh
```

**What it does:**
- Installs backend dependencies
- Generates Prisma client
- Resets database (clean slate)
- Runs all migrations
- Creates super admin user
- Initializes presale stages

**⚠️ Warning:** This will delete all existing data in the database!

---

### 3. `deploy-production.sh`
**Purpose:** Build and deploy application to production  
**When to use:** After database initialization  
**Requires:** Database initialized, `.env` configured  
**Time:** ~10-15 minutes

```bash
bash scripts/deploy-production.sh
```

**What it does:**
- Installs all dependencies
- Builds backend (TypeScript)
- Builds frontend (Next.js)
- Configures PM2 processes
- Sets up Nginx reverse proxy
- Starts all services

---

### 4. `verify-deployment.sh`
**Purpose:** Verify that deployment was successful  
**When to use:** After deployment  
**Requires:** Application running  
**Time:** ~1 minute

```bash
bash scripts/verify-deployment.sh
```

**What it checks:**
- Backend process status
- Frontend process status
- Health endpoint response
- Database connectivity
- Redis connectivity
- Nginx status
- Server resources (disk, memory)
- Recent errors in logs

---

### 5. `clean-for-deployment.sh`
**Purpose:** Clean all generated files before uploading to server  
**When to use:** Before committing or uploading code  
**Requires:** None  
**Time:** ~1-2 minutes

```bash
bash scripts/clean-for-deployment.sh
```

**What it removes:**
- node_modules directories
- Build artifacts (dist, .next, build)
- Log files
- Temporary files
- Environment files (keeps examples)
- Deployment artifacts
- Cache files

---

## 🚀 Complete Deployment Workflow

### Step-by-Step Guide for Fresh Server

1. **Prepare Your Local Repository**
   ```bash
   # Clean the repository
   bash scripts/clean-for-deployment.sh
   
   # Commit changes
   git add .
   git commit -m "Prepare for deployment"
   git push
   ```

2. **Setup Fresh Server**
   ```bash
   # SSH into server
   ssh root@YOUR_SERVER_IP
   
   # Run server setup
   sudo bash scripts/setup-fresh-server.sh
   ```

3. **Clone Repository**
   ```bash
   # Switch to application user
   su - vncapp
   
   # Clone repository
   git clone https://github.com/yeshurajbelly7/VNCBlockchain.git
   cd VNCBlockchain
   ```

4. **Configure Environment**
   ```bash
   # Copy environment template
   cp .env.production.example .env
   
   # Edit environment variables
   nano .env
   # Fill in all required values!
   ```

5. **Initialize Database**
   ```bash
   # Run database initialization
   bash scripts/init-fresh-database.sh
   ```

6. **Deploy Application**
   ```bash
   # Deploy to production
   bash scripts/deploy-production.sh
   ```

7. **Verify Deployment**
   ```bash
   # Run verification checks
   bash scripts/verify-deployment.sh
   ```

8. **Setup SSL**
   ```bash
   # Install certbot and get certificates
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com
   ```

9. **Final Testing**
   - Visit https://yourdomain.com
   - Test user registration
   - Test login
   - Test admin panel
   - Test payment flow

---

## 🔧 Maintenance Scripts

### Daily Operations

```bash
# View application status
pm2 status

# View logs
pm2 logs

# Restart application
pm2 restart all

# Monitor resources
pm2 monit
```

### Database Operations

```bash
# Backup database
pg_dump -U vnc_admin vnc_blockchain > backup_$(date +%Y%m%d).sql

# Restore database
psql -U vnc_admin vnc_blockchain < backup_20260117.sql

# Run new migrations
cd backend/api-server
npx prisma migrate deploy
```

### Application Updates

```bash
# Pull latest code
git pull origin main

# Rebuild and restart
bash scripts/deploy-production.sh
```

---

## 📋 Prerequisites

Before running any scripts, ensure:

1. **For `setup-fresh-server.sh`:**
   - Ubuntu 20.04/22.04 LTS server
   - Root/sudo access
   - Internet connection

2. **For `init-fresh-database.sh`:**
   - `.env` file configured
   - PostgreSQL running
   - Database and user created

3. **For `deploy-production.sh`:**
   - Database initialized
   - Node.js installed
   - All dependencies available

---

## ⚠️ Important Notes

### Security
- Always use strong passwords for database, Redis, and admin accounts
- Generate unique JWT secrets (64+ characters)
- Never commit `.env` files to Git
- Keep private keys secure
- Enable firewall on production servers

### Environment Variables
Required variables in `.env`:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Unique secret for JWT tokens
- `CASHFREE_APP_ID` - Production Cashfree credentials
- `CASHFREE_SECRET_KEY` - Production Cashfree credentials
- `SMTP_USER` / `SMTP_PASSWORD` - Email credentials
- `PRESALE_CONTRACT_ADDRESS` - Deployed contract address
- `TOKEN_CONTRACT_ADDRESS` - Deployed token address

### Troubleshooting

**Scripts won't run:**
```bash
# Make scripts executable
chmod +x scripts/*.sh
```

**Permission denied:**
```bash
# Run with sudo (for setup-fresh-server.sh only)
sudo bash scripts/setup-fresh-server.sh
```

**Database connection failed:**
- Check DATABASE_URL in .env
- Verify PostgreSQL is running: `systemctl status postgresql`
- Test connection: `psql -U vnc_admin -d vnc_blockchain`

**PM2 processes not starting:**
- Check logs: `pm2 logs`
- Verify build completed: Check dist/ and .next/ directories
- Restart: `pm2 restart all`

---

## 📞 Support

For issues or questions:

1. Check the logs: `pm2 logs`
2. Review error messages
3. Consult documentation:
   - [Fresh Deployment Guide](../FRESH_DEPLOYMENT_GUIDE.md)
   - [Pre-Deployment Checklist](../PRE_DEPLOYMENT_CHECKLIST.md)
   - [Server Deployment Guide](../SERVER_DEPLOYMENT_GUIDE.md)

---

## 📝 Script Maintenance

When updating scripts:
1. Test on a clean server first
2. Update version numbers
3. Update documentation
4. Commit changes with clear message

---

**🚀 Happy Deploying!**

For complete deployment guide, see [FRESH_DEPLOYMENT_GUIDE.md](../FRESH_DEPLOYMENT_GUIDE.md)
