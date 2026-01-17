#!/bin/bash

# =============================================================================
# VNC Blockchain - Post-Deployment Verification Script
# =============================================================================
# This script verifies that the deployment was successful
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
echo "    VNC Blockchain - Post-Deployment Verification"
echo "======================================================================"
echo ""

FAILED_CHECKS=0

# Test 1: Check if backend is running
print_info "Test 1/10: Checking backend process..."
if pm2 list | grep -q "vnc-backend.*online"; then
    print_success "Backend process is running"
else
    print_error "Backend process is not running"
    FAILED_CHECKS=$((FAILED_CHECKS + 1))
fi
echo ""

# Test 2: Check if frontend is running
print_info "Test 2/10: Checking frontend process..."
if pm2 list | grep -q "vnc-frontend.*online"; then
    print_success "Frontend process is running"
else
    print_error "Frontend process is not running"
    FAILED_CHECKS=$((FAILED_CHECKS + 1))
fi
echo ""

# Test 3: Backend health check
print_info "Test 3/10: Testing backend health endpoint..."
if curl -s -f http://localhost:5000/health > /dev/null; then
    RESPONSE=$(curl -s http://localhost:5000/health)
    print_success "Backend health check passed"
    echo "    Response: $RESPONSE"
else
    print_error "Backend health check failed"
    FAILED_CHECKS=$((FAILED_CHECKS + 1))
fi
echo ""

# Test 4: Frontend accessibility
print_info "Test 4/10: Testing frontend accessibility..."
if curl -s -f http://localhost:3002 > /dev/null; then
    print_success "Frontend is accessible"
else
    print_error "Frontend is not accessible"
    FAILED_CHECKS=$((FAILED_CHECKS + 1))
fi
echo ""

# Test 5: Database connectivity
print_info "Test 5/10: Testing database connectivity..."
if systemctl is-active --quiet postgresql; then
    print_success "PostgreSQL is running"
else
    print_error "PostgreSQL is not running"
    FAILED_CHECKS=$((FAILED_CHECKS + 1))
fi
echo ""

# Test 6: Redis connectivity
print_info "Test 6/10: Testing Redis connectivity..."
if systemctl is-active --quiet redis-server; then
    if redis-cli ping | grep -q "PONG"; then
        print_success "Redis is running and responding"
    else
        print_error "Redis is not responding"
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
    fi
else
    print_error "Redis is not running"
    FAILED_CHECKS=$((FAILED_CHECKS + 1))
fi
echo ""

# Test 7: Nginx status
print_info "Test 7/10: Checking Nginx status..."
if systemctl is-active --quiet nginx; then
    print_success "Nginx is running"
else
    print_error "Nginx is not running"
    FAILED_CHECKS=$((FAILED_CHECKS + 1))
fi
echo ""

# Test 8: Check disk space
print_info "Test 8/10: Checking disk space..."
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -lt 80 ]; then
    print_success "Disk space is adequate ($DISK_USAGE% used)"
else
    print_warning "Disk space is getting low ($DISK_USAGE% used)"
fi
echo ""

# Test 9: Check memory usage
print_info "Test 9/10: Checking memory usage..."
MEMORY_USAGE=$(free | grep Mem | awk '{printf "%.0f", $3/$2 * 100.0}')
if [ "$MEMORY_USAGE" -lt 80 ]; then
    print_success "Memory usage is normal ($MEMORY_USAGE% used)"
else
    print_warning "Memory usage is high ($MEMORY_USAGE% used)"
fi
echo ""

# Test 10: Check logs for errors
print_info "Test 10/10: Checking for recent errors in logs..."
ERROR_COUNT=$(pm2 logs --nostream --lines 100 2>/dev/null | grep -i "error" | wc -l || echo 0)
if [ "$ERROR_COUNT" -eq 0 ]; then
    print_success "No recent errors found in logs"
else
    print_warning "Found $ERROR_COUNT error messages in recent logs"
    print_info "Run 'pm2 logs' to view details"
fi
echo ""

# Print summary
echo "======================================================================"
if [ $FAILED_CHECKS -eq 0 ]; then
    echo -e "${GREEN}    ✓ All Checks Passed!${NC}"
    echo "======================================================================"
    echo ""
    print_success "Deployment verification completed successfully"
    echo ""
    print_info "Your application is ready for use:"
    echo "  Frontend: http://$(hostname -I | awk '{print $1}'):3002"
    echo "  Backend API: http://$(hostname -I | awk '{print $1}'):5000"
    echo ""
else
    echo -e "${RED}    ✗ $FAILED_CHECKS Check(s) Failed!${NC}"
    echo "======================================================================"
    echo ""
    print_error "Some verification checks failed"
    print_info "Please review the output above and fix the issues"
    echo ""
fi

print_info "Additional Commands:"
echo "  - View logs: pm2 logs"
echo "  - Monitor processes: pm2 monit"
echo "  - Restart services: pm2 restart all"
echo ""
echo "======================================================================"

exit $FAILED_CHECKS
