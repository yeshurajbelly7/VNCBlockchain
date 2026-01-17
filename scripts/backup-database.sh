#!/bin/bash

# =============================================================================
# VNC Blockchain - Database Backup Script
# =============================================================================
# This script creates a backup of the production database
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
echo "    VNC Blockchain - Database Backup"
echo "======================================================================"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    print_error ".env file not found!"
    exit 1
fi

# Load environment variables
source .env

# Extract database details
DB_HOST=$(echo $DATABASE_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
DB_PORT=$(echo $DATABASE_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
DB_NAME=$(echo $DATABASE_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')
DB_USER=$(echo $DATABASE_URL | sed -n 's/.*\/\/\([^:]*\):.*/\1/p')

print_info "Database: $DB_NAME"
print_info "Host: $DB_HOST:$DB_PORT"
print_info "User: $DB_USER"
echo ""

# Create backup directory
BACKUP_DIR="./backups"
mkdir -p $BACKUP_DIR

# Generate backup filename with timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/vnc_blockchain_backup_$TIMESTAMP.sql"

print_info "Creating backup..."
print_info "Backup file: $BACKUP_FILE"
echo ""

# Create backup
# Note: For production, consider using .pgpass file for secure password handling
# Create ~/.pgpass with: hostname:port:database:username:password (chmod 600)
if PGPASSWORD=$(echo $DATABASE_URL | sed -n 's/.*:\/\/[^:]*:\([^@]*\)@.*/\1/p') pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME > $BACKUP_FILE; then
    print_success "Backup created successfully!"
    
    # Get file size
    FILESIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    print_info "Backup size: $FILESIZE"
    
    # Compress backup
    print_info "Compressing backup..."
    gzip $BACKUP_FILE
    COMPRESSED_SIZE=$(du -h "$BACKUP_FILE.gz" | cut -f1)
    print_success "Backup compressed: $BACKUP_FILE.gz ($COMPRESSED_SIZE)"
else
    print_error "Backup failed!"
    exit 1
fi

echo ""

# Clean old backups (keep last 30 days)
print_info "Cleaning old backups (keeping last 30 days)..."
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete
REMAINING=$(ls -1 $BACKUP_DIR/*.sql.gz 2>/dev/null | wc -l)
print_success "Cleanup complete. $REMAINING backup(s) remaining."

echo ""
echo "======================================================================"
print_success "Backup Complete!"
echo "======================================================================"
echo ""
print_info "Backup location: $BACKUP_FILE.gz"
print_info "To restore this backup:"
echo "  gunzip $BACKUP_FILE.gz"
echo "  psql -U $DB_USER -d $DB_NAME < $BACKUP_FILE"
echo ""
print_warning "Store backups securely off-server (S3, external storage, etc.)"
echo ""
echo "======================================================================"
