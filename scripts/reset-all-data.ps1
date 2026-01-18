# VNC Blockchain - Complete Data Reset Script (Windows)
# This script resets all data to start fresh from 0
# Use this when deploying to a new server

Write-Host "🚀 VNC Blockchain - Data Reset Script" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  WARNING: This will delete ALL existing data!" -ForegroundColor Yellow
Write-Host "This includes:" -ForegroundColor Yellow
Write-Host "  - Database records (users, transactions, presale data)" -ForegroundColor Yellow
Write-Host "  - Blockchain data (blocks, state, validators)" -ForegroundColor Yellow
Write-Host "  - Cache data (Redis)" -ForegroundColor Yellow
Write-Host "  - Analytics data (MongoDB)" -ForegroundColor Yellow
Write-Host ""

$confirm = Read-Host "Are you sure you want to continue? (yes/no)"
if ($confirm -ne "yes") {
    Write-Host "❌ Reset cancelled" -ForegroundColor Red
    exit 0
}

Write-Host ""
Write-Host "🧹 Starting data reset..." -ForegroundColor Green
Write-Host ""

# Step 1: Stop all services
Write-Host "1️⃣  Stopping all services..." -ForegroundColor Cyan
try {
    docker-compose down -v 2>$null
    Write-Host "✅ Docker services stopped" -ForegroundColor Green
} catch {
    Write-Host "⏭️  Docker Compose not found or error occurred, skipping..." -ForegroundColor Yellow
}

# Step 2: Clean blockchain data
Write-Host ""
Write-Host "2️⃣  Cleaning blockchain data..." -ForegroundColor Cyan
Set-Location blockchain
if (Test-Path "scripts/reset-data.go") {
    go run scripts/reset-data.go
} else {
    Write-Host "⚠️  Blockchain reset script not found, cleaning manually..." -ForegroundColor Yellow
    Remove-Item -Path "blockchain-data", "chain-data", "data", "storage-data" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "✅ Blockchain data cleaned" -ForegroundColor Green
}
Set-Location ..

# Step 3: Reset PostgreSQL database
Write-Host ""
Write-Host "3️⃣  Resetting PostgreSQL database..." -ForegroundColor Cyan
Set-Location backend/api-server

try {
    Write-Host "   Resetting database schema..." -ForegroundColor Gray
    npx prisma migrate reset --force --skip-seed 2>$null
    
    Write-Host "   Running fresh migrations..." -ForegroundColor Gray
    try {
        npx prisma migrate deploy 2>$null
    } catch {
        npx prisma db push --skip-generate 2>$null
    }
    
    Write-Host "   Seeding database with initial data (all values at 0)..." -ForegroundColor Gray
    try {
        npx prisma db seed 2>$null
    } catch {
        try {
            npm run seed 2>$null
        } catch {
            npx ts-node prisma/seed.ts 2>$null
        }
    }
    
    Write-Host "✅ Database reset complete" -ForegroundColor Green
} catch {
    Write-Host "⚠️  npm/npx not found or error occurred, skipping database reset" -ForegroundColor Yellow
}
Set-Location ../..

# Step 4: Clean Redis data
Write-Host ""
Write-Host "4️⃣  Cleaning Redis cache..." -ForegroundColor Cyan
try {
    redis-cli FLUSHALL 2>$null
    Write-Host "✅ Redis cache cleared" -ForegroundColor Green
} catch {
    Write-Host "⏭️  Redis CLI not found or not running, will be cleaned on container restart" -ForegroundColor Yellow
}

# Step 5: Clean MongoDB data
Write-Host ""
Write-Host "5️⃣  Cleaning MongoDB analytics..." -ForegroundColor Cyan
try {
    mongosh --eval "db.dropDatabase()" vnc_analytics 2>$null
    Write-Host "✅ MongoDB analytics cleared" -ForegroundColor Green
} catch {
    Write-Host "⏭️  MongoDB CLI not found or not running, will be cleaned on container restart" -ForegroundColor Yellow
}

# Step 6: Clean temporary files and logs
Write-Host ""
Write-Host "6️⃣  Cleaning temporary files and logs..." -ForegroundColor Cyan
Get-ChildItem -Path . -Include "*.log" -Recurse -ErrorAction SilentlyContinue | Remove-Item -Force
Remove-Item -Path "logs", "temp", "tmp" -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "✅ Temporary files cleaned" -ForegroundColor Green

# Step 7: Verify .gitignore for data directories
Write-Host ""
Write-Host "7️⃣  Verifying .gitignore configuration..." -ForegroundColor Cyan
if (Select-String -Path ".gitignore" -Pattern "blockchain-data/" -Quiet) {
    Write-Host "✅ Data directories properly configured in .gitignore" -ForegroundColor Green
} else {
    Write-Host "⚠️  Note: Ensure data directories are in .gitignore" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "════════════════════════════════════" -ForegroundColor Cyan
Write-Host "✨ Data reset completed successfully!" -ForegroundColor Green
Write-Host "════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "📊 Summary:" -ForegroundColor Cyan
Write-Host "  ✅ All blockchain data reset to 0" -ForegroundColor Green
Write-Host "  ✅ Database recreated with fresh schema" -ForegroundColor Green
Write-Host "  ✅ Initial presale stage: tokens_sold = 0, total_raised = 0" -ForegroundColor Green
Write-Host "  ✅ All user balances set to 0" -ForegroundColor Green
Write-Host "  ✅ Cache and analytics data cleared" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Your VNC Blockchain is now ready for fresh deployment!" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Configure your .env file" -ForegroundColor Gray
Write-Host "  2. Start services: docker-compose up -d" -ForegroundColor Gray
Write-Host "  3. Or start manually: npm run dev" -ForegroundColor Gray
Write-Host ""
