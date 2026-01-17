# ============================================
# VNC Blockchain - cPanel Deployment Package Builder (Simple)
# ============================================

Write-Host " VNC Blockchain - cPanel Deployment Builder" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$PROJECT_ROOT = $PSScriptRoot
$DEPLOYMENT_DIR = Join-Path $PROJECT_ROOT "deployment"
$BACKEND_DIR = Join-Path $PROJECT_ROOT "backend\api-server"
$FRONTEND_DIR = Join-Path $PROJECT_ROOT "frontend\presale-platform"

# Clean deployment directory
if (Test-Path $DEPLOYMENT_DIR) {
    Write-Host " Cleaning old deployment files..." -ForegroundColor Yellow
    Remove-Item -Path $DEPLOYMENT_DIR -Recurse -Force
}

# Create deployment directories
Write-Host " Creating deployment directories..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "$DEPLOYMENT_DIR\backend" | Out-Null
New-Item -ItemType Directory -Force -Path "$DEPLOYMENT_DIR\frontend" | Out-Null

# ============================================
# BUILD BACKEND
# ============================================

Write-Host ""
Write-Host " Building Backend..." -ForegroundColor Cyan

# Check if backend exists
if (-not (Test-Path $BACKEND_DIR)) {
    Write-Host " Backend directory not found!" -ForegroundColor Red
    exit 1
}

Set-Location $BACKEND_DIR

# Install dependencies
Write-Host "   Installing dependencies (this may take a few minutes)..." -ForegroundColor Gray
npm ci --production 2>&1 | Out-Null

if ($LASTEXITCODE -ne 0) {
    Write-Host " npm install failed!" -ForegroundColor Red
    exit 1
}

# Build TypeScript
Write-Host "   Compiling TypeScript..." -ForegroundColor Gray
npm run build 2>&1 | Out-Null

if (-not (Test-Path "dist")) {
    Write-Host " Build failed! dist folder not found" -ForegroundColor Red
    exit 1
}

# Copy files to deployment
Write-Host "   Copying files..." -ForegroundColor Gray
Copy-Item -Path "dist" -Destination "$DEPLOYMENT_DIR\backend\dist" -Recurse
Copy-Item -Path "node_modules" -Destination "$DEPLOYMENT_DIR\backend\node_modules" -Recurse
Copy-Item -Path "prisma" -Destination "$DEPLOYMENT_DIR\backend\prisma" -Recurse
Copy-Item -Path "package.json" -Destination "$DEPLOYMENT_DIR\backend\"
Copy-Item -Path "package-lock.json" -Destination "$DEPLOYMENT_DIR\backend\"

# Create .env.example
Write-Host "    Creating .env.example..." -ForegroundColor Gray
$envContent = "NODE_ENV=production`nPORT=3000`nDATABASE_URL=postgresql://cpanel_username:password@localhost:5432/cpanel_databasename`nJWT_SECRET=CHANGE_THIS_TO_RANDOM_32_CHARACTERS`nJWT_EXPIRES_IN=7d`nENCRYPTION_KEY=CHANGE_THIS_TO_RANDOM_32_CHARACTERS`nFRONTEND_URL=https://yourdomain.com`nCASHFREE_APP_ID=your_production_app_id`nCASHFREE_SECRET_KEY=your_production_secret_key`nCASHFREE_API_VERSION=2023-08-01`nCASHFREE_MODE=production`nSMTP_HOST=mail.yourdomain.com`nSMTP_PORT=465`nSMTP_USER=noreply@yourdomain.com`nSMTP_PASSWORD=your_email_password`nFROM_EMAIL=noreply@yourdomain.com`n"
$envContent | Out-File -FilePath "$DEPLOYMENT_DIR\backend\.env.example" -Encoding UTF8

# Create README for backend
$backendReadme = "# VNC Blockchain Backend - cPanel Deployment`n`n## Quick Setup`n`n1. Upload all files to ~/nodejs-app/`n2. Copy .env.example to .env and update credentials`n3. In cPanel, go to Setup Node.js App`n4. Configure Node.js 20.x, app root: nodejs-app, startup: dist/server.js`n5. Add environment variables from .env`n6. Click Start`n`n## Database Migration`n`nSSH: cd ~/nodejs-app`nthen: npx prisma migrate deploy`n`n## See CPANEL_DEPLOYMENT.md for details`n"
$backendReadme | Out-File -FilePath "$DEPLOYMENT_DIR\backend\README.txt" -Encoding UTF8

Write-Host " Backend built successfully!" -ForegroundColor Green

# ============================================
# BUILD FRONTEND
# ============================================

Write-Host ""
Write-Host " Building Frontend..." -ForegroundColor Cyan

Set-Location $FRONTEND_DIR

# Check if frontend exists
if (-not (Test-Path $FRONTEND_DIR)) {
    Write-Host " Frontend directory not found!" -ForegroundColor Red
    exit 1
}

# Prompt for API URL
Write-Host ""
Write-Host " Enter your backend API URL:" -ForegroundColor Yellow
Write-Host "   Examples: https://api.yourdomain.com/api" -ForegroundColor Gray

if ($env:NEXT_PUBLIC_API_URL) {
    $API_URL = $env:NEXT_PUBLIC_API_URL
    Write-Host "   Using: $API_URL (from environment)" -ForegroundColor Gray
} else {
    $API_URL = Read-Host "API URL (press Enter for default)"
    if (-not $API_URL) {
        $API_URL = "https://api.yourdomain.com/api"
        Write-Host "   Using default: $API_URL" -ForegroundColor Gray
    }
}

# Set environment variable
$env:NEXT_PUBLIC_API_URL = $API_URL

# Install dependencies
Write-Host "   Installing dependencies (this may take a few minutes)..." -ForegroundColor Gray
npm ci 2>&1 | Out-Null

if ($LASTEXITCODE -ne 0) {
    Write-Host " npm install failed!" -ForegroundColor Red
    exit 1
}

# Build Next.js
Write-Host "   Building Next.js application..." -ForegroundColor Gray
npm run build 2>&1 | Out-Null

if (-not (Test-Path "out")) {
    Write-Host " Build failed! out folder not found" -ForegroundColor Red
    Write-Host "Make sure next.config.js has output: 'export'" -ForegroundColor Yellow
    exit 1
}

# Copy files to deployment
Write-Host "   Copying files..." -ForegroundColor Gray
Copy-Item -Path "out\*" -Destination "$DEPLOYMENT_DIR\frontend\" -Recurse

# Create .htaccess
Write-Host "    Creating .htaccess..." -ForegroundColor Gray
$htaccess = "RewriteEngine On`nRewriteCond %{HTTPS} off`nRewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]`nRewriteCond %{REQUEST_FILENAME} !-f`nRewriteCond %{REQUEST_FILENAME} !-d`nRewriteCond %{REQUEST_URI} !^/api/`nRewriteRule ^(.*)$ /index.html [L]`nOptions -Indexes`n"
$htaccess | Out-File -FilePath "$DEPLOYMENT_DIR\frontend\.htaccess" -Encoding UTF8

# Create README for frontend
$frontendReadme = "# VNC Blockchain Frontend - cPanel Deployment`n`n## Quick Setup`n`n1. Upload all files to public_html/`n2. Verify .htaccess is present`n3. Visit https://yourdomain.com`n`n## Troubleshooting`n`n- If showing directory listing, check .htaccess`n- Set file permissions: 644 for files, 755 for folders`n- Clear browser cache (Ctrl+F5)`n`n## See CPANEL_DEPLOYMENT.md for details`n"
$frontendReadme | Out-File -FilePath "$DEPLOYMENT_DIR\frontend\README.txt" -Encoding UTF8

Write-Host " Frontend built successfully!" -ForegroundColor Green

# ============================================
# CREATE DEPLOYMENT PACKAGES
# ============================================

Write-Host ""
Write-Host " Creating deployment packages..." -ForegroundColor Cyan

Set-Location $PROJECT_ROOT

# Create backend zip
Write-Host "  Creating backend-deploy.zip..." -ForegroundColor Gray
Compress-Archive -Path "$DEPLOYMENT_DIR\backend\*" -DestinationPath "$PROJECT_ROOT\backend-deploy.zip" -Force

# Create frontend zip
Write-Host "  Creating frontend-deploy.zip..." -ForegroundColor Gray
Compress-Archive -Path "$DEPLOYMENT_DIR\frontend\*" -DestinationPath "$PROJECT_ROOT\frontend-deploy.zip" -Force

# Get file sizes
$backendSize = [math]::Round((Get-Item "$PROJECT_ROOT\backend-deploy.zip").Length / 1MB, 2)
$frontendSize = [math]::Round((Get-Item "$PROJECT_ROOT\frontend-deploy.zip").Length / 1MB, 2)

Write-Host " Deployment packages created!" -ForegroundColor Green

# ============================================
# SUMMARY
# ============================================

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host " DEPLOYMENT PACKAGES READY!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host " Files Created:" -ForegroundColor Cyan
Write-Host "   backend-deploy.zip (${backendSize} MB)" -ForegroundColor White
Write-Host "   frontend-deploy.zip (${frontendSize} MB)" -ForegroundColor White
Write-Host ""
Write-Host " Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Purchase cPanel hosting (Hostinger: `$3.99/month recommended)" -ForegroundColor White
Write-Host "  2. Upload backend-deploy.zip to ~/nodejs-app/" -ForegroundColor White
Write-Host "  3. Upload frontend-deploy.zip to ~/public_html/" -ForegroundColor White
Write-Host "  4. Extract both ZIP files" -ForegroundColor White
Write-Host "  5. Follow CPANEL_DEPLOYMENT.md for configuration" -ForegroundColor White
Write-Host ""
Write-Host "Hosting Options:" -ForegroundColor Yellow
Write-Host "  Hostinger: 3.99/month - https://hostinger.com" -ForegroundColor White
Write-Host "  A2 Hosting: 10.99/month - https://a2hosting.com" -ForegroundColor White
Write-Host ""
Write-Host "Your API URL: $API_URL" -ForegroundColor Cyan
Write-Host ""
Write-Host "Good luck with your deployment!" -ForegroundColor Green
Write-Host ""
