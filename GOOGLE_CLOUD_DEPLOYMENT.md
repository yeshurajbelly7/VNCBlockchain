# 🚀 Google Cloud Platform (GCP) Deployment Guide
## VNC Blockchain Presale Platform

Complete guide to deploy your application on Google Cloud Platform with Cloud Run, Cloud SQL, and Firebase Hosting.

---

## 📋 Table of Contents

1. [Overview & Architecture](#overview--architecture)
2. [Prerequisites](#prerequisites)
3. [Cost Estimation](#cost-estimation)
4. [Quick Start (1 Hour)](#quick-start-1-hour)
5. [Step-by-Step Deployment](#step-by-step-deployment)
6. [Environment Configuration](#environment-configuration)
7. [Monitoring & Logging](#monitoring--logging)
8. [Scaling & Performance](#scaling--performance)
9. [Security Best Practices](#security-best-practices)
10. [Troubleshooting](#troubleshooting)

---

## 🏗️ Overview & Architecture

### GCP Services Used

```
┌─────────────────────────────────────────────────────┐
│                   Google Cloud                       │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────────┐         ┌──────────────┐         │
│  │   Cloud      │         │   Cloud      │         │
│  │   Load       │────────▶│   Run        │         │
│  │   Balancer   │         │   (Backend)  │         │
│  └──────────────┘         └──────┬───────┘         │
│         │                         │                  │
│         │                         │                  │
│  ┌──────▼──────┐         ┌───────▼──────┐          │
│  │  Firebase   │         │   Cloud SQL  │          │
│  │  Hosting    │         │  (PostgreSQL)│          │
│  │  (Frontend) │         └──────────────┘          │
│  └─────────────┘                  │                 │
│         │                          │                 │
│         │                  ┌───────▼──────┐         │
│         │                  │    Cloud     │         │
│         └─────────────────▶│    Storage   │         │
│                            │   (Buckets)  │         │
│                            └──────────────┘         │
│                                                      │
│  Additional Services:                               │
│  • Secret Manager (API Keys)                        │
│  • Cloud Logging & Monitoring                       │
│  • Cloud CDN (Global Distribution)                  │
│  • Cloud Armor (DDoS Protection)                    │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### Benefits of GCP

✅ **Cloud Run** - Serverless container deployment (scales to zero)
✅ **Cloud SQL** - Fully managed PostgreSQL
✅ **Firebase Hosting** - Fast global CDN for frontend
✅ **Secret Manager** - Secure credential storage
✅ **Built-in SSL** - Automatic HTTPS certificates
✅ **Auto-scaling** - Pay only for what you use
✅ **Global Network** - Low latency worldwide
✅ **Stackdriver** - Integrated monitoring and logging

---

## 📦 Prerequisites

### 1. Install Required Tools

```powershell
# Install Google Cloud SDK
# Download from: https://cloud.google.com/sdk/docs/install
# Or use installer:
Invoke-WebRequest -Uri "https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe" -OutFile "GoogleCloudSDKInstaller.exe"
.\GoogleCloudSDKInstaller.exe

# Restart PowerShell after installation

# Verify installation
gcloud --version

# Install Firebase CLI
npm install -g firebase-tools

# Verify Firebase CLI
firebase --version

# Install Docker Desktop for Windows
# Download from: https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe
```

### 2. Create GCP Account & Project

```powershell
# Login to Google Cloud
gcloud auth login

# Create new project
gcloud projects create vnc-blockchain-prod --name="VNC Blockchain Production"

# Set as active project
gcloud config set project vnc-blockchain-prod

# Enable billing (required for Cloud Run, Cloud SQL)
# Go to: https://console.cloud.google.com/billing
# Link your project to a billing account

# Enable required APIs
gcloud services enable run.googleapis.com
gcloud services enable sqladmin.googleapis.com
gcloud services enable secretmanager.googleapis.com
gcloud services enable cloudscheduler.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable compute.googleapis.com
```

### 3. Set Environment Variables

```powershell
# Set your project ID
$env:GCP_PROJECT_ID = "vnc-blockchain-prod"
$env:GCP_REGION = "us-central1"  # or asia-south1 for India
```

---

## 💰 Cost Estimation

### Monthly Cost Breakdown

| Service | Configuration | Monthly Cost |
|---------|--------------|--------------|
| **Cloud Run** (Backend) | 1GB RAM, 1 vCPU | **$15-30** |
| **Cloud SQL** (PostgreSQL) | db-f1-micro (shared CPU) | **$7** |
| **Cloud SQL** (PostgreSQL) | db-g1-small (1 vCPU, 1.7GB) | **$25** |
| **Cloud Storage** | 10GB storage + 100GB transfer | **$3** |
| **Firebase Hosting** | 10GB bandwidth | **$0** (Free) |
| **Secret Manager** | 10 secrets | **$0.06** |
| **Cloud Load Balancing** | Basic tier | **$18** |
| **Cloud CDN** | 100GB egress | **$8** |
| **Cloud Logging** | 50GB logs | **$0.50** (First 50GB free) |
| | | |
| **TOTAL (Basic)** | | **~$25-35/month** |
| **TOTAL (Production)** | | **~$70-90/month** |

### Free Tier (First 90 Days)

- **$300 FREE credits** for 90 days
- Cloud Run: 2 million requests/month FREE forever
- Cloud SQL: $0 (use free credits)
- Firebase Hosting: 10GB storage + 360MB/day FREE

### Cost Optimization Tips

1. **Cloud Run scales to zero** - No charges when idle
2. **Use Cloud SQL Proxy** - No public IP costs
3. **Enable Cloud CDN** - Reduce backend requests
4. **Set up auto-scaling limits** - Control max costs
5. **Use committed use discounts** - Save up to 57%

---

## ⚡ Quick Start (1 Hour)

### Option 1: Automated Deployment Script

```powershell
# Navigate to project
cd "d:\VNC Crypto Blockchan"

# Run deployment script (created below)
.\deploy-gcp.ps1
```

### Option 2: Manual Commands

```powershell
# 1. Build and deploy backend
cd backend\api-server
gcloud run deploy vnc-backend `
  --source . `
  --region us-central1 `
  --platform managed `
  --allow-unauthenticated `
  --memory 1Gi `
  --cpu 1 `
  --timeout 300s `
  --max-instances 10

# 2. Deploy frontend to Firebase
cd ..\..\frontend\presale-platform
npm run build
firebase deploy --only hosting

# Done! Your app is live 🎉
```

---

## 📝 Step-by-Step Deployment

### PHASE 1: Database Setup (Cloud SQL)

#### 1.1 Create Cloud SQL Instance

```powershell
# Create PostgreSQL instance
gcloud sql instances create vnc-db-prod `
  --database-version=POSTGRES_15 `
  --tier=db-g1-small `
  --region=us-central1 `
  --storage-type=SSD `
  --storage-size=10GB `
  --storage-auto-increase `
  --backup-start-time=03:00 `
  --maintenance-window-day=SUN `
  --maintenance-window-hour=04 `
  --enable-bin-log `
  --retained-backups-count=7

# Set root password
gcloud sql users set-password postgres `
  --instance=vnc-db-prod `
  --password="YOUR_SECURE_PASSWORD_HERE"

# Create database
gcloud sql databases create vnc_blockchain `
  --instance=vnc-db-prod

# Get connection name
gcloud sql instances describe vnc-db-prod --format="value(connectionName)"
# Output: vnc-blockchain-prod:us-central1:vnc-db-prod
```

#### 1.2 Store Database Credentials in Secret Manager

```powershell
# Create database URL secret
$DB_URL = "postgresql://postgres:YOUR_PASSWORD@/vnc_blockchain?host=/cloudsql/vnc-blockchain-prod:us-central1:vnc-db-prod"
echo $DB_URL | gcloud secrets create DATABASE_URL --data-file=-

# Create JWT secret
$JWT_SECRET = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
echo $JWT_SECRET | gcloud secrets create JWT_SECRET --data-file=-

# Create encryption key
$ENCRYPTION_KEY = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
echo $ENCRYPTION_KEY | gcloud secrets create ENCRYPTION_KEY --data-file=-

# List all secrets
gcloud secrets list
```

### PHASE 2: Backend Deployment (Cloud Run)

#### 2.1 Create Dockerfile for Backend

Create `backend/api-server/Dockerfile`:

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci --only=production

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

# Install Cloud SQL Proxy
RUN wget https://dl.google.com/cloudsql/cloud_sql_proxy.linux.amd64 -O cloud_sql_proxy \
    && chmod +x cloud_sql_proxy

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
USER nodejs

EXPOSE 5000

# Start command
CMD ["node", "dist/server.js"]
```

#### 2.2 Create .dockerignore

Create `backend/api-server/.dockerignore`:

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

#### 2.3 Build and Deploy to Cloud Run

```powershell
# Navigate to backend
cd backend\api-server

# Build container using Cloud Build
gcloud builds submit --tag gcr.io/vnc-blockchain-prod/vnc-backend

# Deploy to Cloud Run with secrets
gcloud run deploy vnc-backend `
  --image gcr.io/vnc-blockchain-prod/vnc-backend `
  --region us-central1 `
  --platform managed `
  --allow-unauthenticated `
  --memory 1Gi `
  --cpu 1 `
  --timeout 300s `
  --max-instances 10 `
  --min-instances 0 `
  --set-env-vars "NODE_ENV=production,PORT=5000" `
  --set-secrets "DATABASE_URL=DATABASE_URL:latest,JWT_SECRET=JWT_SECRET:latest,ENCRYPTION_KEY=ENCRYPTION_KEY:latest" `
  --add-cloudsql-instances vnc-blockchain-prod:us-central1:vnc-db-prod

# Get backend URL
gcloud run services describe vnc-backend --region us-central1 --format="value(status.url)"
# Output: https://vnc-backend-xxxxx-uc.a.run.app
```

#### 2.4 Run Database Migrations

```powershell
# Set DATABASE_URL for local migration
$env:DATABASE_URL = "postgresql://postgres:YOUR_PASSWORD@/vnc_blockchain?host=/cloudsql/vnc-blockchain-prod:us-central1:vnc-db-prod"

# Run migrations using Cloud SQL Proxy
# Download Cloud SQL Proxy
Invoke-WebRequest -Uri "https://dl.google.com/cloudsql/cloud_sql_proxy_x64.exe" -OutFile "cloud_sql_proxy.exe"

# Start proxy (in separate terminal)
.\cloud_sql_proxy.exe -instances=vnc-blockchain-prod:us-central1:vnc-db-prod=tcp:5432

# Run Prisma migrations (in main terminal)
npx prisma migrate deploy
npx prisma db seed
```

### PHASE 3: Frontend Deployment (Firebase Hosting)

#### 3.1 Initialize Firebase Project

```powershell
# Navigate to frontend
cd ..\..\frontend\presale-platform

# Login to Firebase
firebase login

# Initialize Firebase
firebase init

# Select:
# ✅ Hosting: Configure files for Firebase Hosting
# ✅ Use existing project: vnc-blockchain-prod
# Public directory: out
# Single-page app: Yes
# GitHub deploys: No
```

#### 3.2 Update next.config.js for Static Export

Edit `frontend/presale-platform/next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://vnc-backend-xxxxx-uc.a.run.app/api'
  },
  trailingSlash: true
};

module.exports = nextConfig;
```

#### 3.3 Create Firebase Configuration

Create `frontend/presale-platform/firebase.json`:

```json
{
  "hosting": {
    "public": "out",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "/api/**",
        "function": "api"
      },
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      },
      {
        "source": "**/*.@(css|js)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      }
    ]
  }
}
```

#### 3.4 Build and Deploy Frontend

```powershell
# Set backend URL
$env:NEXT_PUBLIC_API_URL = "https://vnc-backend-xxxxx-uc.a.run.app/api"

# Build Next.js app
npm run build

# Deploy to Firebase
firebase deploy --only hosting

# Get hosting URL
# Output: https://vnc-blockchain-prod.web.app
```

### PHASE 4: Custom Domain Setup

#### 4.1 Configure Custom Domain for Backend

```powershell
# Map custom domain to Cloud Run
gcloud run domain-mappings create `
  --service vnc-backend `
  --domain api.vncblockchain.com `
  --region us-central1

# Get DNS records to add
gcloud run domain-mappings describe `
  --domain api.vncblockchain.com `
  --region us-central1
```

#### 4.2 Configure Custom Domain for Frontend

```powershell
# Add custom domain in Firebase Console
# Go to: https://console.firebase.google.com/project/vnc-blockchain-prod/hosting/main

# Or use CLI
firebase hosting:channel:deploy live --expires 30d

# Add DNS records from Firebase Console to your domain registrar
```

---

## 🔐 Environment Configuration

### Backend Environment Variables

Create `backend/api-server/.env.production`:

```bash
# Database
DATABASE_URL="postgresql://postgres:PASSWORD@/vnc_blockchain?host=/cloudsql/CONNECTION_NAME"

# Server
NODE_ENV=production
PORT=5000

# JWT
JWT_SECRET="your-jwt-secret-from-secret-manager"
JWT_EXPIRES_IN=7d

# Encryption
ENCRYPTION_KEY="your-encryption-key-from-secret-manager"

# CORS
FRONTEND_URL=https://vnc-blockchain-prod.web.app

# Cashfree Production
CASHFREE_APP_ID="your-production-app-id"
CASHFREE_SECRET_KEY="your-production-secret-key"
CASHFREE_API_VERSION=2023-08-01
CASHFREE_MODE=production

# Email (SendGrid)
SENDGRID_API_KEY="your-sendgrid-api-key"
FROM_EMAIL=noreply@vncblockchain.com

# Blockchain
ETHEREUM_RPC_URL="https://mainnet.infura.io/v3/YOUR_KEY"
CONTRACT_ADDRESS="0x..."
PRIVATE_KEY="0x..."
```

### Frontend Environment Variables

Create `frontend/presale-platform/.env.production`:

```bash
NEXT_PUBLIC_API_URL=https://api.vncblockchain.com/api
NEXT_PUBLIC_ENVIRONMENT=production
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

---

## 📊 Monitoring & Logging

### Enable Cloud Logging

```powershell
# View backend logs
gcloud run services logs read vnc-backend --region us-central1 --limit 50

# Stream live logs
gcloud run services logs tail vnc-backend --region us-central1

# Query specific errors
gcloud logging read "resource.type=cloud_run_revision AND severity>=ERROR" --limit 50
```

### Set Up Cloud Monitoring

```powershell
# Create uptime check
gcloud monitoring uptime-checks create https://api.vncblockchain.com/health `
  --check-interval=60s `
  --timeout=10s `
  --display-name="VNC Backend Health Check"

# Create alert policy
gcloud alpha monitoring policies create `
  --notification-channels=CHANNEL_ID `
  --display-name="VNC Backend Down" `
  --condition-display-name="Uptime check failed" `
  --condition-threshold-value=1 `
  --condition-threshold-duration=300s
```

### Enable Error Reporting

Errors are automatically captured in Cloud Error Reporting:
- View: https://console.cloud.google.com/errors

### Performance Monitoring

Firebase automatically tracks performance:
- View: https://console.firebase.google.com/project/vnc-blockchain-prod/performance

---

## 🚀 Scaling & Performance

### Auto-Scaling Configuration

```powershell
# Update Cloud Run scaling
gcloud run services update vnc-backend `
  --region us-central1 `
  --min-instances 1 `
  --max-instances 100 `
  --concurrency 80 `
  --cpu-throttling `
  --memory 2Gi `
  --cpu 2
```

### Enable Cloud CDN

```powershell
# Enable CDN for Cloud Run
gcloud compute backend-services update BACKEND_SERVICE_NAME `
  --enable-cdn `
  --cache-mode=CACHE_ALL_STATIC `
  --default-ttl=3600
```

### Database Optimization

```powershell
# Scale Cloud SQL instance
gcloud sql instances patch vnc-db-prod `
  --tier=db-g1-small `
  --enable-bin-log `
  --backup-start-time=03:00

# Create read replica for scaling
gcloud sql instances create vnc-db-replica `
  --master-instance-name=vnc-db-prod `
  --tier=db-f1-micro `
  --region=us-central1
```

---

## 🔒 Security Best Practices

### 1. Enable Cloud Armor (DDoS Protection)

```powershell
# Create security policy
gcloud compute security-policies create vnc-security-policy `
  --description "VNC Blockchain Security Policy"

# Add rate limiting rule
gcloud compute security-policies rules create 1000 `
  --security-policy vnc-security-policy `
  --expression "origin.region_code == 'CN'" `
  --action "deny-403"

# Add rate limit (100 requests per minute)
gcloud compute security-policies rules create 2000 `
  --security-policy vnc-security-policy `
  --rate-limit-threshold-count=100 `
  --rate-limit-threshold-interval-sec=60 `
  --action "rate-based-ban"
```

### 2. Enable VPC Service Controls

```powershell
# Create service perimeter
gcloud access-context-manager perimeters create vnc_perimeter `
  --title="VNC Blockchain Perimeter" `
  --resources=projects/PROJECT_NUMBER `
  --restricted-services=storage.googleapis.com,sqladmin.googleapis.com
```

### 3. Regular Security Audits

```powershell
# Run security scan
gcloud web-security-scanner scan-configs create `
  --starting-urls=https://vnc-blockchain-prod.web.app `
  --display-name="VNC Security Scan"

# Check for vulnerabilities
gcloud container images scan gcr.io/vnc-blockchain-prod/vnc-backend
```

---

## 🛠️ Troubleshooting

### Common Issues

#### Issue 1: Cloud Run Service Not Starting

```powershell
# Check logs
gcloud run services logs read vnc-backend --region us-central1 --limit 100

# Common fixes:
# 1. Check DATABASE_URL secret
gcloud secrets versions access latest --secret="DATABASE_URL"

# 2. Verify Cloud SQL connection
gcloud sql instances describe vnc-db-prod

# 3. Test locally with Cloud SQL Proxy
.\cloud_sql_proxy.exe -instances=CONNECTION_NAME=tcp:5432
```

#### Issue 2: Database Connection Failed

```powershell
# Test connection
gcloud sql connect vnc-db-prod --user=postgres

# Check if Cloud SQL API is enabled
gcloud services list --enabled | findstr sql

# Verify service account permissions
gcloud projects get-iam-policy vnc-blockchain-prod
```

#### Issue 3: Frontend Not Loading

```powershell
# Check Firebase hosting status
firebase hosting:sites:list

# View hosting logs
firebase hosting:channel:list

# Redeploy
npm run build
firebase deploy --only hosting --force
```

#### Issue 4: High Latency

```powershell
# Check Cloud Run cold starts
gcloud run services describe vnc-backend --region us-central1 --format="value(status.latestReadyRevisionName)"

# Increase min instances
gcloud run services update vnc-backend --min-instances 2 --region us-central1

# Enable Cloud CDN (see above)
```

---

## 📱 CI/CD with Cloud Build

### Create cloudbuild.yaml

Create `cloudbuild.yaml` in project root:

```yaml
steps:
  # Build backend
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/vnc-backend', './backend/api-server']
  
  # Push backend image
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/vnc-backend']
  
  # Deploy backend to Cloud Run
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: gcloud
    args:
      - 'run'
      - 'deploy'
      - 'vnc-backend'
      - '--image'
      - 'gcr.io/$PROJECT_ID/vnc-backend'
      - '--region'
      - 'us-central1'
      - '--platform'
      - 'managed'
      - '--allow-unauthenticated'
  
  # Build frontend
  - name: 'node:20'
    entrypoint: 'bash'
    args:
      - '-c'
      - |
        cd frontend/presale-platform
        npm ci
        npm run build
  
  # Deploy frontend to Firebase
  - name: 'gcr.io/$PROJECT_ID/firebase'
    args: ['deploy', '--only', 'hosting', '--project', '$PROJECT_ID']

timeout: '1200s'
images:
  - 'gcr.io/$PROJECT_ID/vnc-backend'
```

### Set Up GitHub Integration

```powershell
# Connect GitHub repository
gcloud builds triggers create github `
  --repo-name=vnc-blockchain `
  --repo-owner=YOUR_GITHUB_USERNAME `
  --branch-pattern="^main$" `
  --build-config=cloudbuild.yaml

# List triggers
gcloud builds triggers list
```

---

## 🎯 Production Checklist

### Before Going Live

- [ ] Database backups enabled (7-day retention)
- [ ] Cloud SQL automatic updates enabled
- [ ] Secrets stored in Secret Manager (not .env files)
- [ ] Custom domain configured with SSL
- [ ] Cloud Armor enabled (DDoS protection)
- [ ] Uptime monitoring alerts configured
- [ ] Error reporting notifications set up
- [ ] Cloud CDN enabled for static assets
- [ ] Rate limiting configured (100 req/min)
- [ ] CORS configured for production domain
- [ ] Cashfree production credentials configured
- [ ] Email service (SendGrid) configured
- [ ] Smart contracts deployed to mainnet
- [ ] Load testing completed (100+ concurrent users)
- [ ] Security scan passed
- [ ] Legal pages added (Terms, Privacy Policy)

### Post-Launch

- [ ] Monitor Cloud Logging dashboard (first 24 hours)
- [ ] Check error rates in Error Reporting
- [ ] Verify payment flow end-to-end
- [ ] Test 2FA authentication
- [ ] Monitor database performance
- [ ] Check Cloud Run auto-scaling behavior
- [ ] Verify email delivery rates
- [ ] Test wallet generation and transactions
- [ ] Monitor costs in Billing dashboard

---

## 💡 Quick Commands Reference

```powershell
# Deploy backend
cd backend\api-server
gcloud builds submit --tag gcr.io/vnc-blockchain-prod/vnc-backend
gcloud run deploy vnc-backend --image gcr.io/vnc-blockchain-prod/vnc-backend --region us-central1

# Deploy frontend
cd frontend\presale-platform
npm run build
firebase deploy --only hosting

# View logs
gcloud run services logs tail vnc-backend --region us-central1

# Check status
gcloud run services describe vnc-backend --region us-central1

# Update secrets
echo "NEW_VALUE" | gcloud secrets versions add SECRET_NAME --data-file=-

# Scale instance
gcloud run services update vnc-backend --max-instances 50 --region us-central1

# Rollback deployment
gcloud run services update-traffic vnc-backend --to-revisions REVISION_NAME=100 --region us-central1
```

---

## 🆘 Support Resources

- **GCP Console**: https://console.cloud.google.com
- **Firebase Console**: https://console.firebase.google.com
- **Cloud Run Docs**: https://cloud.google.com/run/docs
- **Cloud SQL Docs**: https://cloud.google.com/sql/docs
- **Firebase Hosting Docs**: https://firebase.google.com/docs/hosting
- **Support**: https://cloud.google.com/support
- **Status**: https://status.cloud.google.com

---

## 📞 Need Help?

If you encounter issues:

1. Check Cloud Logging for errors
2. Review this troubleshooting section
3. Consult GCP documentation
4. Post on Stack Overflow (tag: google-cloud-platform)
5. Contact GCP Support (if you have a support plan)

---

**Your VNC Blockchain platform is now live on Google Cloud! 🎉**

**Backend URL**: https://vnc-backend-xxxxx-uc.a.run.app  
**Frontend URL**: https://vnc-blockchain-prod.web.app  
**Custom Domain**: https://vncblockchain.com

**Monthly Cost**: ~$25-90 (scales with usage)  
**First 90 Days**: FREE ($300 credits)
