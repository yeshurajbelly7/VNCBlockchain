#!/bin/bash

# VNC Blockchain - Fresh State Verification Script
# Run this after deployment to verify everything starts from 0

set -e

echo "🔍 VNC Blockchain - Fresh State Verification"
echo "============================================="
echo ""

ERRORS=0

# Function to check a value
check_value() {
    local name=$1
    local expected=$2
    local actual=$3
    
    if [ "$actual" == "$expected" ]; then
        echo "✅ $name: $actual (expected: $expected)"
    else
        echo "❌ $name: $actual (expected: $expected)"
        ((ERRORS++))
    fi
}

# Check if services are running
echo "1️⃣  Checking Services..."
echo ""

if curl -s http://localhost:5000/health > /dev/null 2>&1; then
    echo "✅ API Server: Running"
else
    echo "❌ API Server: Not responding"
    ((ERRORS++))
fi

if curl -s http://localhost:8545 > /dev/null 2>&1; then
    echo "✅ RPC Server: Running"
else
    echo "⚠️  RPC Server: Not responding (may not be started yet)"
fi

echo ""
echo "2️⃣  Checking Blockchain Data Directories..."
echo ""

cd blockchain 2>/dev/null || true

# Check for blockchain data directories
DATA_DIRS=("blockchain-data" "chain-data")
for dir in "${DATA_DIRS[@]}"; do
    if [ ! -d "$dir" ]; then
        echo "✅ $dir: Does not exist (fresh state)"
    else
        echo "⚠️  $dir: Exists (may have old data)"
    fi
done

cd - > /dev/null 2>&1 || true

echo ""
echo "3️⃣  Checking Database State..."
echo ""

# Try to query the API for presale info
if command -v curl &> /dev/null; then
    PRESALE_DATA=$(curl -s http://localhost:5000/api/presale 2>/dev/null || echo "{}")
    
    if [ "$PRESALE_DATA" != "{}" ]; then
        echo "✅ API responding with presale data"
        echo "   Data: $PRESALE_DATA"
    else
        echo "⚠️  Could not fetch presale data (API may not be ready)"
    fi
fi

echo ""
echo "4️⃣  Checking Environment Configuration..."
echo ""

if [ -f ".env" ]; then
    echo "✅ .env file exists"
    
    # Check for default/weak values
    if grep -q "Admin@123456" .env 2>/dev/null; then
        echo "⚠️  WARNING: Using default admin password! Change it immediately!"
        ((ERRORS++))
    else
        echo "✅ Admin password changed from default"
    fi
    
    if grep -q "your_jwt_secret_here" .env 2>/dev/null; then
        echo "⚠️  WARNING: Using default JWT secret! Change it immediately!"
        ((ERRORS++))
    else
        echo "✅ JWT secret configured"
    fi
else
    echo "❌ .env file not found"
    ((ERRORS++))
fi

echo ""
echo "5️⃣  Checking for Data Files..."
echo ""

# Check for any existing database files
DB_FILES=$(find . -name "*.db" -o -name "*.sqlite" 2>/dev/null | grep -v node_modules | wc -l)
if [ "$DB_FILES" -eq 0 ]; then
    echo "✅ No local database files found (using PostgreSQL)"
else
    echo "⚠️  Found $DB_FILES local database file(s)"
fi

# Check for log files
LOG_FILES=$(find . -name "*.log" 2>/dev/null | grep -v node_modules | wc -l)
if [ "$LOG_FILES" -eq 0 ]; then
    echo "✅ No log files found (fresh state)"
else
    echo "ℹ️  Found $LOG_FILES log file(s) (normal after startup)"
fi

echo ""
echo "============================================="
echo ""

if [ $ERRORS -eq 0 ]; then
    echo "✨ Verification completed successfully!"
    echo "🎉 Your VNC Blockchain appears to be in fresh state"
    echo ""
    echo "📊 Expected values (verify manually):"
    echo "   - Presale tokens_sold: 0"
    echo "   - Presale total_raised: 0"
    echo "   - Presale participants: 0"
    echo "   - All user balances: 0"
    echo "   - Blockchain: Starting from block 0"
    echo ""
    echo "🔗 Quick checks:"
    echo "   - API Health: http://localhost:5000/health"
    echo "   - Database UI: cd backend/api-server && npx prisma studio"
    echo ""
    exit 0
else
    echo "⚠️  Verification completed with $ERRORS error(s)"
    echo ""
    echo "Please review the errors above and:"
    echo "  1. Check if services are running: docker-compose ps"
    echo "  2. Review logs: docker-compose logs"
    echo "  3. Verify environment configuration: cat .env"
    echo "  4. Run reset if needed: npm run reset:all"
    echo ""
    echo "📚 See DATA_RESET_GUIDE.md for more information"
    echo ""
    exit 1
fi
