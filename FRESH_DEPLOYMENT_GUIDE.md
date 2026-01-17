# 🚀 VNC Blockchain - Fresh Server Deployment Guide

## Complete Step-by-Step Guide for Production Deployment from Scratch

**Last Updated:** January 17, 2026  
**Version:** 1.0.0  
**Deployment Type:** Fresh Production Server with Clean Database

---

## 📋 Table of Contents

1. [Pre-Deployment Requirements](#pre-deployment-requirements)
2. [Server Setup](#server-setup)
3. [Database Initialization](#database-initialization)
4. [Application Deployment](#application-deployment)
5. [Post-Deployment Verification](#post-deployment-verification)
6. [Troubleshooting](#troubleshooting)

---

## 📦 Pre-Deployment Requirements

### What You Need Before Starting

#### 1. Server Requirements
- **OS:** Ubuntu 20.04 LTS or later (Recommended: Ubuntu 22.04 LTS)
- **CPU:** Minimum 2 cores (Recommended: 4+ cores)
- **RAM:** Minimum 4GB (Recommended: 8GB+)
- **Storage:** Minimum 50GB SSD (Recommended: 100GB+ SSD)
- **Network:** Public IP address with open ports 80, 443

#### 2. Domain & DNS
- Domain name purchased (e.g., yourdomain.com)
- DNS A records configured:
  - `yourdomain.com` → Your Server IP
  - `www.yourdomain.com` → Your Server IP
  - `api.yourdomain.com` → Your Server IP

#### 3. Required Accounts & API Keys
- **Cashfree:** Production API credentials
  - App ID
  - Secret Key
  - Webhook Secret
- **Email Service:** SMTP credentials or SendGrid API key
- **WalletConnect:** Project ID (optional)
- **Domain Registrar:** Access to DNS settings

#### 4. Smart Contracts (Deploy these first!)
- VNC Token Contract deployed
- Presale Contract deployed
- Staking Contract deployed (optional)
- Note: Keep all contract addresses handy

---

## 🖥️ Server Setup

### Step 1: Initial Server Access

```bash
# SSH into your server
ssh root@YOUR_SERVER_IP

# Update system hostname (optional)
hostnamectl set-hostname vncblockchain
```

### Step 2: Run Fresh Server Setup

```bash
# Download and run the setup script
wget https://raw.githubusercontent.com/yeshurajbelly7/VNCBlockchain/main/scripts/setup-fresh-server.sh
chmod +x setup-fresh-server.sh
sudo ./setup-fresh-server.sh
```

This script will:
- ✅ Update all system packages
- ✅ Install Node.js 20.x
- ✅ Install PostgreSQL 15
- ✅ Install Redis
- ✅ Install Nginx
- ✅ Install PM2 (Process Manager)
- ✅ Configure firewall (UFW)
- ✅ Create application user (`vncapp`)
- ✅ Setup application directory

**Time:** ~10-15 minutes

### Step 3: Configure PostgreSQL Database

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE vnc_blockchain;
CREATE USER vnc_admin WITH ENCRYPTED PASSWORD 'YOUR_SECURE_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE vnc_blockchain TO vnc_admin;
\q
```

### Step 4: Configure Redis

```bash
# Edit Redis configuration
sudo nano /etc/redis/redis.conf

# Find and modify these lines:
# requirepass YOUR_REDIS_PASSWORD
# bind 127.0.0.1

# Restart Redis
sudo systemctl restart redis-server
```

---

## 📥 Clone Repository and Configure

### Step 5: Clone Repository

```bash
# Switch to application user
su - vncapp

# Clone repository
cd ~
git clone https://github.com/yeshurajbelly7/VNCBlockchain.git
cd VNCBlockchain
```

### Step 6: Configure Environment Variables

```bash
# Copy production environment template
cp .env.production.example .env

# Edit environment file
nano .env
```

**Critical Variables to Configure:**

```bash
# Database
DATABASE_URL="postgresql://vnc_admin:YOUR_PASSWORD@localhost:5432/vnc_blockchain"

# JWT Secret (Generate with: openssl rand -base64 64)
JWT_SECRET="your-generated-secret-here"

# Cashfree (Production)
CASHFREE_APP_ID="your-production-app-id"
CASHFREE_SECRET_KEY="your-production-secret-key"
CASHFREE_WEBHOOK_SECRET="your-webhook-secret"

# Frontend URL
FRONTEND_URL="https://yourdomain.com"

# Email SMTP
SMTP_HOST="smtp.gmail.com"
SMTP_USER="noreply@yourdomain.com"
SMTP_PASSWORD="your-app-password"

# Smart Contracts
PRESALE_CONTRACT_ADDRESS="0x..."
TOKEN_CONTRACT_ADDRESS="0x..."

# Super Admin
SUPER_ADMIN_EMAIL="admin@yourdomain.com"
SUPER_ADMIN_PASSWORD="secure-admin-password"
```

**⚠️ Important:** Change ALL default passwords and secrets!

---

## 🗄️ Database Initialization

### Step 7: Initialize Fresh Database

```bash
# Run database initialization script
bash scripts/init-fresh-database.sh
```

This script will:
1. ✅ Install backend dependencies
2. ✅ Generate Prisma client
3. ✅ Reset database (fresh start)
4. ✅ Run all migrations
5. ✅ Create super admin user
6. ✅ Initialize presale stages

**Confirmation Required:** You'll be asked to confirm database reset.

**Time:** ~5-10 minutes

**What Gets Created:**
- All database tables
- Super admin user account
- 3 presale stages (Stage 1 active by default)
- Indexes and constraints

---

## 🚀 Application Deployment

### Step 8: Deploy Application

```bash
# Run production deployment script
bash scripts/deploy-production.sh
```

This script will:
1. ✅ Install all dependencies (backend & frontend)
2. ✅ Build backend TypeScript
3. ✅ Build frontend Next.js
4. ✅ Configure PM2 processes
5. ✅ Setup Nginx reverse proxy
6. ✅ Start all services

**Time:** ~10-15 minutes

**What Gets Started:**
- Backend API on port 5000 (clustered)
- Frontend on port 3002 (clustered)
- PM2 process monitoring

### Step 9: Setup SSL Certificates

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificates
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com

# Follow the prompts
# Select option 2: Redirect HTTP to HTTPS
```

**Time:** ~5 minutes

---

## ✅ Post-Deployment Verification

### Step 10: Verify Deployment

```bash
# Run verification script
bash scripts/verify-deployment.sh
```

This script checks:
- ✅ Backend process running
- ✅ Frontend process running
- ✅ Health endpoint responding
- ✅ Database connectivity
- ✅ Redis connectivity
- ✅ Nginx status
- ✅ Disk space
- ✅ Memory usage
- ✅ Error logs

### Step 11: Manual Testing

#### Test Backend API:

```bash
# Health check
curl https://api.yourdomain.com/health

# Expected: {"status":"OK","timestamp":"..."}
```

#### Test Frontend:

```bash
# Visit in browser
https://yourdomain.com

# You should see the VNC Blockchain homepage
```

#### Test Authentication:

```bash
# Login with super admin
curl -X POST https://api.yourdomain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@yourdomain.com",
    "password": "your-admin-password"
  }'

# Should return JWT token
```

#### Test Admin Panel:

1. Visit `https://yourdomain.com/super-admin`
2. Login with super admin credentials
3. Verify dashboard loads
4. Check all admin features

---

## 🎯 Production Checklist

### Security Checklist

- [ ] All default passwords changed
- [ ] JWT secret is unique and secure (64+ characters)
- [ ] SSL certificates installed and auto-renewal configured
- [ ] Firewall configured (only necessary ports open)
- [ ] Database password is strong
- [ ] Redis password configured
- [ ] 2FA enabled for admin accounts
- [ ] CORS configured to only allow your domain
- [ ] Rate limiting enabled
- [ ] Security headers configured in Nginx

### Configuration Checklist

- [ ] Environment variables all set correctly
- [ ] Smart contract addresses configured
- [ ] Cashfree production credentials configured
- [ ] Email SMTP working (test with signup)
- [ ] Domain DNS properly configured
- [ ] SSL certificates valid and trusted
- [ ] Nginx reverse proxy working
- [ ] PM2 startup configured (survives reboot)

### Testing Checklist

- [ ] User registration works
- [ ] User login works
- [ ] Email notifications sent
- [ ] Payment integration works (test with small amount)
- [ ] Token purchase flow works end-to-end
- [ ] Admin dashboard accessible
- [ ] All API endpoints responding
- [ ] Frontend pages load correctly
- [ ] Mobile responsive design works

### Monitoring Checklist

- [ ] PM2 monitoring active (`pm2 monit`)
- [ ] Error logs being written
- [ ] Application logs accessible
- [ ] Database backups scheduled
- [ ] Server monitoring setup (optional: Uptime Robot, Pingdom)
- [ ] Error tracking configured (optional: Sentry)

---

## 📊 Useful Commands

### PM2 Process Management

```bash
# View status
pm2 status

# View logs
pm2 logs

# View logs for specific app
pm2 logs vnc-backend
pm2 logs vnc-frontend

# Restart all
pm2 restart all

# Restart specific app
pm2 restart vnc-backend

# Stop all
pm2 stop all

# Monitor resources
pm2 monit

# Save PM2 configuration
pm2 save
```

### Nginx Commands

```bash
# Test configuration
sudo nginx -t

# Reload configuration
sudo systemctl reload nginx

# Restart Nginx
sudo systemctl restart nginx

# View error logs
sudo tail -f /var/log/nginx/error.log
```

### Database Management

```bash
# Connect to database
psql -U vnc_admin -d vnc_blockchain

# View Prisma Studio (in development)
cd backend/api-server
npx prisma studio
# Opens at http://localhost:5555
```

### Application Updates

```bash
# Pull latest code
git pull origin main

# Rebuild and restart
cd backend/api-server
npm run build
cd ../..
pm2 restart vnc-backend

# Or use the deployment script
bash scripts/deploy-production.sh
```

---

## 🆘 Troubleshooting

### Backend Won't Start

```bash
# Check logs
pm2 logs vnc-backend --lines 100

# Common issues:
# 1. Database connection failed - Check DATABASE_URL
# 2. Port already in use - Check if another process is using port 5000
# 3. Missing environment variables - Check .env file

# Restart backend
pm2 restart vnc-backend
```

### Frontend Won't Start

```bash
# Check logs
pm2 logs vnc-frontend --lines 100

# Common issues:
# 1. Build failed - Run npm run build manually
# 2. Port already in use - Check port 3002
# 3. API URL incorrect - Check NEXT_PUBLIC_API_URL

# Restart frontend
pm2 restart vnc-frontend
```

### Database Connection Issues

```bash
# Test database connectivity
psql -U vnc_admin -d vnc_blockchain -c "SELECT 1;"

# Check PostgreSQL status
sudo systemctl status postgresql

# Restart PostgreSQL
sudo systemctl restart postgresql

# View PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-15-main.log
```

### SSL Certificate Issues

```bash
# Check certificate status
sudo certbot certificates

# Renew certificates manually
sudo certbot renew

# Test renewal process
sudo certbot renew --dry-run
```

### High Memory Usage

```bash
# Check memory
free -h

# Check what's using memory
pm2 list

# Restart apps to free memory
pm2 restart all

# Increase PM2 instance limits if needed
# Edit ecosystem.config.js
```

### Payment Webhook Not Working

```bash
# Check Nginx logs for incoming webhooks
sudo tail -f /var/log/nginx/access.log | grep webhook

# Test webhook locally
curl -X POST http://localhost:5000/api/webhooks/cashfree \
  -H "Content-Type: application/json" \
  -d '{"order_id":"test","order_status":"PAID"}'

# Verify Cashfree webhook URL is set correctly
# URL should be: https://api.yourdomain.com/api/webhooks/cashfree
```

---

## 🔄 Maintenance

### Daily Tasks

- Check PM2 status: `pm2 status`
- Review error logs: `pm2 logs --lines 50`
- Monitor disk space: `df -h`
- Check memory usage: `free -h`

### Weekly Tasks

- Review application logs for errors
- Check database size: `\l+` in psql
- Verify backups are working
- Update dependencies if needed
- Check SSL certificate validity

### Monthly Tasks

- Security updates: `sudo apt update && sudo apt upgrade`
- Review user feedback
- Analyze performance metrics
- Plan feature updates
- Database optimization

---

## 📞 Support & Resources

### Documentation
- [Complete API Documentation](./BACKEND_API_COMPLETE.md)
- [AWS Deployment Guide](./AWS_DEPLOYMENT_GUIDE.md)
- [Admin Control Documentation](./ADMIN_CONTROL_DOCUMENTATION.md)

### Quick References
- [Production Readiness Checklist](./PRODUCTION_READINESS_CHECKLIST.md)
- [Authentication Audit Report](./AUTHENTICATION_AUDIT_REPORT.md)
- [Cashfree Integration Guide](./CASHFREE_PRODUCTION_SETUP.md)

### Commands Cheat Sheet

```bash
# Start everything
pm2 start ecosystem.config.js

# Stop everything
pm2 stop all

# View logs
pm2 logs

# Monitor
pm2 monit

# Restart
pm2 restart all

# Check health
curl http://localhost:5000/health

# View database
psql -U vnc_admin vnc_blockchain
```

---

## 🎉 Deployment Complete!

Your VNC Blockchain application is now live in production!

**Application URLs:**
- **Frontend:** https://yourdomain.com
- **Admin Panel:** https://yourdomain.com/super-admin
- **API:** https://api.yourdomain.com
- **Health Check:** https://api.yourdomain.com/health

**Super Admin Login:**
- Email: (as configured in .env)
- Password: (as configured in .env)

### Next Steps:
1. ✅ Login to admin panel
2. ✅ Review all settings
3. ✅ Test payment integration
4. ✅ Announce launch to users
5. ✅ Monitor for 24 hours closely

**🚀 Good luck with your launch!**

---

**Need Help?**

Check the troubleshooting section or review the application logs:
```bash
pm2 logs
```

For persistent issues, check:
- Nginx logs: `/var/log/nginx/error.log`
- PostgreSQL logs: `/var/log/postgresql/`
- Application logs: `pm2 logs`
