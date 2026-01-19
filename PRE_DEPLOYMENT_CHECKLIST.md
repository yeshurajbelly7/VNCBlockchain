# 📋 VNC Blockchain - Pre-Deployment Checklist

## Complete Checklist for Fresh Server Deployment

**Purpose:** Ensure all requirements are met before deploying to production server  
**Last Updated:** January 17, 2026

---

## ✅ Phase 1: Pre-Deployment Requirements

### Server Infrastructure
- [ ] Server provisioned (Ubuntu 20.04/22.04 LTS)
- [ ] Minimum 4GB RAM, 2 CPU cores, 50GB storage
- [ ] Public IP address assigned
- [ ] SSH access configured
- [ ] Root/sudo access available

### Domain & DNS
- [ ] Domain name purchased
- [ ] DNS A record: `yourdomain.com` → Server IP
- [ ] DNS A record: `www.yourdomain.com` → Server IP
- [ ] DNS A record: `api.yourdomain.com` → Server IP
- [ ] DNS propagation verified (can take 24-48 hours)

### Smart Contracts (DEPLOY FIRST!)
- [ ] VNC Token contract deployed to mainnet
- [ ] Presale contract deployed to mainnet
- [ ] Staking contract deployed (if applicable)
- [ ] Contract addresses saved
- [ ] Contracts verified on block explorer
- [ ] Contract owner private key secured

### Payment Gateway (Cashfree)
- [ ] Cashfree production account created
- [ ] KYC documents submitted and approved
- [ ] Production App ID obtained
- [ ] Production Secret Key obtained
- [ ] Webhook secret configured
- [ ] Test transactions completed successfully

### Email Service
- [ ] SMTP service configured (Gmail, SendGrid, etc.)
- [ ] App-specific password generated (for Gmail)
- [ ] Sender email verified
- [ ] Test email sent successfully
- [ ] SPF/DKIM records configured (optional but recommended)

### API Keys & Services
- [ ] WalletConnect Project ID (optional)
- [ ] Infura/Alchemy API key (if using external RPC)
- [ ] Etherscan API key (for contract verification)
- [ ] Sentry DSN (for error tracking - optional)

### Security Credentials
- [ ] Strong database password generated (16+ characters)
- [ ] Strong Redis password generated
- [ ] JWT secret generated (64+ characters): `openssl rand -base64 64`
- [ ] Session secret generated
- [ ] Super admin password created (strong)
- [ ] All passwords stored in password manager

---

## ✅ Phase 2: Server Setup

### System Configuration
- [ ] System packages updated: `apt update && apt upgrade`
- [ ] Node.js 20.x installed
- [ ] PostgreSQL 15 installed
- [ ] Redis server installed
- [ ] Nginx installed
- [ ] PM2 installed globally
- [ ] Git installed
- [ ] Build tools installed (gcc, make)

### Database Setup
- [ ] PostgreSQL database created: `vnc_blockchain`
- [ ] Database user created: `vnc_admin`
- [ ] User permissions granted
- [ ] Database connection tested
- [ ] PostgreSQL configured for remote access (if needed)

### Redis Setup
- [ ] Redis password configured
- [ ] Redis bind address set (127.0.0.1 for local only)
- [ ] Redis service started and enabled
- [ ] Redis connection tested

### Firewall Configuration
- [ ] UFW enabled
- [ ] Port 22 (SSH) allowed
- [ ] Port 80 (HTTP) allowed
- [ ] Port 443 (HTTPS) allowed
- [ ] Port 5000 (Backend API) allowed (or blocked if behind Nginx)
- [ ] All other ports blocked

### Application User
- [ ] Application user created: `vncapp`
- [ ] Home directory created
- [ ] SSH keys configured (if needed)
- [ ] Sudo privileges granted (if needed)

---

## ✅ Phase 3: Code Deployment

### Repository Setup
- [ ] Repository cloned to server
- [ ] Correct branch checked out (main/production)
- [ ] Latest code pulled
- [ ] File permissions set correctly

### Environment Configuration
- [ ] `.env` file created from `.env.production.example`
- [ ] `NODE_ENV=production` set
- [ ] `DATABASE_URL` configured correctly
- [ ] `JWT_SECRET` set (unique, 64+ chars)
- [ ] `REDIS_HOST` and `REDIS_PASSWORD` set
- [ ] Cashfree credentials configured
- [ ] Email SMTP credentials set
- [ ] Smart contract addresses added
- [ ] Frontend URL configured
- [ ] CORS_ORIGIN set to production domain
- [ ] Super admin credentials set
- [ ] All required environment variables filled

### Backend Configuration
- [ ] Backend dependencies installed
- [ ] Prisma client generated
- [ ] Database migrations created
- [ ] TypeScript compiled successfully
- [ ] No build errors

### Frontend Configuration
- [ ] Frontend dependencies installed
- [ ] Environment variables set
- [ ] Next.js build completed successfully
- [ ] No build errors
- [ ] Static files generated

---

## ✅ Phase 4: Database Initialization

### Database Schema
- [ ] Database reset completed (fresh start)
- [ ] All migrations applied
- [ ] All tables created
- [ ] Indexes created
- [ ] Constraints applied

### Initial Data
- [ ] Super admin user created
- [ ] Presale stages initialized
- [ ] Default settings configured
- [ ] Test data removed (if any)

### Database Verification
- [ ] Can connect to database
- [ ] All tables exist
- [ ] Super admin can login
- [ ] No migration errors

---

## ✅ Phase 5: Application Deployment

### Backend Deployment
- [ ] Backend built successfully
- [ ] PM2 ecosystem file configured
- [ ] Backend process started
- [ ] Backend running on port 5000
- [ ] Health endpoint responding
- [ ] No startup errors in logs

### Frontend Deployment
- [ ] Frontend built successfully
- [ ] Frontend process started via PM2
- [ ] Frontend running on port 3002
- [ ] Homepage loads correctly
- [ ] No startup errors in logs

### Process Management
- [ ] PM2 processes configured
- [ ] PM2 startup script enabled
- [ ] PM2 configuration saved
- [ ] Processes survive reboot (test with `pm2 resurrect`)

### Nginx Configuration
- [ ] Nginx reverse proxy configured
- [ ] Frontend proxy working
- [ ] Backend API proxy working
- [ ] Security headers configured
- [ ] Nginx configuration tested: `nginx -t`
- [ ] Nginx reloaded

---

## ✅ Phase 6: SSL & Security

### SSL Certificates
- [ ] Certbot installed
- [ ] SSL certificates obtained
- [ ] Certificates for all domains (main, www, api)
- [ ] HTTP to HTTPS redirect configured
- [ ] Auto-renewal configured
- [ ] Certificates valid and trusted

### Security Configuration
- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] CORS restricted to production domain
- [ ] Rate limiting enabled
- [ ] SQL injection protection (Prisma ORM)
- [ ] XSS protection enabled (Helmet)
- [ ] CSRF protection configured
- [ ] Input validation on all endpoints

### Secrets Management
- [ ] All secrets stored securely
- [ ] `.env` file not committed to Git
- [ ] File permissions set (600 for .env)
- [ ] No hardcoded secrets in code
- [ ] Private keys secured

---

## ✅ Phase 7: Testing & Verification

### Backend Testing
- [ ] Health endpoint: `GET /health` returns 200
- [ ] User registration works
- [ ] User login works
- [ ] JWT authentication works
- [ ] 2FA setup works
- [ ] Password reset works (if implemented)
- [ ] All API endpoints responding

### Frontend Testing
- [ ] Homepage loads
- [ ] All pages accessible
- [ ] User can register
- [ ] User can login
- [ ] Dashboard loads after login
- [ ] Presale purchase flow works
- [ ] Admin panel accessible
- [ ] No console errors

### Payment Integration
- [ ] Cashfree order creation works
- [ ] Payment page loads
- [ ] Test payment completed (small amount)
- [ ] Webhook received and processed
- [ ] Transaction recorded in database
- [ ] User balance updated
- [ ] Email notification sent

### Email Testing
- [ ] Welcome email sent on registration
- [ ] Password reset email works (if implemented)
- [ ] Transaction confirmation email works
- [ ] 2FA setup email works
- [ ] Email formatting correct
- [ ] No delivery failures

### Smart Contract Integration
- [ ] Can read contract data
- [ ] Can call contract functions
- [ ] Token balance updates
- [ ] Presale purchase records on-chain
- [ ] No contract interaction errors

---

## ✅ Phase 8: Monitoring & Maintenance

### Application Monitoring
- [ ] PM2 monitoring active
- [ ] Error logs accessible
- [ ] Application logs being written
- [ ] Log rotation configured
- [ ] PM2 web dashboard accessible (optional)

### Server Monitoring
- [ ] CPU usage normal (<80%)
- [ ] Memory usage normal (<80%)
- [ ] Disk space adequate (>20% free)
- [ ] Network connectivity stable
- [ ] Uptime monitoring configured (optional: UptimeRobot)

### Database Monitoring
- [ ] Database size checked
- [ ] Query performance acceptable
- [ ] Connection pool size appropriate
- [ ] No slow queries

### Backup Strategy
- [ ] Database backup script created
- [ ] Automated daily backups scheduled
- [ ] Backup retention policy set (30 days)
- [ ] Backup restoration tested
- [ ] Backups stored off-server (S3, etc.)

### Error Tracking
- [ ] Error logging configured
- [ ] Error notification setup (email/Slack/Discord)
- [ ] Sentry/error tracking configured (optional)
- [ ] Critical errors monitored

---

## ✅ Phase 9: Performance & Optimization

### Backend Performance
- [ ] Response times acceptable (<200ms for most endpoints)
- [ ] No memory leaks
- [ ] Connection pooling configured
- [ ] Redis caching working
- [ ] API rate limiting working

### Frontend Performance
- [ ] Page load times acceptable (<3s)
- [ ] Images optimized
- [ ] Static assets cached
- [ ] CDN configured (optional)
- [ ] Lazy loading implemented

### Database Performance
- [ ] Indexes created on frequently queried columns
- [ ] Query optimization done
- [ ] Database vacuumed (PostgreSQL)
- [ ] No N+1 query issues

---

## ✅ Phase 10: Final Checks Before Launch

### Pre-Launch Verification
- [ ] All features tested thoroughly
- [ ] No critical bugs
- [ ] All documentation updated
- [ ] Team trained on admin panel
- [ ] Support channels ready
- [ ] Marketing materials ready

### Launch Day Checklist
- [ ] Monitoring dashboards open
- [ ] Team on standby
- [ ] Customer support ready
- [ ] Social media posts scheduled
- [ ] Press release ready (if applicable)

### Post-Launch Monitoring (First 24 Hours)
- [ ] Monitor error logs every hour
- [ ] Check user registrations
- [ ] Verify payment processing
- [ ] Monitor server resources
- [ ] Respond to user feedback
- [ ] Fix critical issues immediately

---

## 🎯 Critical Success Criteria

Before going live, verify these are ALL working:

1. **User Registration & Login**
   - [ ] Users can register
   - [ ] Users receive welcome email
   - [ ] Users can login
   - [ ] JWT tokens work

2. **Payment Flow**
   - [ ] Users can initiate payment
   - [ ] Cashfree integration works
   - [ ] Webhooks processed correctly
   - [ ] Balances updated

3. **Admin Panel**
   - [ ] Admin can login
   - [ ] Can view all users
   - [ ] Can approve KYC
   - [ ] Can manage presale

4. **Security**
   - [ ] HTTPS enforced
   - [ ] No exposed secrets
   - [ ] Rate limiting active
   - [ ] Input validation working

5. **Performance**
   - [ ] Response times < 200ms
   - [ ] Page loads < 3s
   - [ ] No memory leaks
   - [ ] Database responsive

---

## 📞 Emergency Contacts

Keep these handy for launch day:

- **Server Provider:** _________________
- **Domain Registrar:** _________________
- **Cashfree Support:** _________________
- **Email Service Support:** _________________
- **Team Lead:** _________________

---

## 🚀 Deployment Commands Quick Reference

```bash
# Fresh server setup
sudo bash scripts/setup-fresh-server.sh

# Database initialization
bash scripts/init-fresh-database.sh

# Deploy application
bash scripts/deploy-production.sh

# Verify deployment
bash scripts/verify-deployment.sh

# View logs
pm2 logs

# Restart all
pm2 restart all
```

---

## ✅ Sign-off

**Deployed By:** _________________  
**Date:** _________________  
**Time:** _________________  
**Server IP:** _________________  
**Domain:** _________________

**I confirm that all items in this checklist have been completed and verified.**

**Signature:** _________________

---

**🎉 Ready for Launch!**

Once all items are checked, you're ready to launch VNC Blockchain in production!
