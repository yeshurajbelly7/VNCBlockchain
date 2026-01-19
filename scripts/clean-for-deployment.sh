#!/bin/bash

# =============================================================================
# VNC Blockchain - Quick Clean & Reset Script
# =============================================================================
# This script cleans all generated files and resets to fresh state
# Use this before uploading to a fresh server
# =============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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
echo "    VNC Blockchain - Clean & Reset for Fresh Deployment"
echo "======================================================================"
echo ""

print_warning "This will remove all build artifacts and dependencies"
read -r -p "Continue? (yes/no): " confirm
if [ "$confirm" != "yes" ]; then
    echo "Cancelled"
    exit 0
fi

print_info "Starting cleanup..."
echo ""

# Remove node_modules
print_info "Removing node_modules..."
find . -name "node_modules" -type d -prune -exec rm -rf {} +
print_success "node_modules removed"

# Remove build directories
print_info "Removing build directories..."
find . -name "dist" -type d -prune -exec rm -rf {} +
find . -name "build" -type d -prune -exec rm -rf {} +
find . -name ".next" -type d -prune -exec rm -rf {} +
find . -name "out" -type d -prune -exec rm -rf {} +
print_success "Build directories removed"

# Remove logs
print_info "Removing log files..."
find . -name "*.log" -type f -delete
rm -rf logs/
print_success "Log files removed"

# Remove temporary files
print_info "Removing temporary files..."
find . -name "*.tmp" -type f -delete
find . -name "*.temp" -type f -delete
rm -rf tmp/
rm -rf temp/
print_success "Temporary files removed"

# Remove environment files (keep examples)
print_info "Removing environment files..."
find . -name ".env" -type f -not -name ".env.example" -not -name ".env.production.example" -delete
print_success "Environment files removed (examples kept)"

# Remove deployment artifacts
print_info "Removing deployment artifacts..."
rm -f -- *.zip
rm -rf deployment/
print_success "Deployment artifacts removed"

# Remove cache files
print_info "Removing cache files..."
find . -name ".cache" -type d -prune -exec rm -rf {} +
find . -name ".parcel-cache" -type d -prune -exec rm -rf {} +
print_success "Cache files removed"

# Remove TypeScript build info
print_info "Removing TypeScript build info..."
find . -name "*.tsbuildinfo" -type f -delete
print_success "TypeScript build info removed"

# Remove package-lock files (optional)
read -r -p "Remove package-lock.json files? (yes/no): " remove_locks
if [ "$remove_locks" == "yes" ]; then
    find . -name "package-lock.json" -type f -delete
    print_success "package-lock.json files removed"
fi

echo ""
echo "======================================================================"
print_success "Cleanup Complete!"
echo "======================================================================"
echo ""
print_info "Repository is now clean and ready for:"
echo "  - Committing to Git"
echo "  - Uploading to fresh server"
echo "  - Sharing with team"
echo ""
print_warning "On the server, run:"
echo "  1. git clone <repository>"
echo "  2. bash scripts/setup-fresh-server.sh"
echo "  3. cp .env.production.example .env"
echo "  4. bash scripts/init-fresh-database.sh"
echo "  5. bash scripts/deploy-production.sh"
echo ""
echo "======================================================================"
