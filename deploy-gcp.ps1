# ============================================
# VNC Blockchain - Google Cloud Deployment Script
# ============================================

Write-Host "🚀 VNC Blockchain - Google Cloud Deployment" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$PROJECT_ID = "vnc-blockchain-prod"
$REGION = "us-central1"
$DB_INSTANCE = "vnc-db-prod"
$BACKEND_SERVICE = "vnc-backend"
$DB_PASSWORD = ""

# Check if gcloud is installed
if (-not (Get-Command gcloud -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Google Cloud SDK not found!" -ForegroundColor Red
    Write-Host "Install from: https://cloud.google.com/sdk/docs/install" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Google Cloud SDK found" -ForegroundColor Green

# Login check
Write-Host ""
Write-Host "Checking authentication..." -ForegroundColor Yellow
$auth = gcloud auth list --filter=status:ACTIVE --format="value(account)" 2>$null
if (-not $auth) {
    Write-Host "Please login to Google Cloud..." -ForegroundColor Yellow
    gcloud auth login
}
Write-Host "✅ Authenticated as: $auth" -ForegroundColor Green

# Create or select project
Write-Host ""
Write-Host "Setting up project..." -ForegroundColor Yellow
$existingProject = gcloud projects list --filter="projectId:$PROJECT_ID" --format="value(projectId)" 2>$null

if (-not $existingProject) {
    Write-Host "Creating new project: $PROJECT_ID" -ForegroundColor Cyan
    gcloud projects create $PROJECT_ID --name="VNC Blockchain Production"
    Start-Sleep -Seconds 5
}

gcloud config set project $PROJECT_ID
Write-Host "✅ Project set: $PROJECT_ID" -ForegroundColor Green

# Enable required APIs
Write-Host ""
Write-Host "Enabling required APIs..." -ForegroundColor Yellow
$apis = @(
    "run.googleapis.com",
    "sqladmin.googleapis.com",
    "secretmanager.googleapis.com",
    "cloudbuild.googleapis.com",
    "containerregistry.googleapis.com"
)

foreach ($api in $apis) {
    Write-Host "  Enabling $api..." -ForegroundColor Gray
    gcloud services enable $api 2>$null
}
Write-Host "✅ APIs enabled" -ForegroundColor Green

# Database password
Write-Host ""
if (-not $DB_PASSWORD) {
    $DB_PASSWORD = Read-Host "Enter database password (or press Enter for auto-generated)" -AsSecureString
    if ($DB_PASSWORD.Length -eq 0) {
        $DB_PASSWORD = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
        Write-Host "Generated password: $DB_PASSWORD" -ForegroundColor Yellow
        Write-Host "⚠️  SAVE THIS PASSWORD!" -ForegroundColor Red
    } else {
        $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($DB_PASSWORD)
        $DB_PASSWORD = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
    }
}

# Create Cloud SQL instance
Write-Host ""
Write-Host "Creating Cloud SQL instance..." -ForegroundColor Yellow
$existingDb = gcloud sql instances list --filter="name:$DB_INSTANCE" --format="value(name)" 2>$null

if (-not $existingDb) {
    Write-Host "Creating PostgreSQL database (this takes 5-10 minutes)..." -ForegroundColor Cyan
    gcloud sql instances create $DB_INSTANCE `
        --database-version=POSTGRES_15 `
        --tier=db-g1-small `
        --region=$REGION `
        --storage-type=SSD `
        --storage-size=10GB `
        --storage-auto-increase `
        --backup-start-time=03:00 `
        --enable-bin-log `
        --no-assign-ip
    
    # Set password
    gcloud sql users set-password postgres `
        --instance=$DB_INSTANCE `
        --password=$DB_PASSWORD
    
    # Create database
    gcloud sql databases create vnc_blockchain --instance=$DB_INSTANCE
    
    Write-Host "✅ Database created" -ForegroundColor Green
} else {
    Write-Host "✅ Database already exists" -ForegroundColor Green
}

# Get connection name
$CONNECTION_NAME = gcloud sql instances describe $DB_INSTANCE --format="value(connectionName)"
Write-Host "Database connection: $CONNECTION_NAME" -ForegroundColor Cyan

# Create secrets
Write-Host ""
Write-Host "Creating secrets..." -ForegroundColor Yellow

# DATABASE_URL
$DB_URL = "postgresql://postgres:${DB_PASSWORD}@/vnc_blockchain?host=/cloudsql/${CONNECTION_NAME}"
$existingSecret = gcloud secrets list --filter="name:DATABASE_URL" --format="value(name)" 2>$null
if (-not $existingSecret) {
    echo $DB_URL | gcloud secrets create DATABASE_URL --data-file=-
    Write-Host "✅ DATABASE_URL secret created" -ForegroundColor Green
} else {
    Write-Host "✅ DATABASE_URL secret exists" -ForegroundColor Green
}

# JWT_SECRET
$JWT_SECRET = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
$existingSecret = gcloud secrets list --filter="name:JWT_SECRET" --format="value(name)" 2>$null
if (-not $existingSecret) {
    echo $JWT_SECRET | gcloud secrets create JWT_SECRET --data-file=-
    Write-Host "✅ JWT_SECRET secret created" -ForegroundColor Green
} else {
    Write-Host "✅ JWT_SECRET secret exists" -ForegroundColor Green
}

# ENCRYPTION_KEY
$ENCRYPTION_KEY = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
$existingSecret = gcloud secrets list --filter="name:ENCRYPTION_KEY" --format="value(name)" 2>$null
if (-not $existingSecret) {
    echo $ENCRYPTION_KEY | gcloud secrets create ENCRYPTION_KEY --data-file=-
    Write-Host "✅ ENCRYPTION_KEY secret created" -ForegroundColor Green
} else {
    Write-Host "✅ ENCRYPTION_KEY secret exists" -ForegroundColor Green
}

# Build and deploy backend
Write-Host ""
Write-Host "Building backend container..." -ForegroundColor Yellow
Set-Location "$PSScriptRoot\backend\api-server"

if (-not (Test-Path "Dockerfile")) {
    Write-Host "❌ Dockerfile not found! Creating..." -ForegroundColor Red
    # Dockerfile content will be created by the main guide
    Write-Host "Please create Dockerfile using the guide" -ForegroundColor Yellow
    exit 1
}

Write-Host "Submitting build to Cloud Build..." -ForegroundColor Cyan
gcloud builds submit --tag "gcr.io/$PROJECT_ID/$BACKEND_SERVICE"

Write-Host "Deploying to Cloud Run..." -ForegroundColor Cyan
gcloud run deploy $BACKEND_SERVICE `
    --image "gcr.io/$PROJECT_ID/$BACKEND_SERVICE" `
    --region $REGION `
    --platform managed `
    --allow-unauthenticated `
    --memory 1Gi `
    --cpu 1 `
    --timeout 300s `
    --max-instances 10 `
    --min-instances 0 `
    --set-env-vars "NODE_ENV=production,PORT=5000" `
    --set-secrets "DATABASE_URL=DATABASE_URL:latest,JWT_SECRET=JWT_SECRET:latest,ENCRYPTION_KEY=ENCRYPTION_KEY:latest" `
    --add-cloudsql-instances $CONNECTION_NAME

$BACKEND_URL = gcloud run services describe $BACKEND_SERVICE --region $REGION --format="value(status.url)"
Write-Host "✅ Backend deployed: $BACKEND_URL" -ForegroundColor Green

# Run database migrations
Write-Host ""
Write-Host "Running database migrations..." -ForegroundColor Yellow
Write-Host "Note: You need to run this locally with Cloud SQL Proxy" -ForegroundColor Cyan
Write-Host "Download: https://dl.google.com/cloudsql/cloud_sql_proxy_x64.exe" -ForegroundColor Cyan
Write-Host "Then run: .\cloud_sql_proxy.exe -instances=$CONNECTION_NAME=tcp:5432" -ForegroundColor Cyan
Write-Host "And: npx prisma migrate deploy" -ForegroundColor Cyan

# Deploy frontend
Write-Host ""
Write-Host "Deploying frontend..." -ForegroundColor Yellow
Set-Location "$PSScriptRoot\frontend\presale-platform"

# Check Firebase CLI
if (-not (Get-Command firebase -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Firebase CLI not found!" -ForegroundColor Red
    Write-Host "Install: npm install -g firebase-tools" -ForegroundColor Yellow
    exit 1
}

# Set API URL
$env:NEXT_PUBLIC_API_URL = "$BACKEND_URL/api"

# Build
Write-Host "Building frontend..." -ForegroundColor Cyan
npm run build

# Deploy
Write-Host "Deploying to Firebase..." -ForegroundColor Cyan
firebase deploy --only hosting --project $PROJECT_ID

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "🎉 DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Backend URL:  $BACKEND_URL" -ForegroundColor Cyan
Write-Host "Frontend URL: Check Firebase Console" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Run database migrations (see above)" -ForegroundColor White
Write-Host "2. Test API: $BACKEND_URL/health" -ForegroundColor White
Write-Host "3. Configure custom domain" -ForegroundColor White
Write-Host "4. Set up monitoring alerts" -ForegroundColor White
Write-Host "5. Update Cashfree webhook URL" -ForegroundColor White
Write-Host ""
Write-Host "Credentials saved in Secret Manager:" -ForegroundColor Yellow
Write-Host "  gcloud secrets versions access latest --secret=DATABASE_URL" -ForegroundColor White
Write-Host "  gcloud secrets versions access latest --secret=JWT_SECRET" -ForegroundColor White
Write-Host ""
Write-Host "View logs:" -ForegroundColor Yellow
Write-Host "  gcloud run services logs tail $BACKEND_SERVICE --region $REGION" -ForegroundColor White
Write-Host ""
