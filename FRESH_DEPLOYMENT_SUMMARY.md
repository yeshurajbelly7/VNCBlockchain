# VNC Blockchain - Fresh Deployment Summary

## 🎯 Objective

When deploying VNC Blockchain to a server, **all data starts fresh from 0**:
- ✅ Presale: tokens_sold = 0, total_raised = 0, participants = 0
- ✅ All user balances = 0
- ✅ Blockchain starts from genesis block (block 0)
- ✅ No historical data

## 📦 What Was Implemented

### 1. Database Reset & Initialization
- **Seed Script**: `backend/api-server/prisma/seed.ts`
  - Clears all existing data
  - Creates initial presale stage with all values at 0
  - Creates default admin user with all balances at 0
  - Run with: `npm run seed` (in backend/api-server)

### 2. Blockchain Data Reset
- **Go Script**: `blockchain/scripts/reset-data.go`
  - Removes blockchain-data, chain-data, and other data directories
  - Ensures fresh blockchain start from block 0
  - Run with: `go run scripts/reset-data.go` (in blockchain/)

### 3. Complete Reset Scripts
- **Linux/Mac**: `scripts/reset-all-data.sh`
  - Stops services
  - Resets blockchain data
  - Resets database
  - Clears cache (Redis, MongoDB)
  - Run with: `npm run reset:all`

- **Windows**: `scripts/reset-all-data.ps1`
  - Same functionality as Linux/Mac version
  - Run with: `npm run reset:all:windows`

### 4. Server Initialization
- **Init Script**: `scripts/init-server.sh`
  - Complete setup for fresh deployment
  - Resets all data
  - Installs dependencies
  - Sets up database
  - Seeds initial data
  - Starts services
  - Run once on new server deployment

### 5. Verification
- **Verify Script**: `scripts/verify-fresh-state.sh`
  - Checks if everything is in fresh state
  - Verifies services are running
  - Checks for old data
  - Validates environment configuration
  - Run with: `npm run verify:fresh`

### 6. Docker Configuration
- **Fresh Docker Compose**: `docker-compose.fresh.yml`
  - No persistent volumes
  - Data resets on container restart
  - Use for environments where you want ephemeral data

### 7. Documentation
- **Comprehensive Guide**: `DATA_RESET_GUIDE.md`
  - Detailed instructions for all reset scenarios
  - Troubleshooting section
  - Production deployment guide

- **Quick Reference**: `RESET_QUICK_REFERENCE.md`
  - One-page cheat sheet
  - Common commands
  - Quick deployment steps

- **Deployment Checklist**: `DEPLOYMENT_CHECKLIST.md`
  - Step-by-step deployment guide
  - Verification checklist
  - Post-deployment actions

- **Updated README**: Main README now includes:
  - Fresh server deployment section
  - Reset instructions
  - Links to all documentation

## 🚀 Usage

### Quick Start (Recommended)
```bash
# Clone and deploy with fresh data (all at 0)
git clone <repository-url>
cd VNCBlockchain
bash ./scripts/init-server.sh
npm run verify:fresh
```

### Manual Reset
```bash
# Reset everything
npm run reset:all

# Or individually:
# Database only
cd backend/api-server && npm run db:reset && npm run seed

# Blockchain only  
cd blockchain && go run scripts/reset-data.go
```

### Docker Deployment
```bash
# With persistent data
docker-compose up -d

# Without persistent data (always fresh)
docker-compose -f docker-compose.fresh.yml up -d
```

## ✅ Verification

After deployment, verify fresh state:

1. **Run verification script**:
   ```bash
   npm run verify:fresh
   ```

2. **Check database manually**:
   ```bash
   cd backend/api-server
   npx prisma studio
   ```
   Verify:
   - Presale tokens_sold = 0
   - Presale total_raised = 0
   - Presale participants = 0
   - Only 1 user (admin) exists
   - All balances = 0

3. **Check blockchain**:
   ```bash
   ls -la blockchain/
   # Should NOT see blockchain-data or chain-data directories
   ```

4. **Test API**:
   ```bash
   curl http://localhost:5000/health
   curl http://localhost:5000/api/presale
   ```

## 📊 Initial State After Reset

### Presale Configuration
```json
{
  "stage": 1,
  "price_inr": 0.50,
  "price_usd": 0.006,
  "tokens_sold": 0,
  "tokens_available": 2000000000,
  "total_raised": 0,
  "participants": 0
}
```

### Default Admin User
```json
{
  "email": "admin@vncblockchain.com",
  "role": "SUPER_ADMIN",
  "inr_balance": 0,
  "vnc_balance": 0,
  "eth_balance": 0,
  "usdt_balance": 0,
  "total_invested": 0,
  "tokens_owned": 0
}
```

### Blockchain State
- **Genesis Block**: Block 0
- **Total Blocks**: 0
- **Total Transactions**: 0
- **Active Validators**: 0

## 🔒 Security Notes

1. **Change Default Admin Password**: The default password is `Admin@123456`. Change it immediately after deployment!

2. **JWT Secret**: Use a strong, random JWT secret in production. Don't use the example value.

3. **Environment Variables**: Never commit `.env` files. Always use `.env.example` as template.

4. **Database Access**: Ensure PostgreSQL is not publicly accessible.

5. **API Keys**: Use production API keys for Cashfree, email services, etc.

## 📁 File Structure

```
VNCBlockchain/
├── scripts/
│   ├── reset-all-data.sh          # Complete reset (Linux/Mac)
│   ├── reset-all-data.ps1         # Complete reset (Windows)
│   ├── init-server.sh             # Server initialization
│   └── verify-fresh-state.sh      # Verification script
├── blockchain/
│   └── scripts/
│       └── reset-data.go          # Blockchain data cleanup
├── backend/
│   └── api-server/
│       ├── prisma/
│       │   └── seed.ts            # Database seed script
│       └── package.json           # Added seed commands
├── docker-compose.yml             # Standard Docker config
├── docker-compose.fresh.yml       # Fresh Docker config (no volumes)
├── DATA_RESET_GUIDE.md           # Comprehensive guide
├── RESET_QUICK_REFERENCE.md      # Quick reference
├── DEPLOYMENT_CHECKLIST.md       # Deployment checklist
└── README.md                      # Updated with deployment info
```

## 🎓 Best Practices

1. **Always reset on fresh deployment**: Ensures consistent starting state
2. **Never reset production with users**: Only reset on initial deployment
3. **Backup before reset**: If you have data you need to keep
4. **Verify after reset**: Always run verification script
5. **Change defaults**: Admin password, JWT secret, API keys
6. **Test thoroughly**: Before going live with real users

## 🆘 Troubleshooting

### Reset script fails
```bash
# Check permissions
chmod +x scripts/*.sh

# Run manually
cd blockchain && go run scripts/reset-data.go
cd backend/api-server && npm run db:reset && npm run seed
```

### Database won't reset
```bash
cd backend/api-server
npx prisma db push --force-reset
npx prisma generate
npm run seed
```

### Services won't start
```bash
# Check Docker
docker-compose down -v
docker-compose up -d
docker-compose logs

# Check if ports are in use
lsof -i :5000  # API
lsof -i :5432  # PostgreSQL
lsof -i :8545  # RPC
```

## 📞 Support Resources

- **Full Guide**: [DATA_RESET_GUIDE.md](./DATA_RESET_GUIDE.md)
- **Quick Reference**: [RESET_QUICK_REFERENCE.md](./RESET_QUICK_REFERENCE.md)
- **Deployment Checklist**: [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
- **Main Documentation**: [README.md](./README.md)

## ✨ Summary

With these implementations, deploying VNC Blockchain with fresh data (all starting from 0) is as simple as:

```bash
git clone <repo> && cd VNCBlockchain && bash ./scripts/init-server.sh
```

All data - presale stats, user balances, blockchain state - will start from 0, exactly as required.
