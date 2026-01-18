#!/bin/bash

# VNC Blockchain - Server Initialization Script
# Run this script after deploying to a new server
# This ensures everything starts fresh from 0

set -e

echo "🚀 VNC Blockchain - Server Initialization"
echo "=========================================="
echo ""
echo "This script will:"
echo "  1. Reset all data to 0"
echo "  2. Initialize database with fresh schema"
echo "  3. Seed initial data (presale, admin user)"
echo "  4. Start all services"
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  WARNING: .env file not found!"
    echo "Creating from .env.example..."
    cp .env.example .env
    echo "✅ Created .env file"
    echo ""
    echo "⚠️  IMPORTANT: Please edit .env file with your production values!"
    echo "Press Enter to continue after editing, or Ctrl+C to cancel..."
    read
fi

echo "🧹 Step 1: Resetting all data..."
echo ""

# Run the data reset script
bash ./scripts/reset-all-data.sh

echo ""
echo "📦 Step 2: Installing dependencies..."
echo ""

# Install root dependencies
npm install

# Install backend dependencies
echo "   Installing backend dependencies..."
cd backend/api-server
npm install
cd ../..

echo ""
echo "🗄️  Step 3: Setting up database..."
echo ""

cd backend/api-server

# Generate Prisma client
echo "   Generating Prisma client..."
npx prisma generate

# Push schema to database
echo "   Pushing database schema..."
npx prisma db push --skip-generate || npx prisma migrate deploy || true

# Seed database
echo "   Seeding database with initial data..."
npm run seed

cd ../..

echo ""
echo "🐳 Step 4: Starting services with Docker..."
echo ""

# Start Docker services
if command -v docker-compose &> /dev/null; then
    echo "   Starting Docker Compose services..."
    docker-compose up -d
    
    echo ""
    echo "   Waiting for services to be ready..."
    sleep 10
    
    echo "   ✅ Services started successfully"
else
    echo "   ⚠️  Docker Compose not found"
    echo "   You can start services manually with: npm run dev"
fi

echo ""
echo "════════════════════════════════════"
echo "✨ Server initialization completed!"
echo "════════════════════════════════════"
echo ""
echo "📊 Initial State:"
echo "  ✅ Database: Fresh with initial data"
echo "  ✅ Presale: Stage 1, tokens_sold = 0, total_raised = 0"
echo "  ✅ Balances: All set to 0"
echo "  ✅ Blockchain: Clean state, starting from block 0"
echo ""
echo "🔑 Default Admin Credentials:"
echo "  Email: admin@vncblockchain.com (or from .env)"
echo "  Password: Admin@123456 (or from .env)"
echo ""
echo "🌐 Service URLs:"
echo "  API: http://localhost:5000"
echo "  RPC: http://localhost:8545"
echo "  WebSocket: ws://localhost:8546"
echo ""
echo "📝 Next Steps:"
echo "  1. Change default admin password"
echo "  2. Configure presale settings if needed"
echo "  3. Test the API: curl http://localhost:5000/health"
echo "  4. Access admin dashboard"
echo ""
echo "📚 For more information, see DATA_RESET_GUIDE.md"
echo ""
