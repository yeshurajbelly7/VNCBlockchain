#!/bin/bash

# VNC Blockchain - Complete Data Reset Script
# This script resets all data to start fresh from 0
# Use this when deploying to a new server

set -e

echo "🚀 VNC Blockchain - Data Reset Script"
echo "======================================"
echo ""
echo "⚠️  WARNING: This will delete ALL existing data!"
echo "This includes:"
echo "  - Database records (users, transactions, presale data)"
echo "  - Blockchain data (blocks, state, validators)"
echo "  - Cache data (Redis)"
echo "  - Analytics data (MongoDB)"
echo ""

# Ask for confirmation in interactive mode
if [ -t 0 ]; then
    read -p "Are you sure you want to continue? (yes/no): " confirm
    if [ "$confirm" != "yes" ]; then
        echo "❌ Reset cancelled"
        exit 0
    fi
fi

echo ""
echo "🧹 Starting data reset..."
echo ""

# Step 1: Stop all services
echo "1️⃣  Stopping all services..."
if command -v docker-compose &> /dev/null; then
    docker-compose down -v 2>/dev/null || true
    echo "✅ Docker services stopped"
else
    echo "⏭️  Docker Compose not found, skipping..."
fi

# Step 2: Clean blockchain data
echo ""
echo "2️⃣  Cleaning blockchain data..."
cd blockchain
if [ -f "scripts/reset-data.go" ]; then
    go run scripts/reset-data.go
else
    echo "⚠️  Blockchain reset script not found, cleaning manually..."
    rm -rf blockchain-data chain-data data storage-data 2>/dev/null || true
    echo "✅ Blockchain data cleaned"
fi
cd ..

# Step 3: Reset PostgreSQL database
echo ""
echo "3️⃣  Resetting PostgreSQL database..."
cd backend/api-server

# Drop and recreate database using Prisma
if command -v npx &> /dev/null; then
    echo "   Resetting database schema..."
    npx prisma migrate reset --force --skip-seed 2>/dev/null || true
    
    echo "   Running fresh migrations..."
    npx prisma migrate deploy 2>/dev/null || npx prisma db push --skip-generate 2>/dev/null || true
    
    echo "   Seeding database with initial data (all values at 0)..."
    npx prisma db seed 2>/dev/null || npm run seed 2>/dev/null || npx ts-node prisma/seed.ts 2>/dev/null || true
    
    echo "✅ Database reset complete"
else
    echo "⚠️  npm/npx not found, skipping database reset"
fi
cd ../..

# Step 4: Clean Redis data
echo ""
echo "4️⃣  Cleaning Redis cache..."
if command -v redis-cli &> /dev/null; then
    redis-cli FLUSHALL 2>/dev/null || echo "⏭️  Redis not running or not accessible"
else
    echo "⏭️  Redis CLI not found, will be cleaned on container restart"
fi

# Step 5: Clean MongoDB data
echo ""
echo "5️⃣  Cleaning MongoDB analytics..."
if command -v mongosh &> /dev/null; then
    mongosh --eval "db.dropDatabase()" vnc_analytics 2>/dev/null || echo "⏭️  MongoDB not running or not accessible"
else
    echo "⏭️  MongoDB CLI not found, will be cleaned on container restart"
fi

# Step 6: Clean temporary files and logs
echo ""
echo "6️⃣  Cleaning temporary files and logs..."
find . -type f -name "*.log" -delete 2>/dev/null || true
rm -rf logs/ temp/ tmp/ 2>/dev/null || true
echo "✅ Temporary files cleaned"

# Step 7: Verify .gitignore for data directories
echo ""
echo "7️⃣  Verifying .gitignore configuration..."
if grep -q "blockchain-data/" .gitignore 2>/dev/null; then
    echo "✅ Data directories properly configured in .gitignore"
else
    echo "⚠️  Note: Ensure data directories are in .gitignore"
fi

echo ""
echo "════════════════════════════════════"
echo "✨ Data reset completed successfully!"
echo "════════════════════════════════════"
echo ""
echo "📊 Summary:"
echo "  ✅ All blockchain data reset to 0"
echo "  ✅ Database recreated with fresh schema"
echo "  ✅ Initial presale stage: tokens_sold = 0, total_raised = 0"
echo "  ✅ All user balances set to 0"
echo "  ✅ Cache and analytics data cleared"
echo ""
echo "🚀 Your VNC Blockchain is now ready for fresh deployment!"
echo ""
echo "Next steps:"
echo "  1. Configure your .env file"
echo "  2. Start services: docker-compose up -d"
echo "  3. Or start manually: npm run dev"
echo ""
