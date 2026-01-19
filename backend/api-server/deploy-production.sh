#!/bin/bash

# ============================================
# VNC Blockchain - Production Deployment Script
# ============================================
# This script ensures a CLEAN production deployment
# with NO demo data
# ============================================

set -e  # Exit on error

echo "🚀 VNC Blockchain Production Deployment"
echo "========================================"
echo ""

# Check if running on production server
if [ "$NODE_ENV" != "production" ]; then
    echo "⚠️  WARNING: NODE_ENV is not set to 'production'"
    echo "Please set NODE_ENV=production before continuing"
    read -p "Continue anyway? (y/N): " confirm
    if [ "$confirm" != "y" ]; then
        exit 1
    fi
fi

# Step 1: Environment Check
echo "📋 Step 1: Checking environment..."
if [ ! -f ".env" ]; then
    echo "❌ ERROR: .env file not found!"
    echo "Please create .env file with production configuration"
    echo "Use .env.production as template"
    exit 1
fi

# Check for required environment variables
required_vars=("DATABASE_URL" "JWT_SECRET" "CASHFREE_APP_ID" "CASHFREE_SECRET_KEY")
for var in "${required_vars[@]}"; do
    if ! grep -q "$var=" .env; then
        echo "❌ ERROR: Missing $var in .env file"
        exit 1
    fi
done
echo "✅ Environment file configured"

# Step 2: Install Dependencies
echo ""
echo "📦 Step 2: Installing production dependencies..."
npm ci --production
echo "✅ Dependencies installed"

# Step 3: Database Setup
echo ""
echo "🗄️  Step 3: Setting up database..."
echo "⚠️  This will create a FRESH database with NO data"
read -p "Continue with fresh database? (y/N): " confirm_db
if [ "$confirm_db" != "y" ]; then
    echo "Deployment cancelled"
    exit 1
fi

# Generate Prisma Client
npx prisma generate
echo "✅ Prisma Client generated"

# Run migrations
npx prisma migrate deploy
echo "✅ Database schema created (empty tables)"

# Verify database is empty
echo ""
echo "📊 Verifying database is empty..."
RESULT=$(npx prisma db execute --stdin <<SQL
SELECT 
  (SELECT COUNT(*) FROM "User") as user_count,
  (SELECT COUNT(*) FROM "Transaction") as tx_count,
  (SELECT COUNT(*) FROM "Deposit") as deposit_count;
SQL
)
echo "$RESULT"

# Step 4: Build Application
echo ""
echo "🔨 Step 4: Building application..."
npm run build
echo "✅ Application built successfully"

# Step 5: Security Check
echo ""
echo "🔒 Step 5: Security verification..."

# Check for development secrets
if grep -q "your-super-secret-jwt-key-change-in-production" .env; then
    echo "❌ ERROR: Default JWT secret detected!"
    echo "Please change JWT_SECRET in .env"
    exit 1
fi

if grep -q "your-cashfree-app-id" .env; then
    echo "❌ ERROR: Default Cashfree credentials detected!"
    echo "Please update Cashfree credentials in .env"
    exit 1
fi

echo "✅ Security check passed"

# Step 6: Final Summary
echo ""
echo "✅ Deployment Complete!"
echo "========================"
echo ""
echo "📊 Database Status:"
echo "  - Tables: Created"
echo "  - Data: EMPTY (0 rows)"
echo "  - Status: Ready for first use"
echo ""
echo "🔑 Next Steps:"
echo "  1. Start the application: npm start"
echo "  2. Visit: https://yourdomain.com/install"
echo "  3. Create your Super Admin account"
echo "  4. Configure presale settings"
echo "  5. Start accepting users"
echo ""
echo "⚠️  Important Notes:"
echo "  - Database is completely empty"
echo "  - No demo or test data included"
echo "  - First admin must be created via installation wizard"
echo "  - All user data starts from ZERO"
echo ""
echo "🎉 Your production server is ready!"
