# VNC Blockchain - Data Reset Guide

## Overview

This guide explains how to reset all data in the VNC Blockchain system to start fresh from 0. This is essential when deploying to a new server or when you want to start with a clean state.

## What Gets Reset?

When you run the data reset scripts, the following data will be cleared and reset to 0:

### 1. Database (PostgreSQL)
- ✅ All users (except default admin)
- ✅ All transactions
- ✅ All deposits and withdrawals
- ✅ Presale data (tokens_sold = 0, total_raised = 0, participants = 0)
- ✅ All balances (INR, VNC, ETH, USDT set to 0)
- ✅ All referrals
- ✅ All airdrops
- ✅ All audit logs

### 2. Blockchain Data
- ✅ All blocks
- ✅ All blockchain transactions
- ✅ Account states
- ✅ Validator information
- ✅ Blockchain metadata

### 3. Cache & Analytics
- ✅ Redis cache data
- ✅ MongoDB analytics data

### 4. Temporary Files
- ✅ Log files
- ✅ Temporary directories

## Reset Methods

### Method 1: Automated Script (Recommended)

#### On Linux/Mac:
```bash
# From the project root directory
npm run reset:all

# Or directly:
bash ./scripts/reset-all-data.sh
```

#### On Windows:
```powershell
# From the project root directory
npm run reset:all:windows

# Or directly:
powershell -ExecutionPolicy Bypass -File ./scripts/reset-all-data.ps1
```

### Method 2: Manual Reset

If you prefer to reset components individually:

#### Reset Database Only:
```bash
cd backend/api-server

# Reset and recreate database
npx prisma migrate reset --force

# Or use the npm script
npm run db:reset

# Then seed with initial data
npm run seed
```

#### Reset Blockchain Data Only:
```bash
cd blockchain

# Run the Go reset script
go run scripts/reset-data.go

# Or manually delete directories
rm -rf blockchain-data chain-data data storage-data
```

#### Reset Docker Volumes:
```bash
# Stop all services and remove volumes
docker-compose down -v

# Start fresh
docker-compose up -d
```

## Post-Reset Setup

After resetting the data, follow these steps:

### 1. Configure Environment Variables
```bash
# Copy example environment file
cp .env.example .env

# Edit with your settings
nano .env
```

### 2. Start Services

#### With Docker:
```bash
docker-compose up -d
```

#### Without Docker:
```bash
# Start all development services
npm run dev

# Or start individual services
npm run dev:api
npm run dev:wallet
```

### 3. Verify Initial State

You can verify that everything is reset by checking:

**Database:**
```bash
cd backend/api-server
npx prisma studio
```

Check that:
- Presale stage 1 exists with tokens_sold = 0
- Total raised = 0
- Participants = 0
- Only default admin user exists (if seeded)

**Blockchain:**
```bash
# Check that no data directories exist
ls -la blockchain/
# Should not see blockchain-data, chain-data, etc.
```

## Initial Data After Reset

After running the reset and seed scripts, you'll have:

### Default Admin User
- **Email**: `admin@vncblockchain.com` (or from ADMIN_EMAIL env var)
- **Password**: `Admin@123456` (or from ADMIN_PASSWORD env var)
- **Role**: SUPER_ADMIN
- **All Balances**: 0

### Presale Configuration
- **Stage**: 1
- **Price INR**: ₹0.50 per token
- **Price USD**: $0.006 per token
- **Tokens Sold**: 0
- **Tokens Available**: 2,000,000,000 (2 billion)
- **Total Raised**: 0
- **Participants**: 0
- **Duration**: 90 days from seed time

## Production Deployment

When deploying to a production server:

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd VNCBlockchain
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with production values
   ```

4. **Reset all data to start fresh**
   ```bash
   npm run reset:all
   ```

5. **Start production services**
   ```bash
   docker-compose up -d
   # Or
   npm run start
   ```

## Important Notes

⚠️ **WARNING**: The reset scripts will delete ALL existing data. This action cannot be undone. Always backup important data before resetting.

✅ **Best Practices**:
- Always run reset scripts on a fresh deployment
- Never run reset scripts on a production system with real users
- Backup your `.env` file before resetting
- Verify the reset completed successfully before going live

## Troubleshooting

### Reset Script Fails

If the automated reset script fails, try:

1. **Check permissions**:
   ```bash
   chmod +x ./scripts/reset-all-data.sh
   ```

2. **Run steps manually**:
   - Stop services: `docker-compose down -v`
   - Delete data directories manually
   - Reset database: `cd backend/api-server && npm run db:reset`
   - Seed database: `npm run seed`

### Database Won't Reset

If Prisma migration fails:

```bash
cd backend/api-server

# Force push schema
npx prisma db push --force-reset

# Generate client
npx prisma generate

# Run seed
npm run seed
```

### Blockchain Data Won't Delete

If directories are locked or in use:

```bash
# Stop all processes
docker-compose down
pkill -f "go run"

# Force remove
sudo rm -rf blockchain/blockchain-data
sudo rm -rf blockchain/chain-data
```

## Support

For issues or questions:
- Check documentation: `/docs`
- Create an issue: GitHub Issues
- Contact: admin@vncblockchain.com
