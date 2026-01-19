#!/bin/bash

# =============================================================================
# VNC Blockchain - Fresh Database Initialization Script
# =============================================================================
# This script initializes a completely fresh database for production deployment
# It will:
# 1. Create the database if it doesn't exist
# 2. Run all Prisma migrations
# 3. Generate Prisma client
# 4. Create initial super admin user
# 5. Set up initial presale stages
# =============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored messages
print_info() {
    echo -e "${BLUE}ℹ ${1}${NC}"
}

print_success() {
    echo -e "${GREEN}✓ ${1}${NC}"
}

print_error() {
    echo -e "${RED}✗ ${1}${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ ${1}${NC}"
}

# Banner
echo "======================================================================"
echo "    VNC Blockchain - Fresh Database Initialization"
echo "======================================================================"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    print_error ".env file not found!"
    print_info "Please copy .env.production.example to .env and configure all variables"
    exit 1
fi

print_success ".env file found"

# Load environment variables
source .env

# Extract database connection details from DATABASE_URL
if [ -z "$DATABASE_URL" ]; then
    print_error "DATABASE_URL not set in .env file"
    exit 1
fi

print_success "DATABASE_URL configured"

# Check if we're in the correct directory
if [ ! -f "backend/api-server/prisma/schema.prisma" ]; then
    print_error "Prisma schema not found!"
    print_info "Please run this script from the repository root"
    exit 1
fi

cd backend/api-server

print_info "Starting database initialization..."
echo ""

# Step 1: Install dependencies
print_info "Step 1/6: Installing dependencies..."
npm install --production=false
print_success "Dependencies installed"
echo ""

# Step 2: Generate Prisma Client
print_info "Step 2/6: Generating Prisma client..."
npx prisma generate
print_success "Prisma client generated"
echo ""

# Step 3: Reset database (drop all tables and recreate)
print_warning "Step 3/6: Resetting database (this will delete all existing data)..."
read -r -p "Are you sure you want to reset the database? (yes/no): " confirm
if [ "$confirm" != "yes" ]; then
    print_error "Database reset cancelled"
    exit 1
fi

npx prisma migrate reset --force --skip-seed
print_success "Database reset complete"
echo ""

# Step 4: Run migrations
print_info "Step 4/6: Running database migrations..."
npx prisma migrate deploy
print_success "Migrations completed"
echo ""

# Step 5: Create initial super admin (if configured)
print_info "Step 5/6: Creating super admin user..."
if [ -n "$SUPER_ADMIN_EMAIL" ] && [ -n "$SUPER_ADMIN_PASSWORD" ]; then
    node -e "
    const { PrismaClient } = require('@prisma/client');
    const bcrypt = require('bcryptjs');
    const prisma = new PrismaClient();
    
    async function createSuperAdmin() {
        try {
            const hashedPassword = await bcrypt.hash('$SUPER_ADMIN_PASSWORD', 12);
            const user = await prisma.user.create({
                data: {
                    email: '$SUPER_ADMIN_EMAIL',
                    password_hash: hashedPassword,
                    name: 'Super Administrator',
                    role: 'SUPER_ADMIN',
                    wallet_address: '0x' + Math.random().toString(16).substring(2, 42),
                    is_active: true,
                    kyc_status: 'APPROVED'
                }
            });
            console.log('Super admin created:', user.email);
        } catch (error) {
            if (error.code === 'P2002') {
                console.log('Super admin already exists');
            } else {
                throw error;
            }
        } finally {
            await prisma.$disconnect();
        }
    }
    
    createSuperAdmin();
    "
    print_success "Super admin user created"
else
    print_warning "SUPER_ADMIN_EMAIL or SUPER_ADMIN_PASSWORD not set, skipping..."
fi
echo ""

# Step 6: Create initial presale stages
print_info "Step 6/6: Creating initial presale stages..."
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createPresaleStages() {
    try {
        const stages = [
            {
                stage_number: 1,
                name: 'Presale Stage 1',
                token_price: 0.008,
                tokens_available: 500000000,
                min_purchase: 10,
                max_purchase: 100000,
                bonus_percentage: 25,
                is_active: true
            },
            {
                stage_number: 2,
                name: 'Presale Stage 2',
                token_price: 0.010,
                tokens_available: 500000000,
                min_purchase: 10,
                max_purchase: 100000,
                bonus_percentage: 20,
                is_active: false
            },
            {
                stage_number: 3,
                name: 'Presale Stage 3',
                token_price: 0.012,
                tokens_available: 500000000,
                min_purchase: 10,
                max_purchase: 100000,
                bonus_percentage: 15,
                is_active: false
            }
        ];

        for (const stage of stages) {
            await prisma.presaleStage.upsert({
                where: { stage_number: stage.stage_number },
                update: stage,
                create: stage
            });
        }
        
        console.log('Presale stages created');
    } catch (error) {
        console.error('Error creating presale stages:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

createPresaleStages();
"
print_success "Initial presale stages created"
echo ""

# Print summary
echo "======================================================================"
echo "    Database Initialization Complete!"
echo "======================================================================"
echo ""
print_success "Database is ready for production use"
echo ""
print_info "Next steps:"
echo "  1. Start the backend server: npm start"
echo "  2. Verify health check: curl http://localhost:5000/health"
echo "  3. Login with super admin credentials"
echo ""

if [ -n "$SUPER_ADMIN_EMAIL" ]; then
    print_info "Super Admin Credentials:"
    echo "  Email: $SUPER_ADMIN_EMAIL"
    echo "  Password: (as configured in .env)"
fi

echo ""
print_warning "Security Reminders:"
echo "  - Change all default passwords"
echo "  - Enable 2FA for admin accounts"
echo "  - Review and update CORS settings"
echo "  - Configure SSL/TLS certificates"
echo "  - Set up regular database backups"
echo ""
echo "======================================================================"
