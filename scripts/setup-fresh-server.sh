#!/bin/bash

# =============================================================================
# VNC Blockchain - Fresh Server Setup Script
# =============================================================================
# This script sets up a fresh production server with all dependencies
# Run this on your server after cloning the repository
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
echo "    VNC Blockchain - Fresh Server Setup"
echo "======================================================================"
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    print_error "Please run as root (use sudo)"
    exit 1
fi

print_info "Starting fresh server setup..."
echo ""

# Step 1: System Update
print_info "Step 1/10: Updating system packages..."
apt update && apt upgrade -y
print_success "System updated"
echo ""

# Step 2: Install Node.js 20.x
print_info "Step 2/10: Installing Node.js 20.x..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
node --version
npm --version
print_success "Node.js installed"
echo ""

# Step 3: Install PostgreSQL 15
print_info "Step 3/10: Installing PostgreSQL 15..."
apt install -y postgresql-15 postgresql-contrib-15
systemctl start postgresql
systemctl enable postgresql
print_success "PostgreSQL installed"
echo ""

# Step 4: Install Redis
print_info "Step 4/10: Installing Redis..."
apt install -y redis-server
systemctl start redis-server
systemctl enable redis-server
print_success "Redis installed"
echo ""

# Step 5: Install Nginx
print_info "Step 5/10: Installing Nginx..."
apt install -y nginx
systemctl start nginx
systemctl enable nginx
print_success "Nginx installed"
echo ""

# Step 6: Install PM2
print_info "Step 6/10: Installing PM2 (Process Manager)..."
npm install -g pm2
pm2 --version
print_success "PM2 installed"
echo ""

# Step 7: Install build tools
print_info "Step 7/10: Installing build tools..."
apt install -y build-essential git curl wget
print_success "Build tools installed"
echo ""

# Step 8: Setup firewall
print_info "Step 8/10: Configuring firewall..."
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw allow 5000/tcp  # Backend API
ufw --force enable
print_success "Firewall configured"
echo ""

# Step 9: Create application user
print_info "Step 9/10: Creating application user..."
if id "vncapp" &>/dev/null; then
    print_warning "User vncapp already exists"
else
    useradd -m -s /bin/bash vncapp
    print_success "Application user created"
fi
echo ""

# Step 10: Setup application directory
print_info "Step 10/10: Setting up application directory..."
APP_DIR="/home/vncapp/VNCBlockchain"
if [ -d "$APP_DIR" ]; then
    print_warning "Application directory already exists"
else
    mkdir -p "$APP_DIR"
    chown -R vncapp:vncapp "$APP_DIR"
    print_success "Application directory created"
fi
echo ""

# Print summary
echo "======================================================================"
echo "    Server Setup Complete!"
echo "======================================================================"
echo ""
print_success "All dependencies installed successfully"
echo ""
print_info "Next steps:"
echo "  1. Switch to application user: su - vncapp"
echo "  2. Clone repository: git clone https://github.com/yeshurajbelly7/VNCBlockchain.git"
echo "  3. Copy .env.production.example to .env and configure"
echo "  4. Run database setup: cd VNCBlockchain && bash scripts/init-fresh-database.sh"
echo "  5. Build and start application: bash scripts/deploy-production.sh"
echo ""
print_warning "Important Configuration Required:"
echo "  - Configure PostgreSQL database and user"
echo "  - Set Redis password"
echo "  - Configure Nginx reverse proxy"
echo "  - Setup SSL certificates (Let's Encrypt)"
echo "  - Configure environment variables in .env"
echo ""
echo "======================================================================"
