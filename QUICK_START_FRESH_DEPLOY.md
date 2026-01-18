# 🚀 Quick Start: Fresh Deployment Guide

## The Problem
You need to deploy VNC Blockchain to a server where **all data must start fresh from 0**:
- Presale should show 0 tokens sold, 0 raised, 0 participants
- All user balances should be 0
- Blockchain should start from genesis block
- No historical data should exist

## The Solution
We've implemented a complete automated solution! 🎉

## 🏃 Fastest Way (3 Steps)

```bash
# 1. Clone the repository
git clone <your-repository-url>
cd VNCBlockchain

# 2. Run the initialization script (does everything!)
bash ./scripts/init-server.sh

# 3. Verify everything is at 0
npm run verify:fresh
```

**That's it!** Everything will be at 0. 🎯

## 📋 What the Init Script Does

When you run `bash ./scripts/init-server.sh`, it automatically:

1. ✅ Stops any running services
2. ✅ Deletes all blockchain data directories
3. ✅ Resets the PostgreSQL database
4. ✅ Seeds fresh data (presale at 0, admin user with 0 balances)
5. ✅ Clears Redis cache
6. ✅ Clears MongoDB analytics
7. ✅ Installs all dependencies
8. ✅ Starts all services

## 📊 What You Get After Initialization

### Presale (Stage 1)
```
tokens_sold: 0
total_raised: 0  
participants: 0
tokens_available: 2,000,000,000
price: ₹0.50 per token
```

### Admin User
```
email: admin@vncblockchain.com
password: Admin@123456 (⚠️ CHANGE THIS!)
all balances: 0
role: SUPER_ADMIN
```

### Blockchain
```
blocks: 0 (genesis block)
transactions: 0
state: Fresh
```

## 🔄 Other Useful Commands

### Reset Everything Anytime
```bash
npm run reset:all          # Linux/Mac
npm run reset:all:windows  # Windows
```

### Reset Only Database
```bash
cd backend/api-server
npm run db:reset
npm run seed
```

### Reset Only Blockchain
```bash
cd blockchain
go run scripts/reset-data.go
```

### Verify Fresh State
```bash
npm run verify:fresh
```

## 🐳 Docker Options

### Standard (with persistent data between restarts)
```bash
docker-compose up -d
```

### Always Fresh (no persistent data)
```bash
docker-compose -f docker-compose.fresh.yml up -d
```

## ⚠️ Important Security Notes

1. **Change the admin password immediately!**
   - Default: `Admin@123456`
   - This is public, change it!

2. **Update JWT secret in .env**
   - Don't use the example value in production

3. **Never run reset on production with real users**
   - Only use for initial deployment

## 📚 Need More Details?

We have comprehensive documentation:

- **Quick Reference**: [RESET_QUICK_REFERENCE.md](./RESET_QUICK_REFERENCE.md) - All commands in one page
- **Full Guide**: [DATA_RESET_GUIDE.md](./DATA_RESET_GUIDE.md) - Complete instructions
- **Deployment Checklist**: [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) - Step-by-step with checkboxes
- **Technical Summary**: [FRESH_DEPLOYMENT_SUMMARY.md](./FRESH_DEPLOYMENT_SUMMARY.md) - Implementation details

## 🆘 Troubleshooting

### Script fails?
```bash
# Check permissions
chmod +x scripts/*.sh

# Try manual steps from DATA_RESET_GUIDE.md
```

### Services won't start?
```bash
docker-compose down -v
docker-compose up -d
docker-compose logs
```

### Database issues?
```bash
cd backend/api-server
npx prisma db push --force-reset
npx prisma generate
npm run seed
```

## ✅ Verification Checklist

After deployment, verify:
- [ ] `npm run verify:fresh` passes
- [ ] API responds: `curl http://localhost:5000/health`
- [ ] Database shows presale with 0 values
- [ ] Only 1 user exists (admin)
- [ ] All balances are 0
- [ ] No blockchain-data directory exists

## 🎉 You're Done!

Your VNC Blockchain is now deployed with all data starting fresh from 0!

**Questions?** Check the documentation files or the main [README.md](./README.md).

---

**Remember**: This implementation ensures that every time you deploy to a new server, all data automatically starts from 0. No manual cleanup needed! 🚀
