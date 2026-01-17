# 📦 cPanel Deployment - Manual Build Instructions

Since the automated script requires extensive build time, here's the simple manual process.

## Step 1: Build Backend (5 minutes)

```powershell
# Navigate to backend
cd "d:\VNC Crypto Blockchan\backend\api-server"

# Install dependencies (production only)
npm ci --only=production

# Build TypeScript
npm run build

# Verify dist folder exists
dir dist
```

## Step 2: Package Backend (2 minutes)

```powershell
# Create deployment folder
mkdir "..\..\deployment\backend" -Force

# Copy necessary files
Copy-Item -Path "dist" -Destination "..\..\deployment\backend\dist" -Recurse
Copy-Item -Path "node_modules" -Destination "..\..\deployment\backend\node_modules" -Recurse
Copy-Item -Path "prisma" -Destination "..\..\deployment\backend\prisma" -Recurse
Copy-Item -Path "package.json" -Destination "..\..\deployment\backend\"

# Create ZIP file
cd "..\..\deployment"
Compress-Archive -Path "backend\*" -DestinationPath "..\backend-deploy.zip" -Force

Write-Host "✅ Backend package created: backend-deploy.zip"
```

## Step 3: Build Frontend (5 minutes)

```powershell
# Navigate to frontend
cd "d:\VNC Crypto Blockchan\frontend\presale-platform"

# Set your API URL (IMPORTANT!)
$env:NEXT_PUBLIC_API_URL = "https://api.yourdomain.com/api"
# OR for same domain: https://yourdomain.com/api

# Install dependencies
npm ci

# Build Next.js
npm run build

# Verify out folder exists
dir out
```

## Step 4: Package Frontend (2 minutes)

```powershell
# Create deployment folder
mkdir "..\..\deployment\frontend" -Force

# Copy built files
Copy-Item -Path "out\*" -Destination "..\..\deployment\frontend\" -Recurse

# Create .htaccess file
@"
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/api/
RewriteRule ^(.*)$ /index.html [L]
Options -Indexes
"@ | Out-File -FilePath "..\..\deployment\frontend\.htaccess" -Encoding UTF8

# Create ZIP file
cd "..\..\deployment"
Compress-Archive -Path "frontend\*" -DestinationPath "..\frontend-deploy.zip" -Force

Write-Host "✅ Frontend package created: frontend-deploy.zip"
```

## Step 5: Create .env Template

Create `deployment\backend\.env.example`:

```bash
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://cpanel_user:password@localhost:5432/cpanel_database
JWT_SECRET=your-random-32-char-secret
JWT_EXPIRES_IN=7d
ENCRYPTION_KEY=your-random-32-char-key
FRONTEND_URL=https://yourdomain.com
CASHFREE_APP_ID=production_app_id
CASHFREE_SECRET_KEY=production_secret_key
CASHFREE_API_VERSION=2023-08-01
CASHFREE_MODE=production
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=465
SMTP_USER=noreply@yourdomain.com
SMTP_PASSWORD=your_password
FROM_EMAIL=noreply@yourdomain.com
```

## ✅ Summary

You should now have:
- ✅ `backend-deploy.zip` - Ready to upload to ~/nodejs-app/
- ✅ `frontend-deploy.zip` - Ready to upload to ~/public_html/

## 🚀 Next Steps

1. **Purchase cPanel hosting** (Hostinger: $3.99/month recommended)
2. **Upload backend-deploy.zip** to ~/nodejs-app/ folder
3. **Upload frontend-deploy.zip** to ~/public_html/ folder
4. **Extract both ZIP files**
5. **Configure environment variables** (copy .env.example to .env)
6. **Setup Node.js app** in cPanel (Node.js 20.x, startup: dist/server.js)
7. **Run database migrations** via SSH: `npx prisma migrate deploy`
8. **Enable SSL** (cPanel → SSL/TLS Status → Run AutoSSL)
9. **Test your site!**

## 📖 Complete Guide

See **CPANEL_DEPLOYMENT.md** for complete step-by-step instructions including:
- Database setup
- Email configuration  
- Domain configuration
- SSL certificates
- Troubleshooting
- Security checklist

## 💰 Cost

Total: **$3.99-14.99/month** (vs $25-90 for cloud hosting)

---

**Ready to deploy!** 🎉
