# VNC-20 Blockchain - Quick Start Script for Windows
# Run this script in PowerShell as Administrator

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  VNC-20 Blockchain Setup Wizard" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if running as Administrator
$currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
$isAdmin = $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "⚠️  This script should be run as Administrator for best results" -ForegroundColor Yellow
    Write-Host "   Right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    Write-Host ""
}

# Function to check if a command exists
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

# Check prerequisites
Write-Host "🔍 Checking prerequisites..." -ForegroundColor Yellow
Write-Host ""

$allGood = $true

# Check Node.js
if (Test-Command "node") {
    $nodeVersion = node --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Node.js not found" -ForegroundColor Red
    Write-Host "   Download from: https://nodejs.org/" -ForegroundColor Yellow
    $allGood = $false
}

# Check npm
if (Test-Command "npm") {
    $npmVersion = npm --version
    Write-Host "✅ npm: v$npmVersion" -ForegroundColor Green
} else {
    Write-Host "❌ npm not found" -ForegroundColor Red
    $allGood = $false
}

# Check Git
if (Test-Command "git") {
    $gitVersion = git --version
    Write-Host "✅ Git: $gitVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Git not found" -ForegroundColor Red
    Write-Host "   Download from: https://git-scm.com/" -ForegroundColor Yellow
    $allGood = $false
}

# Check Docker
if (Test-Command "docker") {
    Write-Host "✅ Docker installed" -ForegroundColor Green
} else {
    Write-Host "⚠️  Docker not found (optional but recommended)" -ForegroundColor Yellow
    Write-Host "   Download Docker Desktop: https://www.docker.com/products/docker-desktop/" -ForegroundColor Yellow
}

Write-Host ""

if (-not $allGood) {
    Write-Host "❌ Please install missing prerequisites before continuing" -ForegroundColor Red
    Write-Host "   See INSTALLATION.md for detailed instructions" -ForegroundColor Yellow
    exit 1
}

# Ask user what they want to set up
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  What would you like to set up?" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Complete Setup (All dashboards + Docker)" -ForegroundColor White
Write-Host "2. Frontend Only (Public Website + Wallets)" -ForegroundColor White
Write-Host "3. Backend Only (API + Services)" -ForegroundColor White
Write-Host "4. Public Website Only (Quickest)" -ForegroundColor White
Write-Host "5. Just install dependencies" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter your choice (1-5)"

Write-Host ""
Write-Host "🚀 Starting setup..." -ForegroundColor Yellow
Write-Host ""

# Setup .env file if it doesn't exist
if (-not (Test-Path ".env")) {
    Write-Host "📝 Creating .env file..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✅ .env file created. Please update it with your configuration." -ForegroundColor Green
    Write-Host ""
}

switch ($choice) {
    "1" {
        # Complete setup
        Write-Host "📦 Installing all dependencies..." -ForegroundColor Yellow
        npm install
        
        Write-Host ""
        Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
        
        $frontendProjects = @("public-website", "user-wallet", "developer-portal", "validator-dashboard", "governance-portal", "admin-dashboard")
        foreach ($project in $frontendProjects) {
            Write-Host "   - $project" -ForegroundColor Cyan
            Set-Location "frontend\$project"
            npm install --silent
            Set-Location "..\..\"
        }
        
        Write-Host ""
        Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
        
        $backendProjects = @("api-gateway", "rpc-server", "indexer", "websocket-server")
        foreach ($project in $backendProjects) {
            Write-Host "   - $project" -ForegroundColor Cyan
            Set-Location "backend\$project"
            npm install --silent
            Set-Location "..\..\"
        }
        
        if (Test-Command "docker") {
            Write-Host ""
            Write-Host "🐳 Starting Docker services..." -ForegroundColor Yellow
            docker-compose up -d
            Write-Host "✅ Docker services started" -ForegroundColor Green
        }
        
        Write-Host ""
        Write-Host "✅ Complete setup finished!" -ForegroundColor Green
        Write-Host ""
        Write-Host "🎉 To start all services, run:" -ForegroundColor Cyan
        Write-Host "   npm run dev" -ForegroundColor White
    }
    
    "2" {
        # Frontend only
        Write-Host "📦 Installing root dependencies..." -ForegroundColor Yellow
        npm install
        
        Write-Host ""
        Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
        
        $frontendProjects = @("public-website", "user-wallet", "developer-portal", "validator-dashboard", "governance-portal")
        foreach ($project in $frontendProjects) {
            Write-Host "   - $project" -ForegroundColor Cyan
            Set-Location "frontend\$project"
            npm install --silent
            Set-Location "..\..\"
        }
        
        Write-Host ""
        Write-Host "✅ Frontend setup finished!" -ForegroundColor Green
        Write-Host ""
        Write-Host "🎉 To start frontend services, run:" -ForegroundColor Cyan
        Write-Host "   npm run dev:public    # Public website" -ForegroundColor White
        Write-Host "   npm run dev:wallet    # User wallet" -ForegroundColor White
    }
    
    "3" {
        # Backend only
        Write-Host "📦 Installing root dependencies..." -ForegroundColor Yellow
        npm install
        
        Write-Host ""
        Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
        
        $backendProjects = @("api-gateway", "rpc-server", "indexer", "websocket-server")
        foreach ($project in $backendProjects) {
            Write-Host "   - $project" -ForegroundColor Cyan
            Set-Location "backend\$project"
            npm install --silent
            Set-Location "..\..\"
        }
        
        if (Test-Command "docker") {
            Write-Host ""
            Write-Host "🐳 Starting Docker services..." -ForegroundColor Yellow
            docker-compose up -d postgres redis mongodb
            Write-Host "✅ Docker databases started" -ForegroundColor Green
        }
        
        Write-Host ""
        Write-Host "✅ Backend setup finished!" -ForegroundColor Green
        Write-Host ""
        Write-Host "🎉 To start backend services, run:" -ForegroundColor Cyan
        Write-Host "   npm run dev:api    # API Gateway" -ForegroundColor White
    }
    
    "4" {
        # Public website only
        Write-Host "📦 Installing root dependencies..." -ForegroundColor Yellow
        npm install
        
        Write-Host ""
        Write-Host "📦 Installing public website dependencies..." -ForegroundColor Yellow
        Set-Location "frontend\public-website"
        npm install
        Set-Location "..\..\"
        
        Write-Host ""
        Write-Host "✅ Public website setup finished!" -ForegroundColor Green
        Write-Host ""
        Write-Host "🎉 To start the public website, run:" -ForegroundColor Cyan
        Write-Host "   npm run dev:public" -ForegroundColor White
        Write-Host ""
        Write-Host "   Then open: http://localhost:3001" -ForegroundColor Cyan
    }
    
    "5" {
        # Just install dependencies
        Write-Host "📦 Installing root dependencies..." -ForegroundColor Yellow
        npm install
        
        Write-Host ""
        Write-Host "✅ Root dependencies installed!" -ForegroundColor Green
        Write-Host ""
        Write-Host "To install specific workspaces, navigate to their folder and run 'npm install'" -ForegroundColor Yellow
    }
    
    default {
        Write-Host "❌ Invalid choice" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Setup Complete! 🎉" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📚 Next steps:" -ForegroundColor Yellow
Write-Host "   1. Update .env file with your configuration" -ForegroundColor White
Write-Host "   2. Read INSTALLATION.md for detailed instructions" -ForegroundColor White
Write-Host "   3. Run 'npm run dev' to start all services" -ForegroundColor White
Write-Host ""
Write-Host "🆘 Need help?" -ForegroundColor Yellow
Write-Host "   - Documentation: https://docs.vnc20.io" -ForegroundColor White
Write-Host "   - Discord: https://discord.gg/vnc20" -ForegroundColor White
Write-Host ""
