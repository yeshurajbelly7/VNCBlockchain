# ⚡ Google Cloud - Quick Setup Guide

## Step 1: Install Google Cloud SDK (5 minutes)

### Option A: Interactive Installer (Recommended)
1. Download installer: https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe
2. Run the installer
3. Follow the prompts:
   - ✅ Install Python (if not already installed)
   - ✅ Add gcloud to PATH
   - ✅ Run `gcloud init` after installation
4. **Restart PowerShell** after installation

### Option B: Manual Installation
```powershell
# Download and extract
Invoke-WebRequest -Uri "https://dl.google.com/dl/cloudsdk/channels/rapid/google-cloud-sdk.zip" -OutFile "google-cloud-sdk.zip"
Expand-Archive -Path "google-cloud-sdk.zip" -DestinationPath "C:\Program Files"

# Add to PATH
$env:Path += ";C:\Program Files\google-cloud-sdk\bin"
[Environment]::SetEnvironmentVariable("Path", $env:Path, [System.EnvironmentVariableTarget]::Machine)

# Install components
& "C:\Program Files\google-cloud-sdk\install.bat"
```

## Step 2: Install Firebase CLI

```powershell
npm install -g firebase-tools
```

## Step 3: Verify Installation

```powershell
# Check gcloud
gcloud --version

# Check firebase
firebase --version
```

## Step 4: Initial Setup

```powershell
# Login to Google Cloud
gcloud auth login

# Login to Firebase
firebase login

# Set your project
gcloud config set project vnc-blockchain-prod
```

## Step 5: Create Backend Dockerfile

Create `backend\api-server\Dockerfile`:

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Copy source code
COPY src ./src

# Generate Prisma Client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Production image
FROM node:20-alpine

WORKDIR /app

# Copy built files and dependencies
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package*.json ./

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
USER nodejs

EXPOSE 5000

# Start command
CMD ["node", "dist/server.js"]
```

## Step 6: Create .dockerignore

Create `backend\api-server\.dockerignore`:

```
node_modules
dist
.env
.env.local
.git
.gitignore
*.md
npm-debug.log
.DS_Store
coverage
.vscode
```

## Step 7: Manual Deployment Commands

Once gcloud is installed, run these commands:

```powershell
# Navigate to project
cd "d:\VNC Crypto Blockchan"

# Set project
$PROJECT_ID = "vnc-blockchain-prod"
$REGION = "us-central1"

# Login and create project
gcloud auth login
gcloud projects create $PROJECT_ID --name="VNC Blockchain Production"
gcloud config set project $PROJECT_ID

# Enable APIs
gcloud services enable run.googleapis.com
gcloud services enable sqladmin.googleapis.com
gcloud services enable secretmanager.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Create database
gcloud sql instances create vnc-db-prod `
  --database-version=POSTGRES_15 `
  --tier=db-g1-small `
  --region=$REGION `
  --storage-type=SSD `
  --storage-size=10GB

# Set database password
gcloud sql users set-password postgres `
  --instance=vnc-db-prod `
  --password="YOUR_SECURE_PASSWORD"

# Create database
gcloud sql databases create vnc_blockchain --instance=vnc-db-prod

# Get connection name
$CONNECTION_NAME = gcloud sql instances describe vnc-db-prod --format="value(connectionName)"
Write-Host "Connection: $CONNECTION_NAME"

# Create secrets
$DB_URL = "postgresql://postgres:YOUR_PASSWORD@/vnc_blockchain?host=/cloudsql/$CONNECTION_NAME"
Write-Output $DB_URL | gcloud secrets create DATABASE_URL --data-file=-

$JWT_SECRET = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
Write-Output $JWT_SECRET | gcloud secrets create JWT_SECRET --data-file=-

$ENCRYPTION_KEY = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
Write-Output $ENCRYPTION_KEY | gcloud secrets create ENCRYPTION_KEY --data-file=-

# Build and deploy backend
cd "backend\api-server"
gcloud builds submit --tag "gcr.io/$PROJECT_ID/vnc-backend"

gcloud run deploy vnc-backend `
  --image "gcr.io/$PROJECT_ID/vnc-backend" `
  --region $REGION `
  --platform managed `
  --allow-unauthenticated `
  --memory 1Gi `
  --cpu 1 `
  --timeout 300s `
  --max-instances 10 `
  --set-env-vars "NODE_ENV=production,PORT=5000" `
  --set-secrets "DATABASE_URL=DATABASE_URL:latest,JWT_SECRET=JWT_SECRET:latest,ENCRYPTION_KEY=ENCRYPTION_KEY:latest" `
  --add-cloudsql-instances $CONNECTION_NAME

# Get backend URL
$BACKEND_URL = gcloud run services describe vnc-backend --region $REGION --format="value(status.url)"
Write-Host "Backend URL: $BACKEND_URL"

# Deploy frontend
cd "..\..\frontend\presale-platform"
$env:NEXT_PUBLIC_API_URL = "$BACKEND_URL/api"
npm run build
firebase init
firebase deploy --only hosting
```

## Step 8: Database Migration

```powershell
# Download Cloud SQL Proxy
Invoke-WebRequest -Uri "https://dl.google.com/cloudsql/cloud_sql_proxy_x64.exe" -OutFile "cloud_sql_proxy.exe"

# Start proxy (in separate terminal)
.\cloud_sql_proxy.exe -instances=$CONNECTION_NAME=tcp:5432

# Run migrations (in main terminal)
cd "backend\api-server"
$env:DATABASE_URL = "postgresql://postgres:YOUR_PASSWORD@localhost:5432/vnc_blockchain"
npx prisma migrate deploy
npx prisma db seed
```

## Troubleshooting

### Error: gcloud not found
- **Solution**: Restart PowerShell after installing gcloud SDK
- Or manually add to PATH: `C:\Program Files\Google\Cloud SDK\google-cloud-sdk\bin`

### Error: Permission denied
- **Solution**: Run PowerShell as Administrator for installation
- Or install gcloud to user directory instead

### Error: Firebase command not found
- **Solution**: Install globally: `npm install -g firebase-tools`
- Restart terminal after installation

### Error: Docker not running
- **Solution**: Install Docker Desktop for Windows
- Download: https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe
- Start Docker Desktop before deploying

## Next Steps After Deployment

1. ✅ Test backend: `https://YOUR-BACKEND-URL/health`
2. ✅ Test frontend: `https://YOUR-FRONTEND-URL`
3. ✅ Configure custom domain
4. ✅ Set up monitoring alerts
5. ✅ Update Cashfree webhook URL
6. ✅ Deploy smart contracts to mainnet

## Cost Monitoring

```powershell
# Check current billing
gcloud billing accounts list

# View project costs
gcloud billing projects describe $PROJECT_ID

# Set budget alert (optional)
gcloud billing budgets create `
  --billing-account=BILLING_ACCOUNT_ID `
  --display-name="VNC Blockchain Budget" `
  --budget-amount=100USD `
  --threshold-rule=percent=50 `
  --threshold-rule=percent=90 `
  --threshold-rule=percent=100
```

## Support

- Google Cloud Console: https://console.cloud.google.com
- Firebase Console: https://console.firebase.google.com
- Documentation: https://cloud.google.com/docs
- Support: https://cloud.google.com/support

---

**Ready to deploy!** 🚀

Follow steps 1-4 first, then run the deployment commands in Step 7.
