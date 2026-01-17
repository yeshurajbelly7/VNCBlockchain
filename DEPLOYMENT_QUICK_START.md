# ⚡ QUICK DEPLOYMENT CHECKLIST

## 🚀 FASTEST WAY TO GO LIVE (1 Hour)

### Prerequisites (5 minutes)
- [ ] AWS account created
- [ ] Credit card added
- [ ] GitHub account ready

---

## OPTION 1: VERCEL + AWS ELASTIC BEANSTALK (Easiest) ⭐

### Step 1: Deploy Backend (15 minutes)

```powershell
# Install AWS CLI & EB CLI
pip install awsebcli awscli

# Configure AWS
aws configure
# Enter: Access Key, Secret Key, Region: ap-south-1

# Deploy backend
cd "d:\VNC Crypto Blockchan\backend\api-server"
eb init -p node.js-18 vnc-backend --region ap-south-1
eb create vnc-backend-prod
eb setenv DATABASE_URL="..." JWT_SECRET="..." FRONTEND_URL="..."
eb deploy
```

### Step 2: Deploy Frontend (5 minutes)

```powershell
# Install Vercel CLI
npm install -g vercel

# Deploy
cd "d:\VNC Crypto Blockchan\frontend\presale-platform"
vercel
# Follow prompts, login, deploy
```

### Step 3: Setup Database (10 minutes)

**Option A: ElephantSQL (FREE)**
1. Visit https://www.elephantsql.com
2. Create free account
3. Create instance
4. Copy DATABASE_URL
5. Run: `eb setenv DATABASE_URL="your-url"`

**Option B: AWS RDS**
```powershell
aws rds create-db-instance `
  --db-instance-identifier vnc-db `
  --db-instance-class db.t3.micro `
  --engine postgres `
  --master-username vncadmin `
  --master-user-password "YourPassword123!" `
  --allocated-storage 20
```

### Step 4: Run Migrations (5 minutes)

```powershell
# SSH into Elastic Beanstalk
eb ssh

# Run migrations
cd /var/app/current
npx prisma migrate deploy
npx prisma generate
exit
```

### ✅ DONE! Your app is live!
- Frontend: https://your-app.vercel.app
- Backend: https://vnc-backend-prod.elasticbeanstalk.com

**Cost: ~$25/month** (Vercel free + AWS EB ~$25)

---

## OPTION 2: DIGITALOCEAN (Budget-Friendly)

### Step 1: Create Droplets (10 minutes)

```bash
# Create account at digitalocean.com
# Create 2 droplets:
# 1. Backend (2GB RAM, $12/month)
# 2. Frontend (2GB RAM, $12/month)
```

### Step 2: Setup Backend Droplet (20 minutes)

```bash
# SSH into backend droplet
ssh root@<backend-ip>

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs git postgresql-client

# Clone repo
git clone https://github.com/your-org/vnc-blockchain.git
cd vnc-blockchain/backend/api-server

# Install dependencies
npm install --production

# Create .env
nano .env
# Add all environment variables

# Run migrations
npx prisma generate
npx prisma migrate deploy

# Install PM2
npm install -g pm2

# Build and start
npm run build
pm2 start dist/server.js --name vnc-backend
pm2 startup
pm2 save

# Install Nginx
apt install -y nginx

# Configure Nginx
nano /etc/nginx/sites-available/vnc-backend
```

**Nginx Config:**
```nginx
server {
    listen 80;
    server_name api.vncblockchain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
ln -s /etc/nginx/sites-available/vnc-backend /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx

# Install SSL (Let's Encrypt)
apt install -y certbot python3-certbot-nginx
certbot --nginx -d api.vncblockchain.com
```

### Step 3: Setup Frontend Droplet (15 minutes)

```bash
# SSH into frontend droplet
ssh root@<frontend-ip>

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs git

# Clone and build
git clone https://github.com/your-org/vnc-blockchain.git
cd vnc-blockchain/frontend/presale-platform

# Create .env.production
echo "NEXT_PUBLIC_API_URL=https://api.vncblockchain.com/api" > .env.production

# Install and build
npm install --production
npm run build

# Start with PM2
npm install -g pm2
pm2 start npm --name vnc-frontend -- start
pm2 startup
pm2 save

# Setup Nginx (same as backend)
# Install SSL with certbot
```

### Step 4: Database (10 minutes)

**Option A: DigitalOcean Managed PostgreSQL**
- Create database cluster ($15/month)
- Copy connection string
- Update .env on backend

**Option B: Self-hosted PostgreSQL**
```bash
apt install -y postgresql
sudo -u postgres createdb vnc_blockchain
sudo -u postgres psql -c "CREATE USER vncadmin WITH PASSWORD 'password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE vnc_blockchain TO vncadmin;"
```

### ✅ DONE! Your app is live!
- Cost: ~$40/month (2 droplets + database)

---

## OPTION 3: RENDER.COM (One-Click Deploy)

### Step 1: Connect GitHub (2 minutes)
1. Push code to GitHub
2. Visit https://render.com
3. Sign up with GitHub

### Step 2: Deploy Backend (5 minutes)
1. Click "New +"
2. Select "Web Service"
3. Connect GitHub repo
4. Settings:
   - Name: vnc-backend
   - Environment: Node
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Add environment variables
5. Click "Create Web Service"

### Step 3: Deploy Frontend (5 minutes)
1. Click "New +"
2. Select "Static Site"
3. Connect repo
4. Settings:
   - Name: vnc-frontend
   - Build Command: `npm install && npm run build`
   - Publish Directory: `.next`
5. Create

### Step 4: Database (2 minutes)
1. Click "New +"
2. Select "PostgreSQL"
3. Name: vnc-database
4. Copy connection string
5. Update backend environment variables

### ✅ DONE! Auto-deployed!
- Cost: $25/month (Backend $7 + Frontend $0 + DB $7)

---

## 📋 POST-DEPLOYMENT CHECKLIST

### Immediate (First Hour)
- [ ] Test frontend loads
- [ ] Test backend health endpoint
- [ ] Test user signup
- [ ] Test user login
- [ ] Test database connection

### Day 1
- [ ] Setup domain and SSL
- [ ] Configure email service
- [ ] Deploy smart contracts
- [ ] Update Cashfree webhook URL
- [ ] Test real payment

### Week 1
- [ ] Setup monitoring
- [ ] Configure backups
- [ ] Load testing
- [ ] Security scan
- [ ] Performance optimization

---

## 🔑 ENVIRONMENT VARIABLES NEEDED

### Backend (.env)
```env
PORT=5000
NODE_ENV=production
DATABASE_URL="postgresql://user:pass@host:5432/vnc_blockchain"
JWT_SECRET="your-64-char-random-string"
CASHFREE_APP_ID="YOUR_CASHFREE_APP_ID"
CASHFREE_SECRET_KEY="YOUR_CASHFREE_SECRET_KEY"
CASHFREE_ENVIRONMENT=PRODUCTION
FRONTEND_URL="https://vncblockchain.com"
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Frontend (.env.production)
```env
NEXT_PUBLIC_API_URL=https://api.vncblockchain.com/api
NEXT_PUBLIC_PRESALE_CONTRACT=0x...
NEXT_PUBLIC_TOKEN_CONTRACT=0x...
```

---

## 🆘 QUICK FIXES

### Backend won't start
```bash
pm2 logs vnc-backend
pm2 restart vnc-backend
```

### Database connection error
```bash
# Test connection
psql "postgresql://user:pass@host:5432/vnc_blockchain"
```

### Frontend shows API error
```bash
# Check API URL in browser console
# Update NEXT_PUBLIC_API_URL
# Redeploy
```

### SSL certificate error
```bash
# Renew Let's Encrypt
certbot renew
```

---

## 💰 COST COMPARISON

| Platform | Backend | Frontend | Database | Total/Month |
|----------|---------|----------|----------|-------------|
| **Vercel + AWS EB** | $25 | FREE | $15 | **$40** |
| **DigitalOcean** | $12 | $12 | $15 | **$39** |
| **Render.com** | $7 | FREE | $7 | **$14** |
| **AWS Full** | $122 | $30 | $61 | **$253** |
| **Heroku** | $25 | $0 | $9 | **$34** |

**Recommended: Render.com for quickest deployment ($14/month)**

---

## 🚀 FASTEST PATH TO PRODUCTION

### 5-Minute Deploy (Render.com):

```powershell
# 1. Push to GitHub
cd "d:\VNC Crypto Blockchan"
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-org/vnc-blockchain.git
git push -u origin main

# 2. Visit render.com
# 3. Connect GitHub
# 4. Deploy backend (select repo, add env vars)
# 5. Deploy frontend (select repo)
# 6. Create PostgreSQL database
# 7. Update backend with database URL
# 8. Done!
```

**Time: 5 minutes**  
**Cost: $14/month**  
**Difficulty: Easy**

---

## 📞 SUPPORT

**Platform Support:**
- AWS: https://console.aws.amazon.com/support
- Vercel: https://vercel.com/support
- DigitalOcean: https://www.digitalocean.com/support
- Render: https://render.com/docs

**Need Help?**
Read full guide: `SERVER_DEPLOYMENT_GUIDE.md`

---

**🎉 Ready to deploy? Choose your platform and follow the steps above!**
