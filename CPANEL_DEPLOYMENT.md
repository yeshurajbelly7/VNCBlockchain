# 🚀 cPanel Server Deployment Guide
## VNC Blockchain Presale Platform

Complete guide to deploy your full-stack application on any cPanel hosting server.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Requirements](#requirements)
3. [Cost Comparison](#cost-comparison)
4. [Quick Deployment Steps](#quick-deployment-steps)
5. [Backend Setup](#backend-setup)
6. [Frontend Setup](#frontend-setup)
7. [Database Configuration](#database-configuration)
8. [SSL Certificate](#ssl-certificate)
9. [Domain Configuration](#domain-configuration)
10. [Post-Deployment](#post-deployment)
11. [Troubleshooting](#troubleshooting)

---

## 🏗️ Overview

### Architecture on cPanel

```
┌─────────────────────────────────────────────────────┐
│                  cPanel Server                       │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────────────┐      ┌──────────────────┐    │
│  │   public_html/   │      │  Node.js App     │    │
│  │   (Frontend)     │◄────►│  (Backend API)   │    │
│  │                  │      │  Port: 3000      │    │
│  └──────────────────┘      └────────┬─────────┘    │
│           │                          │               │
│           │                          │               │
│  ┌────────▼──────────────────────────▼──────┐      │
│  │        PostgreSQL Database               │      │
│  │        (via cPanel)                      │      │
│  └──────────────────────────────────────────┘      │
│                                                      │
│  Additional Features:                               │
│  • SSL Certificate (Let's Encrypt - Free)          │
│  • Email Accounts (Nodemailer)                     │
│  • File Manager (Upload/Download)                  │
│  • Cron Jobs (Scheduled Tasks)                     │
│  • .htaccess (URL Rewriting)                       │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### Benefits of cPanel Hosting

✅ **Easy to Use** - User-friendly control panel
✅ **Low Cost** - $3-20/month (much cheaper than cloud)
✅ **One-Click SSL** - Free Let's Encrypt certificates
✅ **Email Included** - Professional email accounts
✅ **File Manager** - Upload files via web interface
✅ **Database GUI** - phpMyAdmin for PostgreSQL
✅ **No Technical Skills Required** - Click-based setup
✅ **24/7 Support** - Most providers include support

---

## 📦 Requirements

### Server Requirements

**Minimum:**
- cPanel/WHM version 11.100+
- Node.js 18.x or higher
- PostgreSQL 14+ or MySQL 8+
- 2GB RAM minimum
- 20GB SSD storage
- SSL support

**Recommended Hosting Providers:**
1. **Hostinger** - $3.99/month (Best value)
2. **A2 Hosting** - $10.99/month (Fastest)
3. **InMotion** - $6.99/month (Best support)
4. **SiteGround** - $14.99/month (Premium)
5. **Bluehost** - $5.95/month (Popular)

### What You Need:

- ✅ cPanel hosting account
- ✅ Domain name (e.g., vncblockchain.com)
- ✅ FTP/SSH access credentials
- ✅ Database access credentials
- ✅ Your project files ready

---

## 💰 Cost Comparison

### cPanel Hosting vs Cloud Services

| Provider | Configuration | Monthly Cost | Annual Cost |
|----------|--------------|--------------|-------------|
| **Hostinger** | 2GB RAM, 100GB SSD | **$3.99** | **$47.88** |
| **A2 Hosting** | 4GB RAM, Unlimited | **$10.99** | **$131.88** |
| **InMotion** | 6GB RAM, Unlimited | **$6.99** | **$83.88** |
| **SiteGround** | 10GB RAM, 40GB SSD | **$14.99** | **$179.88** |
| | | | |
| **GCP Cloud Run** | 1GB RAM, 10GB DB | $35-70 | $420-840 |
| **AWS EB** | 1GB RAM, 20GB DB | $40-80 | $480-960 |
| **Azure** | 1GB RAM, 10GB DB | $50-90 | $600-1080 |

### 💡 Best Value: Hostinger

- **Price**: $3.99/month ($47.88/year)
- **Resources**: 2GB RAM, 100GB SSD, Unlimited bandwidth
- **Includes**: Free SSL, Email, Node.js, PostgreSQL
- **Performance**: 99.9% uptime guarantee
- **Support**: 24/7 live chat

**Total Savings**: **~$372-1,032/year** vs cloud providers!

---

## ⚡ Quick Deployment Steps

### Phase 1: Prepare Files (10 minutes)
### Phase 2: Upload to Server (15 minutes)
### Phase 3: Configure Database (10 minutes)
### Phase 4: Setup Node.js App (15 minutes)
### Phase 5: Deploy Frontend (10 minutes)
### Phase 6: Configure SSL & Domain (5 minutes)

**Total Time: 1 Hour**

---

## 🔧 Backend Setup

### Step 1: Build Backend for Production

On your local machine:

```powershell
# Navigate to backend
cd "d:\VNC Crypto Blockchan\backend\api-server"

# Install dependencies
npm ci --production

# Build TypeScript
npm run build

# The compiled files are now in dist/ folder
```

### Step 2: Create Production Package

Create a deployment package with only necessary files:

```powershell
# Create deployment folder
New-Item -ItemType Directory -Force -Path "..\..\deployment\backend"

# Copy necessary files
Copy-Item -Path "dist" -Destination "..\..\deployment\backend\dist" -Recurse
Copy-Item -Path "node_modules" -Destination "..\..\deployment\backend\node_modules" -Recurse
Copy-Item -Path "prisma" -Destination "..\..\deployment\backend\prisma" -Recurse
Copy-Item -Path "package.json" -Destination "..\..\deployment\backend\"
Copy-Item -Path "package-lock.json" -Destination "..\..\deployment\backend\"

# Create .env file
@"
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://USERNAME:PASSWORD@localhost:5432/vnc_blockchain
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
ENCRYPTION_KEY=your-encryption-key-here
FRONTEND_URL=https://vncblockchain.com
CASHFREE_APP_ID=your-app-id
CASHFREE_SECRET_KEY=your-secret-key
CASHFREE_API_VERSION=2023-08-01
CASHFREE_MODE=production
SENDGRID_API_KEY=your-sendgrid-key
FROM_EMAIL=noreply@vncblockchain.com
ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/YOUR_KEY
CONTRACT_ADDRESS=0x...
PRIVATE_KEY=0x...
"@ | Out-File -FilePath "..\..\deployment\backend\.env" -Encoding UTF8

# Compress for upload
Compress-Archive -Path "..\..\deployment\backend\*" -DestinationPath "..\..\backend-deploy.zip" -Force

Write-Host "✅ Backend package created: backend-deploy.zip" -ForegroundColor Green
```

### Step 3: Upload Backend to cPanel

**Method A: File Manager (Recommended for beginners)**

1. Login to cPanel (e.g., https://yourdomain.com:2083)
2. Open **File Manager**
3. Navigate to your home directory (e.g., `/home/username/`)
4. Create folder: `nodejs-app`
5. Upload `backend-deploy.zip` to `nodejs-app` folder
6. Right-click → Extract
7. Delete the zip file after extraction

**Method B: FTP (Faster for large files)**

1. Use FileZilla or WinSCP
2. Connect to your server:
   - Host: `ftp.yourdomain.com` or your server IP
   - Username: Your cPanel username
   - Password: Your cPanel password
   - Port: 21 (FTP) or 22 (SFTP)
3. Navigate to `/home/username/`
4. Create `nodejs-app` folder
5. Upload all files from `deployment\backend\` to `nodejs-app`

**Method C: SSH (Fastest)**

```bash
# Connect via SSH
ssh username@yourdomain.com

# Navigate to home directory
cd ~

# Create app directory
mkdir nodejs-app
cd nodejs-app

# Upload using scp (run from local machine)
scp -r "d:\VNC Crypto Blockchan\deployment\backend\*" username@yourdomain.com:~/nodejs-app/
```

### Step 4: Setup Node.js App in cPanel

1. **Open cPanel** → **Setup Node.js App**

2. **Create Application:**
   - **Node.js version**: 20.x or latest
   - **Application mode**: Production
   - **Application root**: `nodejs-app`
   - **Application URL**: `api.yourdomain.com` or `yourdomain.com/api`
   - **Application startup file**: `dist/server.js`
   - **Environment variables**: Add from .env file

3. **Configure Environment Variables:**
   
   Click "Add Environment Variable" for each:
   ```
   NODE_ENV = production
   PORT = 3000
   DATABASE_URL = postgresql://cpanel_user:password@localhost:5432/cpanel_vncdb
   JWT_SECRET = (generate 32 char random string)
   ENCRYPTION_KEY = (generate 32 char random string)
   FRONTEND_URL = https://yourdomain.com
   CASHFREE_APP_ID = your_production_app_id
   CASHFREE_SECRET_KEY = your_production_secret
   SENDGRID_API_KEY = your_sendgrid_key
   ```

4. **Start Application:**
   - Click "Save" and "Restart"
   - Check status - should show "Running"
   - Note the assigned port (e.g., 3000)

5. **Setup Reverse Proxy** (if using subdomain `api.yourdomain.com`):
   
   cPanel → **Domains** → **Subdomains** → Create `api`
   
   Then create `.htaccess` in the subdomain root:
   ```apache
   RewriteEngine On
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]
   ```

---

## 🎨 Frontend Setup

### Step 1: Build Frontend for Production

On your local machine:

```powershell
# Navigate to frontend
cd "d:\VNC Crypto Blockchan\frontend\presale-platform"

# Set backend API URL
$env:NEXT_PUBLIC_API_URL = "https://api.yourdomain.com/api"
# OR
$env:NEXT_PUBLIC_API_URL = "https://yourdomain.com/api"

# Install dependencies
npm ci

# Build for production (static export)
npm run build

# Files are now in out/ folder
```

### Step 2: Update next.config.js

Ensure your `next.config.js` has static export enabled:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  },
  trailingSlash: true
};

module.exports = nextConfig;
```

### Step 3: Upload Frontend to cPanel

**Method A: File Manager**

1. Login to cPanel
2. Open **File Manager**
3. Navigate to `public_html` folder
4. Upload all files from `out/` folder
5. Extract if zipped

**Method B: FTP**

1. Connect via FTP to your server
2. Navigate to `/public_html/`
3. Upload all files from `frontend/presale-platform/out/` folder

**Method C: Create Zip and Upload**

```powershell
# Create frontend package
cd "frontend\presale-platform"
Compress-Archive -Path "out\*" -DestinationPath "..\..\frontend-deploy.zip" -Force

# Upload frontend-deploy.zip to public_html via File Manager
# Then extract in File Manager
```

### Step 4: Configure .htaccess for SPA Routing

Create/edit `.htaccess` in `public_html`:

```apache
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

# API Proxy (if backend is on same server)
# RewriteCond %{REQUEST_URI} ^/api/
# RewriteRule ^api/(.*)$ http://localhost:3000/api/$1 [P,L]

# Security Headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
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
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

---

## 🗄️ Database Configuration

### Step 1: Create PostgreSQL Database

1. **Login to cPanel** → **PostgreSQL Databases**

2. **Create Database:**
   - Database name: `vnc_blockchain` (cPanel will prefix with username)
   - Click "Create Database"

3. **Create User:**
   - Username: `vnc_user` (cPanel will prefix)
   - Password: Generate strong password
   - Click "Create User"

4. **Add User to Database:**
   - Select user: `cpanel_vnc_user`
   - Select database: `cpanel_vnc_blockchain`
   - Grant ALL PRIVILEGES
   - Click "Add"

5. **Note Credentials:**
   ```
   Host: localhost
   Port: 5432
   Database: cpanel_vnc_blockchain
   Username: cpanel_vnc_user
   Password: (your password)
   
   Connection String:
   postgresql://cpanel_vnc_user:password@localhost:5432/cpanel_vnc_blockchain
   ```

### Step 2: Run Database Migrations

**Option A: Via SSH (Recommended)**

```bash
# Connect via SSH
ssh username@yourdomain.com

# Navigate to app directory
cd ~/nodejs-app

# Run Prisma migrations
npx prisma migrate deploy

# Seed database (optional)
npx prisma db seed
```

**Option B: Via Local Machine with Port Forwarding**

```powershell
# Create SSH tunnel
ssh -L 5432:localhost:5432 username@yourdomain.com

# In another terminal, run migrations
cd "d:\VNC Crypto Blockchan\backend\api-server"
$env:DATABASE_URL = "postgresql://cpanel_vnc_user:password@localhost:5432/cpanel_vnc_blockchain"
npx prisma migrate deploy
npx prisma db seed
```

**Option C: Via phpPgAdmin (Manual)**

1. cPanel → **phpPgAdmin**
2. Select your database
3. Click "SQL" tab
4. Copy content from `backend/api-server/prisma/migrations/*/migration.sql`
5. Paste and execute

### Step 3: Verify Database

```bash
# Connect via SSH
ssh username@yourdomain.com

# Connect to PostgreSQL
psql -U cpanel_vnc_user -d cpanel_vnc_blockchain

# List tables
\dt

# Check users table
SELECT COUNT(*) FROM "User";

# Exit
\q
```

---

## 🔒 SSL Certificate

### Enable Free SSL (Let's Encrypt)

1. **Login to cPanel** → **SSL/TLS Status**

2. **AutoSSL by Let's Encrypt:**
   - Find your domain
   - Click "Run AutoSSL"
   - Wait 1-2 minutes
   - Status should show "✅ Secure"

3. **Force HTTPS:**
   - Already configured in `.htaccess` above
   - Or use cPanel → **SSL/TLS** → **Force HTTPS Redirect**

4. **Verify SSL:**
   - Visit https://yourdomain.com
   - Check for padlock icon
   - Use SSL Checker: https://www.sslshopper.com/ssl-checker.html

---

## 🌐 Domain Configuration

### Setup Domain & Subdomains

1. **Main Domain**: `yourdomain.com` → Points to `public_html` (Frontend)

2. **API Subdomain**: `api.yourdomain.com` → Points to Node.js app
   
   **Steps:**
   - cPanel → **Subdomains**
   - Subdomain: `api`
   - Document Root: `/home/username/public_html/api` (create empty folder)
   - Click "Create"
   - Add reverse proxy `.htaccess` (see Backend Setup Step 5)

3. **DNS Configuration** (if using external domain):
   
   Add these DNS records at your domain registrar:
   ```
   Type    Name    Value                       TTL
   A       @       your_server_ip              14400
   A       api     your_server_ip              14400
   CNAME   www     yourdomain.com              14400
   ```

---

## 🚀 Post-Deployment

### Step 1: Test Backend API

```powershell
# Test health endpoint
Invoke-WebRequest -Uri "https://api.yourdomain.com/health"

# Should return: {"status":"ok","database":"connected"}

# Test signup
$body = @{
    email = "test@example.com"
    password = "Test123!@#"
    name = "Test User"
} | ConvertTo-Json

Invoke-WebRequest -Uri "https://api.yourdomain.com/api/auth/signup" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"
```

### Step 2: Test Frontend

1. Visit `https://yourdomain.com`
2. Check all pages load correctly
3. Test signup/login flow
4. Verify API calls work
5. Test payment integration

### Step 3: Configure Email

1. **Create Email Account:**
   - cPanel → **Email Accounts**
   - Create: `noreply@yourdomain.com`
   - Note SMTP settings

2. **Update Backend .env:**
   ```
   SMTP_HOST=mail.yourdomain.com
   SMTP_PORT=465
   SMTP_USER=noreply@yourdomain.com
   SMTP_PASSWORD=your_email_password
   FROM_EMAIL=noreply@yourdomain.com
   ```

3. **Test Email:**
   ```bash
   # Via SSH in Node.js app directory
   node -e "require('./dist/services/email.service').sendEmail({
     to: 'test@example.com',
     subject: 'Test Email',
     template: 'welcome',
     data: { name: 'Test User' }
   })"
   ```

### Step 4: Setup Cron Jobs

1. **cPanel** → **Cron Jobs**

2. **Add Cleanup Job** (Daily at 3 AM):
   ```
   0 3 * * * cd ~/nodejs-app && node dist/scripts/cleanup.js
   ```

3. **Add Backup Job** (Daily at 2 AM):
   ```
   0 2 * * * pg_dump -U cpanel_vnc_user cpanel_vnc_blockchain > ~/backups/db-$(date +\%Y\%m\%d).sql
   ```

### Step 5: Monitor Application

1. **Check Logs:**
   ```bash
   # Via SSH
   cd ~/nodejs-app
   tail -f logs/app.log
   
   # Or check Node.js app logs in cPanel
   ```

2. **Monitor Resources:**
   - cPanel → **Resource Usage**
   - Check CPU, RAM, Disk usage
   - Set up alerts if needed

3. **Uptime Monitoring:**
   - Use UptimeRobot (free): https://uptimerobot.com
   - Monitor: `https://api.yourdomain.com/health`
   - Get email alerts if down

---

## 🛠️ Troubleshooting

### Issue 1: Node.js App Not Starting

**Check Logs:**
```bash
ssh username@yourdomain.com
cd ~/nodejs-app
cat logs/error.log
```

**Common Fixes:**
- Verify Node.js version: `node --version` (should be 18+)
- Check port is not in use: `netstat -tulpn | grep 3000`
- Restart app in cPanel → Setup Node.js App → Restart
- Check environment variables are set correctly

### Issue 2: Database Connection Failed

**Verify Credentials:**
```bash
psql -U cpanel_vnc_user -d cpanel_vnc_blockchain -h localhost
```

**Common Fixes:**
- Check DATABASE_URL format is correct
- Verify PostgreSQL is running: `service postgresql status`
- Check user permissions in cPanel → PostgreSQL Databases
- Ensure database name includes cPanel username prefix

### Issue 3: Frontend Not Loading

**Check Files:**
- Verify all files uploaded to `public_html`
- Check file permissions: 644 for files, 755 for folders
- Verify `.htaccess` exists and is correct

**Clear Cache:**
- Browser cache (Ctrl+F5)
- cPanel cache: cPanel → Optimize Website → Clear Cache

### Issue 4: API Calls Failing (CORS)

**Update Backend CORS Settings:**

Edit `backend/api-server/src/server.ts`:
```typescript
app.use(cors({
  origin: [
    'https://yourdomain.com',
    'https://www.yourdomain.com',
    'https://api.yourdomain.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

Rebuild and redeploy backend.

### Issue 5: SSL Certificate Issues

**Renew SSL:**
```bash
# Via SSH
/usr/local/cpanel/bin/autossl_check --all
```

Or cPanel → SSL/TLS Status → Run AutoSSL

### Issue 6: High Memory Usage

**Optimize Node.js:**

Edit app settings in cPanel → Setup Node.js App:
```
NODE_OPTIONS=--max-old-space-size=512
```

**Restart App:**
```bash
ssh username@yourdomain.com
cd ~/nodejs-app
npm restart
```

---

## 📊 Performance Optimization

### 1. Enable Caching

Add to `.htaccess`:
```apache
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresDefault "access plus 1 month"
  ExpiresByType text/html "access plus 1 hour"
  ExpiresByType application/json "access plus 1 hour"
</IfModule>
```

### 2. Enable Compression

Already in `.htaccess` above, verify in cPanel → Optimize Website

### 3. Use CDN (Optional)

**Cloudflare (Free):**
1. Sign up at https://cloudflare.com
2. Add your domain
3. Update nameservers at registrar
4. Enable caching rules
5. Enable minification

### 4. Optimize Database

```sql
-- Create indexes for better performance
CREATE INDEX idx_user_email ON "User"(email);
CREATE INDEX idx_deposit_user ON "Deposit"(user_id);
CREATE INDEX idx_purchase_user ON "Purchase"(user_id);
CREATE INDEX idx_transaction_user ON "Transaction"(user_id);

-- Analyze tables
ANALYZE "User";
ANALYZE "Deposit";
ANALYZE "Purchase";
```

---

## 🔐 Security Checklist

- [ ] SSL certificate installed and forced HTTPS
- [ ] Strong database password (20+ characters)
- [ ] JWT_SECRET is random 32+ character string
- [ ] ENCRYPTION_KEY is random 32+ character string
- [ ] File permissions: 644 for files, 755 for folders
- [ ] .env file is NOT in public_html
- [ ] Disable directory listing in .htaccess
- [ ] Rate limiting enabled in backend
- [ ] CORS configured for your domains only
- [ ] Database user has minimal required permissions
- [ ] Regular backups scheduled (daily)
- [ ] Security headers set in .htaccess
- [ ] Admin passwords changed from defaults
- [ ] Two-factor authentication enabled for cPanel

---

## 📱 Maintenance Tasks

### Daily
- [ ] Check application is running
- [ ] Monitor error logs
- [ ] Check disk space usage

### Weekly
- [ ] Review access logs for suspicious activity
- [ ] Check resource usage (CPU/RAM)
- [ ] Test critical user flows

### Monthly
- [ ] Update Node.js dependencies: `npm update`
- [ ] Review and delete old logs
- [ ] Check SSL certificate expiry
- [ ] Review backup integrity
- [ ] Update documentation with changes

### Quarterly
- [ ] Update Node.js version if needed
- [ ] Security audit and penetration testing
- [ ] Performance optimization review
- [ ] Disaster recovery test

---

## 📞 Support Resources

**cPanel Documentation:**
- https://docs.cpanel.net/

**Node.js in cPanel:**
- https://docs.cpanel.net/cpanel/software/setup-nodejs-app/

**PostgreSQL in cPanel:**
- https://docs.cpanel.net/cpanel/databases/postgresql-databases/

**Community Support:**
- cPanel Forums: https://forums.cpanel.net/
- Stack Overflow: https://stackoverflow.com/questions/tagged/cpanel
- Reddit: r/webhosting

---

## 🎯 Production Checklist

### Before Going Live

- [ ] Backend deployed and running
- [ ] Frontend deployed and accessible
- [ ] Database migrated and seeded
- [ ] SSL certificate active (HTTPS working)
- [ ] Domain configured correctly
- [ ] Email service working (test welcome email)
- [ ] Cashfree production credentials configured
- [ ] Smart contracts deployed to mainnet
- [ ] All API endpoints tested
- [ ] User signup/login flow tested
- [ ] Payment flow tested end-to-end
- [ ] 2FA authentication tested
- [ ] Wallet generation tested
- [ ] Error handling working
- [ ] Logs configured and accessible
- [ ] Backups scheduled
- [ ] Monitoring alerts set up
- [ ] Security scan completed
- [ ] Performance test passed
- [ ] Legal pages added (Terms, Privacy)
- [ ] Contact page functional

### Post-Launch (First 24 Hours)

- [ ] Monitor error logs continuously
- [ ] Test user registration
- [ ] Verify payment processing
- [ ] Check email delivery
- [ ] Monitor server resources
- [ ] Test from different devices/browsers
- [ ] Verify mobile responsiveness
- [ ] Check all links working
- [ ] Monitor database performance
- [ ] Be available for user support

---

## 🎉 Deployment Complete!

Your VNC Blockchain platform is now live on cPanel hosting!

**URLs:**
- Frontend: https://yourdomain.com
- Backend API: https://api.yourdomain.com
- Admin Panel: https://yourdomain.com/super-admin

**Costs:**
- Hosting: $3.99-14.99/month
- Domain: ~$10/year
- **Total: ~$4-15/month** (much cheaper than cloud!)

**Next Steps:**
1. Share your website URL
2. Monitor for first 24 hours
3. Gather user feedback
4. Make improvements
5. Scale as needed

Need help? Contact your hosting provider's 24/7 support! 🚀
