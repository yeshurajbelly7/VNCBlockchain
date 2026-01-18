# VNC Blockchain - Deployment Checklist

Use this checklist when deploying VNC Blockchain to a new server to ensure all data starts fresh from 0.

## 📋 Pre-Deployment Checklist

- [ ] Server meets minimum requirements (Node.js 18+, Go 1.21+, PostgreSQL 15+)
- [ ] Domain/IP address configured
- [ ] SSL certificate ready (for production)
- [ ] Environment variables prepared
- [ ] Database credentials ready
- [ ] Backup plan in place (if needed)

## 🚀 Deployment Steps

### Step 1: Clone Repository
```bash
git clone <repository-url>
cd VNCBlockchain
```
- [ ] Repository cloned successfully

### Step 2: Configure Environment
```bash
cp .env.example .env
# Edit .env with production values
```
- [ ] `.env` file created
- [ ] `DATABASE_URL` configured
- [ ] `JWT_SECRET` set (use strong random string)
- [ ] `ADMIN_EMAIL` configured
- [ ] `ADMIN_PASSWORD` set (change from default!)
- [ ] API keys configured (Cashfree, email, etc.)

### Step 3: Run Initialization Script
```bash
bash ./scripts/init-server.sh
```
- [ ] Script completed without errors
- [ ] Database initialized
- [ ] Initial data seeded
- [ ] Services started

### Step 4: Verify Fresh State
```bash
# Check database
cd backend/api-server
npx prisma studio
```
Verify:
- [ ] Presale stage 1 exists
- [ ] tokens_sold = 0
- [ ] total_raised = 0
- [ ] participants = 0
- [ ] Only default admin user exists
- [ ] All balances = 0

```bash
# Check blockchain
ls -la blockchain/
```
- [ ] No blockchain-data directory exists (fresh start)
- [ ] No chain-data directory exists

### Step 5: Access Control
```bash
# Change default admin password immediately!
```
- [ ] Admin password changed from default
- [ ] 2FA enabled for admin (recommended)
- [ ] Admin email verified

### Step 6: API Health Check
```bash
curl http://localhost:5000/health
```
- [ ] API responds with status OK
- [ ] Database connection successful

### Step 7: Configure Production Settings

Update `.env` for production:
- [ ] `NODE_ENV=production`
- [ ] `DEBUG=false`
- [ ] Rate limiting configured
- [ ] CORS origins set correctly
- [ ] Email service configured
- [ ] Error monitoring configured (Sentry, etc.)

### Step 8: Start Production Services
```bash
docker-compose up -d
# Or use docker-compose.fresh.yml for no persistent volumes
```
- [ ] All containers started
- [ ] No errors in logs: `docker-compose logs`

### Step 9: Security Checks
- [ ] Firewall configured (allow only necessary ports)
- [ ] SSL/TLS enabled
- [ ] Database not publicly accessible
- [ ] Environment variables not exposed
- [ ] Rate limiting working
- [ ] CORS properly configured

### Step 10: Final Verification

Test critical endpoints:
- [ ] `/health` - Returns OK
- [ ] `/api/auth/login` - Admin login works
- [ ] `/api/presale` - Returns stage 1 with 0 values
- [ ] Database queries working
- [ ] Blockchain RPC responding (port 8545)

## ✅ Post-Deployment Checklist

### Immediate Actions
- [ ] Document admin credentials (securely!)
- [ ] Set up monitoring/alerts
- [ ] Configure backup schedule
- [ ] Test critical user flows
- [ ] Verify all services running

### Within 24 Hours
- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Verify data integrity
- [ ] Test presale functionality
- [ ] Test user registration and KYC

### Within 1 Week
- [ ] Review security logs
- [ ] Optimize performance if needed
- [ ] Update documentation
- [ ] Create runbooks for common issues
- [ ] Set up automated backups

## 🔄 Data Reset Verification

After deployment, verify everything starts from 0:

| Item | Expected Value | Verified |
|------|----------------|----------|
| Presale tokens_sold | 0 | [ ] |
| Presale total_raised | 0 | [ ] |
| Presale participants | 0 | [ ] |
| Blockchain block height | 0 (genesis) | [ ] |
| Total users | 1 (admin only) | [ ] |
| Total transactions | 0 | [ ] |
| Total deposits | 0 | [ ] |
| Total withdrawals | 0 | [ ] |
| Admin VNC balance | 0 | [ ] |
| Admin INR balance | 0 | [ ] |
| Admin ETH balance | 0 | [ ] |
| Admin USDT balance | 0 | [ ] |

## 📞 Support

If any step fails:

1. Check logs: `docker-compose logs [service-name]`
2. Review [DATA_RESET_GUIDE.md](./DATA_RESET_GUIDE.md)
3. Check [RESET_QUICK_REFERENCE.md](./RESET_QUICK_REFERENCE.md)
4. Consult documentation in `/docs`
5. Contact: admin@vncblockchain.com

## 🎉 Deployment Complete!

Once all items are checked:

✅ Your VNC Blockchain is deployed and running with fresh data (all starting from 0)
✅ All services are healthy
✅ Security measures in place
✅ Monitoring active

**Remember**: Never run reset scripts on a production system with real users!
