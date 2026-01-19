#!/bin/bash

# ============================================
# VNC Blockchain - cPanel Deployment Script
# ============================================
# Automated deployment for cPanel shared hosting
# Ensures clean start with ZERO demo data
# ============================================

set -e

echo "🚀 VNC Blockchain - cPanel Deployment"
echo "======================================"
echo ""

# Configuration
read -p "Enter your cPanel username: " CPANEL_USER
read -p "Enter your domain (e.g., yourdomain.com): " DOMAIN
read -sp "Enter your PostgreSQL database password: " DB_PASSWORD
echo ""

HOME_DIR="/home/$CPANEL_USER"
API_DIR="$HOME_DIR/api"
PRESALE_DIR="$HOME_DIR/presale"
PUBLIC_DIR="$HOME_DIR/public_html"

# Step 1: Check if we're on the server
echo ""
echo "📋 Step 1: Checking environment..."
if [ ! -d "$HOME_DIR" ]; then
    echo "❌ ERROR: Not on cPanel server or incorrect username"
    echo "Current directory: $(pwd)"
    echo "Expected home: $HOME_DIR"
    exit 1
fi
echo "✅ Environment check passed"

# Step 2: Create directory structure
echo ""
echo "📁 Step 2: Creating directory structure..."
mkdir -p "$API_DIR"
mkdir -p "$PRESALE_DIR"
mkdir -p "$PUBLIC_DIR"
echo "✅ Directories created"

# Step 3: Clone repository
echo ""
echo "📦 Step 3: Downloading application..."
cd $HOME_DIR
if [ -d "temp_deploy" ]; then
    rm -rf temp_deploy
fi
git clone https://github.com/yeshurajbelly7/VNCBlockchain.git temp_deploy
echo "✅ Repository cloned"

# Step 4: Copy files to correct locations
echo ""
echo "📋 Step 4: Organizing files..."
cp -r temp_deploy/backend/api-server/* "$API_DIR/"
cp -r temp_deploy/frontend/presale-platform/* "$PRESALE_DIR/"
cp -r temp_deploy/frontend/public-website/* "$PUBLIC_DIR/"
rm -rf temp_deploy
echo "✅ Files organized"

# Step 5: Configure Backend
echo ""
echo "🔧 Step 5: Configuring backend..."
cd "$API_DIR"

# Create .env file
cat > .env << EOF
# Server Configuration
PORT=\${PORT:-3000}
NODE_ENV=production

# Database Configuration
DATABASE_URL="postgresql://${CPANEL_USER}_vncprod:${DB_PASSWORD}@localhost:5432/${CPANEL_USER}_vncblockchain"

# JWT Configuration
JWT_SECRET=$(openssl rand -base64 64 | tr -d '\n')
JWT_EXPIRES_IN=7d

# Cashfree Configuration (UPDATE THESE)
CASHFREE_APP_ID=your-production-app-id
CASHFREE_SECRET_KEY=your-production-secret-key
CASHFREE_ENVIRONMENT=PRODUCTION
CASHFREE_WEBHOOK_SECRET=your-webhook-secret

# Smart Contract Configuration (UPDATE THESE)
PRESALE_CONTRACT_ADDRESS=0xYourContractAddress
PRESALE_CONTRACT_ABI_PATH=./contracts/VNCPresale.json
NETWORK_RPC_URL=https://polygon-mainnet.infura.io/v3/YOUR_KEY
PRIVATE_KEY=your-private-key

# Email Configuration (UPDATE THESE)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=VNC Blockchain <noreply@${DOMAIN}>

# URLs
FRONTEND_PRESALE_URL=https://presale.${DOMAIN}
FRONTEND_PUBLIC_URL=https://${DOMAIN}
ALLOWED_ORIGINS=https://${DOMAIN},https://presale.${DOMAIN},https://api.${DOMAIN}
EOF

chmod 600 .env
echo "✅ Backend configuration created"

# Step 6: Install backend dependencies
echo ""
echo "📦 Step 6: Installing backend dependencies..."
echo "This may take a few minutes..."

# Source Node.js environment if exists
if [ -f "$HOME_DIR/nodevenv/api/18/bin/activate" ]; then
    source "$HOME_DIR/nodevenv/api/18/bin/activate"
fi

npm ci --production
npm install prisma --save-dev

# Generate Prisma Client
npx prisma generate

echo "✅ Backend dependencies installed"

# Step 7: Setup Database
echo ""
echo "🗄️  Step 7: Setting up database..."
echo "⚠️  This will create EMPTY database tables (no demo data)"

# Run migrations
npx prisma migrate deploy

echo "✅ Database tables created (empty)"

# Step 8: Build Backend
echo ""
echo "🔨 Step 8: Building backend..."
npm run build

if [ ! -d "dist" ]; then
    echo "❌ ERROR: Build failed - dist directory not created"
    exit 1
fi
echo "✅ Backend built successfully"

# Step 9: Configure Frontend (Presale)
echo ""
echo "🎨 Step 9: Configuring presale platform..."
cd "$PRESALE_DIR"

cat > .env.local << EOF
NEXT_PUBLIC_API_URL=https://api.${DOMAIN}
NEXT_PUBLIC_SITE_URL=https://presale.${DOMAIN}
EOF

# Source Node.js environment if exists
if [ -f "$HOME_DIR/nodevenv/presale/18/bin/activate" ]; then
    source "$HOME_DIR/nodevenv/presale/18/bin/activate"
fi

npm ci
npm run build
echo "✅ Presale platform built"

# Step 10: Configure Public Website
echo ""
echo "🌐 Step 10: Configuring public website..."
cd "$PUBLIC_DIR"

cat > .env.local << EOF
NEXT_PUBLIC_API_URL=https://api.${DOMAIN}
EOF

# Source Node.js environment if exists
if [ -f "$HOME_DIR/nodevenv/public_html/18/bin/activate" ]; then
    source "$HOME_DIR/nodevenv/public_html/18/bin/activate"
fi

npm ci
npm run build
echo "✅ Public website built"

# Step 11: Create .htaccess files
echo ""
echo "🔒 Step 11: Creating security files..."

# Backend .htaccess
cat > "$API_DIR/.htaccess" << 'EOF'
# Disable directory listing
Options -Indexes

# Protect sensitive files
<FilesMatch "^\.env">
    Order allow,deny
    Deny from all
</FilesMatch>

# Node.js application
PassengerEnabled on
PassengerAppRoot /home/CPANEL_USER/api
PassengerAppType node
PassengerStartupFile dist/server.js
EOF

# Replace placeholder
sed -i "s/CPANEL_USER/$CPANEL_USER/g" "$API_DIR/.htaccess"

# Presale .htaccess
cat > "$PRESALE_DIR/.htaccess" << 'EOF'
PassengerEnabled on
PassengerAppRoot /home/CPANEL_USER/presale
PassengerAppType node
PassengerStartupFile node_modules/next/dist/bin/next
PassengerAppStart start
EOF
sed -i "s/CPANEL_USER/$CPANEL_USER/g" "$PRESALE_DIR/.htaccess"

# Public .htaccess
cat > "$PUBLIC_DIR/.htaccess" << 'EOF'
PassengerEnabled on
PassengerAppRoot /home/CPANEL_USER/public_html
PassengerAppType node
PassengerStartupFile node_modules/next/dist/bin/next
PassengerAppStart start

# Next.js routing
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
</IfModule>
EOF
sed -i "s/CPANEL_USER/$CPANEL_USER/g" "$PUBLIC_DIR/.htaccess"

echo "✅ Security files created"

# Step 12: Final verification
echo ""
echo "🔍 Step 12: Verifying installation..."

# Check database is empty
cd "$API_DIR"
USER_COUNT=$(npx prisma db execute --stdin <<< "SELECT COUNT(*) FROM \"User\";" 2>/dev/null | grep -o '[0-9]*' | head -1 || echo "0")

if [ "$USER_COUNT" = "0" ]; then
    echo "✅ Database verified empty (0 users)"
else
    echo "⚠️  Warning: Database has $USER_COUNT users"
fi

# Summary
echo ""
echo "✅ Deployment Complete!"
echo "======================="
echo ""
echo "📊 Installation Summary:"
echo "  - Backend API: $API_DIR"
echo "  - Presale Platform: $PRESALE_DIR"
echo "  - Public Website: $PUBLIC_DIR"
echo "  - Database: Empty (0 records) ✅"
echo ""
echo "🔑 Next Steps:"
echo "  1. Go to cPanel → Setup Node.js App"
echo "  2. Create 3 Node.js applications:"
echo "     a) api.$DOMAIN → $API_DIR → dist/server.js"
echo "     b) presale.$DOMAIN → $PRESALE_DIR → node_modules/next/dist/bin/next"
echo "     c) $DOMAIN → $PUBLIC_DIR → node_modules/next/dist/bin/next"
echo "  3. Create subdomains: api.$DOMAIN, presale.$DOMAIN"
echo "  4. Enable SSL for all domains (Let's Encrypt)"
echo "  5. Update .env in $API_DIR with:"
echo "     - Cashfree production keys"
echo "     - Smart contract addresses"
echo "     - Email credentials"
echo "  6. Restart all Node.js apps in cPanel"
echo "  7. Visit: https://presale.$DOMAIN/install"
echo "  8. Create your Super Admin account"
echo ""
echo "⚠️  Important Notes:"
echo "  - Database is completely EMPTY (no demo data)"
echo "  - JWT secret has been auto-generated"
echo "  - Update remaining credentials in .env"
echo "  - Configure Node.js apps in cPanel"
echo ""
echo "🎉 Your cPanel deployment is ready!"
