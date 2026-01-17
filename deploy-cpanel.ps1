# ============================================
# VNC Blockchain - cPanel Deployment Package Builder
# ============================================

Write-Host "🚀 VNC Blockchain - cPanel Deployment Builder" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$PROJECT_ROOT = $PSScriptRoot
$DEPLOYMENT_DIR = Join-Path $PROJECT_ROOT "deployment"
$BACKEND_DIR = Join-Path $PROJECT_ROOT "backend\api-server"
$FRONTEND_DIR = Join-Path $PROJECT_ROOT "frontend\presale-platform"

# Clean deployment directory
if (Test-Path $DEPLOYMENT_DIR) {
    Write-Host "🧹 Cleaning old deployment files..." -ForegroundColor Yellow
    Remove-Item -Path $DEPLOYMENT_DIR -Recurse -Force
}

# Create deployment directories
Write-Host "📁 Creating deployment directories..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "$DEPLOYMENT_DIR\backend" | Out-Null
New-Item -ItemType Directory -Force -Path "$DEPLOYMENT_DIR\frontend" | Out-Null

# ============================================
# BUILD BACKEND
# ============================================

Write-Host ""
Write-Host "🔨 Building Backend..." -ForegroundColor Cyan

# Check if backend exists
if (-not (Test-Path $BACKEND_DIR)) {
    Write-Host "❌ Backend directory not found!" -ForegroundColor Red
    exit 1
}

Set-Location $BACKEND_DIR

# Install dependencies
Write-Host "  📦 Installing dependencies..." -ForegroundColor Gray
npm ci --production 2>&1 | Out-Null

# Build TypeScript
Write-Host "  🔧 Compiling TypeScript..." -ForegroundColor Gray
npm run build

if (-not (Test-Path "dist")) {
    Write-Host "❌ Build failed! dist folder not found" -ForegroundColor Red
    exit 1
}

# Copy files to deployment
Write-Host "  📋 Copying files..." -ForegroundColor Gray
Copy-Item -Path "dist" -Destination "$DEPLOYMENT_DIR\backend\dist" -Recurse
Copy-Item -Path "node_modules" -Destination "$DEPLOYMENT_DIR\backend\node_modules" -Recurse
Copy-Item -Path "prisma" -Destination "$DEPLOYMENT_DIR\backend\prisma" -Recurse
Copy-Item -Path "package.json" -Destination "$DEPLOYMENT_DIR\backend\"
Copy-Item -Path "package-lock.json" -Destination "$DEPLOYMENT_DIR\backend\"

# Create .env.example
Write-Host "  ⚙️  Creating .env.example..." -ForegroundColor Gray
@"
# Production Environment Variables
# COPY THIS FILE TO .env AND UPDATE WITH YOUR CREDENTIALS

NODE_ENV=production
PORT=3000

# Database (Get from cPanel PostgreSQL)
DATABASE_URL=postgresql://cpanel_username:password@localhost:5432/cpanel_databasename

# JWT Configuration (Generate random 32 character strings)
JWT_SECRET=CHANGE_THIS_TO_RANDOM_32_CHARACTERS
JWT_EXPIRES_IN=7d

# Encryption (Generate random 32 character string)
ENCRYPTION_KEY=CHANGE_THIS_TO_RANDOM_32_CHARACTERS

# Frontend URL
FRONTEND_URL=https://yourdomain.com

# Cashfree Production Credentials
CASHFREE_APP_ID=your_production_app_id
CASHFREE_SECRET_KEY=your_production_secret_key
CASHFREE_API_VERSION=2023-08-01
CASHFREE_MODE=production

# Email Configuration (Use cPanel email or SendGrid)
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=noreply@yourdomain.com
SMTP_PASSWORD=your_email_password
FROM_EMAIL=noreply@yourdomain.com
FROM_NAME=VNC Blockchain

# OR Use SendGrid
# SENDGRID_API_KEY=your_sendgrid_api_key

# Blockchain (Production)
ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID
CONTRACT_ADDRESS=0xYOUR_DEPLOYED_CONTRACT_ADDRESS
PRIVATE_KEY=0xYOUR_PRIVATE_KEY
BLOCKCHAIN_NETWORK=mainnet
"@ | Out-File -FilePath "$DEPLOYMENT_DIR\backend\.env.example" -Encoding UTF8

# Create README for backend
$backendReadme = @"
# VNC Blockchain Backend - cPanel Deployment

## Quick Setup

1. Upload all files to ~/nodejs-app/ on your server
2. Copy .env.example to .env and update credentials
3. In cPanel, go to Setup Node.js App
4. Configure:
   - Node version: 20.x
   - Application root: nodejs-app
   - Startup file: dist/server.js
   - Environment variables: Copy from .env
5. Click Start

## Database Migration

SSH into your server and run:

\`\`\`bash
cd ~/nodejs-app
npx prisma migrate deploy
npx prisma db seed
\`\`\`

## Troubleshooting

Check logs:
\`\`\`bash
cd ~/nodejs-app
tail -f logs/error.log
\`\`\`

Restart app:
- cPanel → Setup Node.js App → Restart

## Support

See CPANEL_DEPLOYMENT.md for detailed instructions.
"@
$backendReadme | Out-File -FilePath "$DEPLOYMENT_DIR\backend\README.md" -Encoding UTF8

Write-Host "✅ Backend built successfully!" -ForegroundColor Green

# ============================================
# BUILD FRONTEND
# ============================================

Write-Host ""
Write-Host "🔨 Building Frontend..." -ForegroundColor Cyan

Set-Location $FRONTEND_DIR

# Check if frontend exists
if (-not (Test-Path $FRONTEND_DIR)) {
    Write-Host "❌ Frontend directory not found!" -ForegroundColor Red
    exit 1
}

# Prompt for API URL
Write-Host ""
Write-Host "📝 Enter your backend API URL:" -ForegroundColor Yellow
Write-Host "   Examples:" -ForegroundColor Gray
Write-Host "   - https://api.yourdomain.com/api" -ForegroundColor Gray
Write-Host "   - https://yourdomain.com/api" -ForegroundColor Gray
$API_URL = Read-Host "API URL"

if (-not $API_URL) {
    $API_URL = "https://api.yourdomain.com/api"
    Write-Host "   Using default: $API_URL" -ForegroundColor Gray
}

# Set environment variable
$env:NEXT_PUBLIC_API_URL = $API_URL

# Install dependencies
Write-Host "  📦 Installing dependencies..." -ForegroundColor Gray
npm ci 2>&1 | Out-Null

# Build Next.js
Write-Host "  🔧 Building Next.js application..." -ForegroundColor Gray
npm run build

if (-not (Test-Path "out")) {
    Write-Host "❌ Build failed! out folder not found" -ForegroundColor Red
    Write-Host "Make sure next.config.js has output: 'export'" -ForegroundColor Yellow
    exit 1
}

# Copy files to deployment
Write-Host "  📋 Copying files..." -ForegroundColor Gray
Copy-Item -Path "out\*" -Destination "$DEPLOYMENT_DIR\frontend\" -Recurse

# Create .htaccess
Write-Host "  ⚙️  Creating .htaccess..." -ForegroundColor Gray
@"
# VNC Blockchain - cPanel Configuration

# Enable Rewrite Engine
RewriteEngine On

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Handle Next.js static export routing
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/api/
RewriteRule ^(.*)$ /index.html [L]

# Security Headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    Header always set Permissions-Policy "geolocation=(), microphone=(), camera=()"
</IfModule>

# Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Browser Caching
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType application/json "access plus 1 hour"
    ExpiresByType text/html "access plus 1 hour"
</IfModule>

# Disable directory listing
Options -Indexes

# Protect sensitive files
<FilesMatch "(^\.env|^\.git|package\.json)">
    Order allow,deny
    Deny from all
</FilesMatch>
"@ | Out-File -FilePath "$DEPLOYMENT_DIR\frontend\.htaccess" -Encoding UTF8

# Create README for frontend
$frontendReadme = @"
# VNC Blockchain Frontend - cPanel Deployment

## Quick Setup

1. Upload all files to public_html/ on your server
2. Verify .htaccess is present
3. Visit https://yourdomain.com

## File Structure

All files should be in the root of public_html:
- index.html (main entry point)
- _next/ (Next.js assets)
- *.html (route pages)
- .htaccess (Apache configuration)

## Verification

1. Visit https://yourdomain.com
2. Check browser console for errors
3. Test all pages load correctly
4. Verify API calls work (check Network tab)

## Troubleshooting

### Page shows directory listing
- Make sure .htaccess is present
- Check file permissions: 644 for files, 755 for folders

### 404 errors on routes
- Verify .htaccess has correct rewrite rules
- Clear browser cache (Ctrl+F5)

### API calls failing
- Check NEXT_PUBLIC_API_URL in browser console
- Verify backend is running
- Check CORS settings in backend

## Support

See CPANEL_DEPLOYMENT.md for detailed instructions.
"@
$frontendReadme | Out-File -FilePath "$DEPLOYMENT_DIR\frontend\README.md" -Encoding UTF8

Write-Host "✅ Frontend built successfully!" -ForegroundColor Green

# ============================================
# CREATE DEPLOYMENT PACKAGES
# ============================================

Write-Host ""
Write-Host "📦 Creating deployment packages..." -ForegroundColor Cyan

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

Write-Host "✅ Deployment packages created!" -ForegroundColor Green

# ============================================
# CREATE DEPLOYMENT CHECKLIST
# ============================================

Write-Host ""
Write-Host "📋 Creating deployment checklist..." -ForegroundColor Cyan

@"
# 🚀 cPanel Deployment Checklist

## Deployment Packages Created

✅ backend-deploy.zip (${backendSize} MB)
✅ frontend-deploy.zip (${frontendSize} MB)

---

## Step-by-Step Deployment

### PHASE 1: Prepare Server (15 minutes)

- [ ] Purchase cPanel hosting (recommended: Hostinger $3.99/month)
- [ ] Access cPanel (https://yourdomain.com:2083)
- [ ] Note your credentials:
  - [ ] cPanel username: _______________
  - [ ] cPanel password: _______________
  - [ ] Server IP: _______________
  - [ ] Domain: _______________

### PHASE 2: Database Setup (10 minutes)

- [ ] cPanel → PostgreSQL Databases
- [ ] Create database: vnc_blockchain
  - Full name: cpanel_username_vnc_blockchain
- [ ] Create user: vnc_user
  - Password: _________________________
- [ ] Add user to database (ALL PRIVILEGES)
- [ ] Note connection string:
  ```
  postgresql://cpanel_username_vnc_user:PASSWORD@localhost:5432/cpanel_username_vnc_blockchain
  ```

### PHASE 3: Backend Deployment (20 minutes)

- [ ] cPanel → File Manager
- [ ] Create folder: ~/nodejs-app
- [ ] Upload backend-deploy.zip to nodejs-app
- [ ] Extract zip file
- [ ] Delete zip file after extraction
- [ ] Copy .env.example to .env
- [ ] Edit .env file with your credentials:
  - [ ] DATABASE_URL (from Phase 2)
  - [ ] JWT_SECRET (random 32 chars)
  - [ ] ENCRYPTION_KEY (random 32 chars)
  - [ ] FRONTEND_URL (https://yourdomain.com)
  - [ ] CASHFREE credentials
  - [ ] Email settings

- [ ] cPanel → Setup Node.js App
- [ ] Create application:
  - Node.js version: 20.x
  - Application mode: Production
  - Application root: nodejs-app
  - Startup file: dist/server.js
- [ ] Add environment variables from .env
- [ ] Click "Create"
- [ ] Note assigned port: _______________

- [ ] Run database migrations via SSH:
  ```bash
  ssh username@yourdomain.com
  cd ~/nodejs-app
  npx prisma migrate deploy
  npx prisma db seed
  ```

- [ ] Restart Node.js app in cPanel
- [ ] Check status: Should show "Running"

### PHASE 4: API Subdomain Setup (10 minutes)

- [ ] cPanel → Subdomains
- [ ] Create subdomain: api
  - Subdomain: api
  - Document root: public_html/api
- [ ] Create .htaccess in public_html/api:
  ```apache
  RewriteEngine On
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^(.*)$ http://localhost:PORT/$1 [P,L]
  ```
  (Replace PORT with your Node.js app port)

### PHASE 5: Frontend Deployment (15 minutes)

- [ ] cPanel → File Manager
- [ ] Navigate to public_html
- [ ] Delete default index.html
- [ ] Upload frontend-deploy.zip
- [ ] Extract zip file
- [ ] Delete zip file after extraction
- [ ] Verify .htaccess is present
- [ ] Set file permissions:
  - Files: 644
  - Folders: 755

### PHASE 6: SSL Certificate (5 minutes)

- [ ] cPanel → SSL/TLS Status
- [ ] Run AutoSSL for all domains
- [ ] Wait 1-2 minutes
- [ ] Verify all domains show "Secure"
- [ ] Test HTTPS: https://yourdomain.com

### PHASE 7: Email Configuration (10 minutes)

- [ ] cPanel → Email Accounts
- [ ] Create email: noreply@yourdomain.com
  - Password: _________________________
- [ ] Note SMTP settings:
  - Host: mail.yourdomain.com
  - Port: 465 (SSL) or 587 (TLS)
  - Username: noreply@yourdomain.com
- [ ] Update backend .env with SMTP settings
- [ ] Restart Node.js app

### PHASE 8: Testing (15 minutes)

- [ ] Backend API:
  - [ ] https://api.yourdomain.com/health → Should return OK
  - [ ] Test signup endpoint
  - [ ] Test login endpoint

- [ ] Frontend:
  - [ ] https://yourdomain.com → Loads correctly
  - [ ] All pages accessible
  - [ ] No console errors
  - [ ] API calls working

- [ ] User Flow:
  - [ ] Signup works
  - [ ] Email received
  - [ ] Login works
  - [ ] Dashboard loads
  - [ ] Payment flow works (test mode)
  - [ ] 2FA works

### PHASE 9: Production Configuration (15 minutes)

- [ ] Update Cashfree to production mode
- [ ] Deploy smart contracts to mainnet
- [ ] Update contract addresses in backend .env
- [ ] Restart backend
- [ ] Test payment with real card (small amount)
- [ ] Set up cron jobs:
  - [ ] Database backup (daily 2 AM)
  - [ ] Log cleanup (daily 3 AM)

### PHASE 10: Monitoring (10 minutes)

- [ ] Sign up for UptimeRobot (free)
- [ ] Add monitors:
  - [ ] https://yourdomain.com
  - [ ] https://api.yourdomain.com/health
- [ ] Set up email alerts
- [ ] Monitor logs for first 24 hours

---

## Post-Deployment

### Immediate (First 24 Hours)

- [ ] Monitor error logs continuously
- [ ] Test from multiple devices
- [ ] Check mobile responsiveness
- [ ] Verify email delivery
- [ ] Monitor server resources (CPU/RAM)
- [ ] Be available for user support

### First Week

- [ ] Gather user feedback
- [ ] Fix any reported bugs
- [ ] Optimize performance based on metrics
- [ ] Review security logs
- [ ] Check backup integrity

### Ongoing

- [ ] Daily: Check application is running
- [ ] Weekly: Review logs and resource usage
- [ ] Monthly: Update dependencies, review backups
- [ ] Quarterly: Security audit, performance optimization

---

## Credentials Sheet

### Hosting
- Provider: _______________
- Username: _______________
- Password: _______________
- Server IP: _______________

### Domain
- Domain: _______________
- Registrar: _______________
- Nameservers: _______________

### Database
- Database: cpanel_username_vnc_blockchain
- User: cpanel_username_vnc_user
- Password: _______________
- Connection: _______________

### Email
- Email: noreply@yourdomain.com
- Password: _______________
- SMTP Host: mail.yourdomain.com

### API Keys
- Cashfree App ID: _______________
- Cashfree Secret: _______________
- SendGrid API Key: _______________
- Infura Project ID: _______________

### Blockchain
- Network: mainnet
- Contract Address: _______________
- Private Key: _______________

### Security
- JWT Secret: _______________
- Encryption Key: _______________

---

## Support Contacts

- Hosting Support: _______________
- Domain Support: _______________
- Emergency Contact: _______________

---

## Backup Information

- Backup Location: ~/backups/
- Backup Schedule: Daily 2 AM
- Retention: 7 days
- Last Backup: _______________

---

**Deployment Date**: _______________
**Deployed By**: _______________
**Go-Live Date**: _______________

---

🎉 **Good luck with your deployment!**

For detailed instructions, see:
- CPANEL_DEPLOYMENT.md (complete guide)
- backend/README.md (backend specific)
- frontend/README.md (frontend specific)
"@ | Out-File -FilePath "$PROJECT_ROOT\DEPLOYMENT_CHECKLIST.md" -Encoding UTF8

Write-Host "✅ Deployment checklist created!" -ForegroundColor Green

# ============================================
# SUMMARY
# ============================================

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "🎉 DEPLOYMENT PACKAGES READY!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "📦 Files Created:" -ForegroundColor Cyan
Write-Host "  ✅ backend-deploy.zip (${backendSize} MB)" -ForegroundColor White
Write-Host "  ✅ frontend-deploy.zip (${frontendSize} MB)" -ForegroundColor White
Write-Host "  ✅ DEPLOYMENT_CHECKLIST.md" -ForegroundColor White
Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Read CPANEL_DEPLOYMENT.md for complete guide" -ForegroundColor White
Write-Host "  2. Follow DEPLOYMENT_CHECKLIST.md step-by-step" -ForegroundColor White
Write-Host "  3. Upload backend-deploy.zip to ~/nodejs-app/" -ForegroundColor White
Write-Host "  4. Upload frontend-deploy.zip to ~/public_html/" -ForegroundColor White
Write-Host "  5. Configure database and environment variables" -ForegroundColor White
Write-Host ""
Write-Host "💰 Recommended Hosting:" -ForegroundColor Yellow
Write-Host "  Hostinger: $3.99/month - https://hostinger.com" -ForegroundColor White
Write-Host "  A2 Hosting: $10.99/month - https://a2hosting.com" -ForegroundColor White
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Yellow
Write-Host "  CPANEL_DEPLOYMENT.md - Complete deployment guide" -ForegroundColor White
Write-Host "  DEPLOYMENT_CHECKLIST.md - Step-by-step checklist" -ForegroundColor White
Write-Host "  deployment/backend/README.md - Backend setup" -ForegroundColor White
Write-Host "  deployment/frontend/README.md - Frontend setup" -ForegroundColor White
Write-Host ""
Write-Host "🎯 Deployment Time: ~1-2 hours" -ForegroundColor Cyan
Write-Host "💵 Monthly Cost: $3.99-14.99" -ForegroundColor Cyan
Write-Host ""
Write-Host "Good luck with your deployment! 🚀" -ForegroundColor Green
Write-Host ""
