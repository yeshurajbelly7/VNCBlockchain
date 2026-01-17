#!/bin/bash

# =============================================================================
# VNC Blockchain - Production Deployment Script
# =============================================================================
# This script deploys the application to production
# Run after database initialization
# =============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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
echo "    VNC Blockchain - Production Deployment"
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

# Verify NODE_ENV is production
if [ "$NODE_ENV" != "production" ]; then
    print_warning "NODE_ENV is not set to 'production'"
    read -r -p "Continue anyway? (yes/no): " confirm
    if [ "$confirm" != "yes" ]; then
        print_error "Deployment cancelled"
        exit 1
    fi
fi

print_info "Starting production deployment..."
echo ""

# Step 1: Install backend dependencies
print_info "Step 1/7: Installing backend dependencies..."
cd backend/api-server
npm ci --production
print_success "Backend dependencies installed"
cd ../..
echo ""

# Step 2: Build backend
print_info "Step 2/7: Building backend..."
cd backend/api-server
npm run build
print_success "Backend built successfully"
cd ../..
echo ""

# Step 3: Install frontend dependencies
print_info "Step 3/7: Installing frontend dependencies..."
cd frontend/presale-platform
npm ci --production
print_success "Frontend dependencies installed"
cd ../..
echo ""

# Step 4: Build frontend
print_info "Step 4/7: Building frontend..."
cd frontend/presale-platform
npm run build
print_success "Frontend built successfully"
cd ../..
echo ""

# Step 5: Setup PM2 processes
print_info "Step 5/7: Setting up PM2 processes..."

# Get current directory for absolute paths
CURRENT_DIR=$(pwd)

# Create logs directory
mkdir -p logs

# Create PM2 ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [
    {
      name: 'vnc-backend',
      cwd: './backend/api-server',
      script: 'dist/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      error_file: '${CURRENT_DIR}/logs/backend-error.log',
      out_file: '${CURRENT_DIR}/logs/backend-out.log',
      log_file: '${CURRENT_DIR}/logs/backend-combined.log',
      time: true,
      max_memory_restart: '1G',
      node_args: '--max-old-space-size=4096'
    },
    {
      name: 'vnc-frontend',
      cwd: './frontend/presale-platform',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3002',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3002
      },
      error_file: '${CURRENT_DIR}/logs/frontend-error.log',
      out_file: '${CURRENT_DIR}/logs/frontend-out.log',
      log_file: '${CURRENT_DIR}/logs/frontend-combined.log',
      time: true,
      max_memory_restart: '1G'
    }
  ]
};
EOF

# Stop existing processes
pm2 delete all 2>/dev/null || true

# Start PM2 processes
pm2 start ecosystem.config.js
pm2 save
pm2 startup

print_success "PM2 processes configured and started"
echo ""

# Step 6: Configure Nginx
print_info "Step 6/7: Configuring Nginx..."

# Create Nginx configuration
sudo tee /etc/nginx/sites-available/vncblockchain << 'EOF'
# Backend API Server
server {
    listen 80;
    server_name api.yourdomain.com;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}

# Frontend Application
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static files caching
    location /_next/static {
        proxy_pass http://localhost:3002;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
EOF

# Enable site and reload Nginx
sudo ln -sf /etc/nginx/sites-available/vncblockchain /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

print_success "Nginx configured"
echo ""

# Step 7: Setup SSL (optional)
print_info "Step 7/7: SSL Certificate Setup (optional)..."
read -r -p "Do you want to setup SSL with Let's Encrypt? (yes/no): " ssl_confirm
if [ "$ssl_confirm" == "yes" ]; then
    sudo apt install -y certbot python3-certbot-nginx
    print_warning "Please run: sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com"
else
    print_warning "SSL setup skipped. You can run certbot manually later."
fi
echo ""

# Print summary
echo "======================================================================"
echo "    Production Deployment Complete!"
echo "======================================================================"
echo ""
print_success "Application deployed successfully"
echo ""
print_info "Application Status:"
pm2 status
echo ""
print_info "Application URLs:"
echo "  Frontend: http://yourdomain.com"
echo "  Backend API: http://api.yourdomain.com"
echo "  Health Check: http://api.yourdomain.com/health"
echo ""
print_info "Useful Commands:"
echo "  - Check logs: pm2 logs"
echo "  - Restart app: pm2 restart all"
echo "  - Stop app: pm2 stop all"
echo "  - Monitor: pm2 monit"
echo ""
print_warning "Post-Deployment Checklist:"
echo "  ✓ Test all endpoints"
echo "  ✓ Verify database connectivity"
echo "  ✓ Check error logs"
echo "  ✓ Setup SSL certificates"
echo "  ✓ Configure domain DNS"
echo "  ✓ Setup monitoring and alerts"
echo "  ✓ Configure automated backups"
echo "  ✓ Test payment integration"
echo ""
echo "======================================================================"
