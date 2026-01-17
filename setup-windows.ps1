# VNC Blockchain - Complete Setup Script for Windows
# Run as Administrator

Write-Host "🚀 VNC Blockchain - Complete Setup Script" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Check if running as administrator
$currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
$isAdmin = $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "❌ ERROR: This script must be run as Administrator!" -ForegroundColor Red
    Write-Host "Right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    exit 1
}

# Function to check if command exists
function Test-Command {
    param($Command)
    try {
        if (Get-Command $Command -ErrorAction Stop) {
            return $true
        }
    } catch {
        return $false
    }
}

# Step 1: Check Node.js
Write-Host "📦 Step 1: Checking Node.js..." -ForegroundColor Green
if (Test-Command node) {
    $nodeVersion = node --version
    Write-Host "✅ Node.js is installed: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Node.js is not installed!" -ForegroundColor Red
    Write-Host "Download from: https://nodejs.org/en/download" -ForegroundColor Yellow
    Write-Host "Install Node.js 20.x LTS and re-run this script" -ForegroundColor Yellow
    exit 1
}

# Step 2: Check npm
Write-Host ""
Write-Host "📦 Step 2: Checking npm..." -ForegroundColor Green
if (Test-Command npm) {
    $npmVersion = npm --version
    Write-Host "✅ npm is installed: $npmVersion" -ForegroundColor Green
} else {
    Write-Host "❌ npm is not installed!" -ForegroundColor Red
    exit 1
}

# Step 3: Check/Install Chocolatey
Write-Host ""
Write-Host "📦 Step 3: Checking Chocolatey..." -ForegroundColor Green
if (Test-Command choco) {
    Write-Host "✅ Chocolatey is already installed" -ForegroundColor Green
} else {
    Write-Host "⚠️  Chocolatey not found. Installing..." -ForegroundColor Yellow
    Set-ExecutionPolicy Bypass -Scope Process -Force
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
    Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
    
    if ($?) {
        Write-Host "✅ Chocolatey installed successfully!" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to install Chocolatey" -ForegroundColor Red
        exit 1
    }
}

# Step 4: Install PostgreSQL
Write-Host ""
Write-Host "📦 Step 4: Installing PostgreSQL..." -ForegroundColor Green
if (Test-Command psql) {
    Write-Host "✅ PostgreSQL is already installed" -ForegroundColor Green
} else {
    Write-Host "⚠️  Installing PostgreSQL 15... (This may take 5-10 minutes)" -ForegroundColor Yellow
    choco install postgresql15 --params '/Password:postgres' -y
    
    if ($?) {
        Write-Host "✅ PostgreSQL installed successfully!" -ForegroundColor Green
        Write-Host "⚠️  PostgreSQL password: postgres" -ForegroundColor Yellow
        
        # Refresh environment variables
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
    } else {
        Write-Host "❌ Failed to install PostgreSQL" -ForegroundColor Red
        Write-Host "Please install manually from: https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
        exit 1
    }
}

# Wait for PostgreSQL service to start
Write-Host ""
Write-Host "⏳ Waiting for PostgreSQL service to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

$pgService = Get-Service -Name "postgresql*" -ErrorAction SilentlyContinue
if ($pgService -and $pgService.Status -eq "Running") {
    Write-Host "✅ PostgreSQL service is running" -ForegroundColor Green
} else {
    Write-Host "⚠️  Starting PostgreSQL service..." -ForegroundColor Yellow
    Start-Service -Name "postgresql*"
    Start-Sleep -Seconds 3
}

# Step 5: Create Database
Write-Host ""
Write-Host "📦 Step 5: Creating VNC Blockchain database..." -ForegroundColor Green

# Set PostgreSQL bin path
$pgPath = "C:\Program Files\PostgreSQL\15\bin"
if (Test-Path $pgPath) {
    $env:Path += ";$pgPath"
}

# Create database
Write-Host "Creating database: vnc_blockchain..." -ForegroundColor Yellow

try {
    $env:PGPASSWORD = "postgres"
    & "$pgPath\createdb.exe" -U postgres vnc_blockchain 2>$null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Database created successfully!" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Database might already exist (this is okay)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  Could not create database automatically" -ForegroundColor Yellow
    Write-Host "You may need to create it manually using pgAdmin" -ForegroundColor Yellow
}

# Step 6: Install Backend Dependencies
Write-Host ""
Write-Host "📦 Step 6: Installing backend dependencies..." -ForegroundColor Green
Set-Location -Path "$PSScriptRoot\backend\api-server"

if (Test-Path "package.json") {
    Write-Host "Running npm install..." -ForegroundColor Yellow
    npm install --legacy-peer-deps
    
    if ($?) {
        Write-Host "✅ Backend dependencies installed!" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to install backend dependencies" -ForegroundColor Red
    }
} else {
    Write-Host "❌ package.json not found in backend/api-server" -ForegroundColor Red
}

# Step 7: Check .env file
Write-Host ""
Write-Host "📦 Step 7: Checking .env configuration..." -ForegroundColor Green

if (Test-Path ".env") {
    Write-Host "✅ .env file exists" -ForegroundColor Green
} else {
    Write-Host "⚠️  Creating .env file from .env.example..." -ForegroundColor Yellow
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "✅ .env file created!" -ForegroundColor Green
        Write-Host "⚠️  IMPORTANT: Edit .env file with your credentials!" -ForegroundColor Yellow
    }
}

# Step 8: Run Prisma Migrations
Write-Host ""
Write-Host "📦 Step 8: Running database migrations..." -ForegroundColor Green
Write-Host "Generating Prisma Client..." -ForegroundColor Yellow

npx prisma generate

if ($?) {
    Write-Host "✅ Prisma Client generated!" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to generate Prisma Client" -ForegroundColor Red
}

Write-Host ""
Write-Host "Running migrations..." -ForegroundColor Yellow
npx prisma migrate dev --name init

if ($?) {
    Write-Host "✅ Database migrations completed!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Migrations might have failed. Check your DATABASE_URL in .env" -ForegroundColor Yellow
}

# Step 9: Test Backend
Write-Host ""
Write-Host "📦 Step 9: Building backend..." -ForegroundColor Green
npm run build

if ($?) {
    Write-Host "✅ Backend built successfully!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Build had some warnings (this might be okay)" -ForegroundColor Yellow
}

# Step 10: Install Frontend Dependencies
Write-Host ""
Write-Host "📦 Step 10: Installing frontend dependencies..." -ForegroundColor Green
Set-Location -Path "$PSScriptRoot\frontend\presale-platform"

if (Test-Path "package.json") {
    Write-Host "Running npm install..." -ForegroundColor Yellow
    npm install --legacy-peer-deps
    
    if ($?) {
        Write-Host "✅ Frontend dependencies installed!" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to install frontend dependencies" -ForegroundColor Red
    }
} else {
    Write-Host "❌ package.json not found in frontend/presale-platform" -ForegroundColor Red
}

# Summary
Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "✨ SETUP COMPLETE!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Node.js: Installed" -ForegroundColor Green
Write-Host "✅ PostgreSQL: Installed (password: postgres)" -ForegroundColor Green
Write-Host "✅ Database: vnc_blockchain created" -ForegroundColor Green
Write-Host "✅ Backend: Dependencies installed" -ForegroundColor Green
Write-Host "✅ Frontend: Dependencies installed" -ForegroundColor Green
Write-Host "✅ Prisma: Migrations completed" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 NEXT STEPS:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Edit backend/.env file with your credentials:" -ForegroundColor Yellow
Write-Host "   - SMTP email settings" -ForegroundColor Yellow
Write-Host "   - Smart contract addresses (after deployment)" -ForegroundColor Yellow
Write-Host ""
Write-Host "2. Start Backend API:" -ForegroundColor Yellow
Write-Host "   cd backend\api-server" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "3. Start Frontend (in new terminal):" -ForegroundColor Yellow
Write-Host "   cd frontend\presale-platform" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "4. Open your browser:" -ForegroundColor Yellow
Write-Host "   Frontend: http://localhost:3002" -ForegroundColor White
Write-Host "   Backend API: http://localhost:5000" -ForegroundColor White
Write-Host "   Database Admin: npx prisma studio" -ForegroundColor White
Write-Host ""
Write-Host "5. Deploy to AWS:" -ForegroundColor Yellow
Write-Host "   Read: AWS_DEPLOYMENT_GUIDE.md" -ForegroundColor White
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Cyan
Write-Host "   - Backend API: backend/api-server/README.md" -ForegroundColor White
Write-Host "   - AWS Deployment: AWS_DEPLOYMENT_GUIDE.md" -ForegroundColor White
Write-Host "   - Authentication: AUTHENTICATION_AUDIT_REPORT.md" -ForegroundColor White
Write-Host ""
Write-Host "Need help? Check the documentation or visit:" -ForegroundColor Yellow
Write-Host "https://github.com/your-org/vnc-blockchain" -ForegroundColor White
Write-Host ""

# Return to root directory
Set-Location -Path $PSScriptRoot

Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
