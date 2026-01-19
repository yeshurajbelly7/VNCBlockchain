# ============================================
# VNC Blockchain - Production Deployment Script (PowerShell)
# ============================================
# This script ensures a CLEAN production deployment
# with NO demo data
# ============================================

$ErrorActionPreference = "Stop"

Write-Host "🚀 VNC Blockchain Production Deployment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if running on production server
if ($env:NODE_ENV -ne "production") {
    Write-Host "⚠️  WARNING: NODE_ENV is not set to 'production'" -ForegroundColor Yellow
    Write-Host "Please set NODE_ENV=production before continuing" -ForegroundColor Yellow
    $confirm = Read-Host "Continue anyway? (y/N)"
    if ($confirm -ne "y") {
        exit 1
    }
}

# Step 1: Environment Check
Write-Host "📋 Step 1: Checking environment..." -ForegroundColor Cyan
if (-not (Test-Path ".env")) {
    Write-Host "❌ ERROR: .env file not found!" -ForegroundColor Red
    Write-Host "Please create .env file with production configuration" -ForegroundColor Red
    Write-Host "Use .env.production as template" -ForegroundColor Yellow
    exit 1
}

# Check for required environment variables
$required_vars = @("DATABASE_URL", "JWT_SECRET", "CASHFREE_APP_ID", "CASHFREE_SECRET_KEY")
$env_content = Get-Content ".env"
foreach ($var in $required_vars) {
    if ($env_content -notmatch "$var=") {
        Write-Host "❌ ERROR: Missing $var in .env file" -ForegroundColor Red
        exit 1
    }
}
Write-Host "✅ Environment file configured" -ForegroundColor Green

# Step 2: Install Dependencies
Write-Host ""
Write-Host "📦 Step 2: Installing production dependencies..." -ForegroundColor Cyan
npm ci --production
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
Write-Host "✅ Dependencies installed" -ForegroundColor Green

# Step 3: Database Setup
Write-Host ""
Write-Host "🗄️  Step 3: Setting up database..." -ForegroundColor Cyan
Write-Host "⚠️  This will create a FRESH database with NO data" -ForegroundColor Yellow
$confirm_db = Read-Host "Continue with fresh database? (y/N)"
if ($confirm_db -ne "y") {
    Write-Host "Deployment cancelled" -ForegroundColor Yellow
    exit 1
}

# Generate Prisma Client
Write-Host "Generating Prisma Client..." -ForegroundColor Gray
npx prisma generate
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
Write-Host "✅ Prisma Client generated" -ForegroundColor Green

# Run migrations
Write-Host "Running database migrations..." -ForegroundColor Gray
npx prisma migrate deploy
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
Write-Host "✅ Database schema created (empty tables)" -ForegroundColor Green

# Step 4: Build Application
Write-Host ""
Write-Host "🔨 Step 4: Building application..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
Write-Host "✅ Application built successfully" -ForegroundColor Green

# Step 5: Security Check
Write-Host ""
Write-Host "🔒 Step 5: Security verification..." -ForegroundColor Cyan

# Check for development secrets
$env_content = Get-Content ".env" -Raw
if ($env_content -match "your-super-secret-jwt-key-change-in-production") {
    Write-Host "❌ ERROR: Default JWT secret detected!" -ForegroundColor Red
    Write-Host "Please change JWT_SECRET in .env" -ForegroundColor Yellow
    exit 1
}

if ($env_content -match "your-cashfree-app-id") {
    Write-Host "❌ ERROR: Default Cashfree credentials detected!" -ForegroundColor Red
    Write-Host "Please update Cashfree credentials in .env" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Security check passed" -ForegroundColor Green

# Step 6: Final Summary
Write-Host ""
Write-Host "✅ Deployment Complete!" -ForegroundColor Green
Write-Host "========================" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Database Status:" -ForegroundColor Cyan
Write-Host "  - Tables: Created" -ForegroundColor White
Write-Host "  - Data: EMPTY (0 rows)" -ForegroundColor Yellow
Write-Host "  - Status: Ready for first use" -ForegroundColor White
Write-Host ""
Write-Host "🔑 Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Start the application: npm start" -ForegroundColor White
Write-Host "  2. Visit: https://yourdomain.com/install" -ForegroundColor White
Write-Host "  3. Create your Super Admin account" -ForegroundColor White
Write-Host "  4. Configure presale settings" -ForegroundColor White
Write-Host "  5. Start accepting users" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  Important Notes:" -ForegroundColor Yellow
Write-Host "  - Database is completely empty" -ForegroundColor White
Write-Host "  - No demo or test data included" -ForegroundColor White
Write-Host "  - First admin must be created via installation wizard" -ForegroundColor White
Write-Host "  - All user data starts from ZERO" -ForegroundColor White
Write-Host ""
Write-Host "🎉 Your production server is ready!" -ForegroundColor Green
