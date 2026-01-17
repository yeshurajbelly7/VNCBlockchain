# 🚀 VNC BLOCKCHAIN - SERVER DEPLOYMENT GUIDE
## Complete Step-by-Step Production Deployment

**Last Updated:** January 17, 2026  
**Deployment Target:** AWS (Recommended)  
**Estimated Time:** 5-7 days  
**Cost:** FREE with AWS Activate credits

---

## 📋 PRE-DEPLOYMENT CHECKLIST

### ✅ Before You Start:
- [ ] AWS Account created (or Google Cloud)
- [ ] Credit card added to AWS
- [ ] Domain purchased (optional but recommended)
- [ ] Gmail/SendGrid account for emails
- [ ] Infura/Alchemy account for blockchain RPC
- [ ] GitHub repository set up
- [ ] Smart contracts compiled

---

## 🎯 DEPLOYMENT OPTIONS

### Option 1: AWS (Recommended) ⭐
**Pros:**
- $5,000-$100,000 FREE credits (AWS Activate)
- Better blockchain support
- More mature services
- Indian region (Mumbai) optimized
- Better Cashfree integration

**Cost:** $611/month (FREE with credits)

### Option 2: Google Cloud
**Pros:**
- Slightly cheaper ($596/month)
- Simpler pricing
- Better AI/ML (not needed for VNC)

**Cost:** $596/month

### Option 3: DigitalOcean (Budget-Friendly)
**Pros:**
- Much cheaper ($120/month)
- Simple setup
- Good for startups

**Cons:**
- Less scalable
- Manual setup required

---

## 🚀 QUICK DEPLOYMENT (AWS - 1 Hour Setup)

### Step 1: Create AWS Account (5 minutes)

1. Go to https://aws.amazon.com
2. Click "Create an AWS Account"
3. Enter details:
   - Email: admin@vncblockchain.com
   - Password: Strong password
   - Account type: Business
4. Add credit card (won't be charged with free tier)
5. Verify phone number
6. Choose "Basic Support" (free)

### Step 2: Apply for AWS Activate Credits (10 minutes)

1. Visit https://aws.amazon.com/activate
2. Choose program:
   - **Activate Portfolio**: $5,000 credits (requires VC backing)
   - **Activate Founders**: $1,000 credits (easier to get)
3. Fill application form
4. Submit and wait 1-2 weeks for approval

**Alternative:** Start without credits, optimize costs later

### Step 3: Setup AWS CLI (5 minutes)

```powershell
# Install AWS CLI
choco install awscli -y

# Configure AWS
aws configure
# Enter:
# AWS Access Key ID: (from IAM console)
# AWS Secret Access Key: (from IAM console)
# Default region: ap-south-1 (Mumbai)
# Default output format: json
```

### Step 4: Deploy Backend Using AWS Elastic Beanstalk (15 minutes)

**Easiest way to deploy - AWS manages everything!**

```powershell
# Install EB CLI
pip install awsebcli

# Navigate to backend
cd "d:\VNC Crypto Blockchan\backend\api-server"

# Initialize Elastic Beanstalk
eb init -p node.js-18 vnc-backend --region ap-south-1

# Create environment
eb create vnc-backend-prod

# Deploy
eb deploy

# Open in browser
eb open
```

**That's it! Your backend is live!** ✅

### Step 5: Deploy Frontend Using Vercel (5 minutes)

**Free hosting for Next.js apps!**

```powershell
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend
cd "d:\VNC Crypto Blockchan\frontend\presale-platform"

# Deploy
vercel

# Follow prompts:
# - Login with GitHub/Email
# - Choose project name: vnc-blockchain
# - Deploy to production: Yes
```

**Your frontend is live at:** https://vnc-blockchain.vercel.app ✅

### Step 6: Setup Database (10 minutes)

```powershell
# Option A: AWS RDS (Managed PostgreSQL)
aws rds create-db-instance \
  --db-instance-identifier vnc-blockchain-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username vncadmin \
  --master-user-password YourSecurePassword123! \
  --allocated-storage 20 \
  --backup-retention-period 7 \
  --region ap-south-1

# Option B: ElephantSQL (Free PostgreSQL hosting)
# Visit https://www.elephantsql.com
# Create free account
# Create new instance
# Copy database URL
```

### Step 7: Configure Environment Variables (10 minutes)

**On AWS Elastic Beanstalk:**

```powershell
# Set environment variables
eb setenv \
  NODE_ENV=production \
  PORT=5000 \
  DATABASE_URL="postgresql://user:pass@host:5432/vnc_blockchain" \
  JWT_SECRET="your-super-secure-jwt-secret-64-chars-long" \
  CASHFREE_APP_ID="YOUR_CASHFREE_APP_ID" \
  CASHFREE_SECRET_KEY="YOUR_CASHFREE_SECRET_KEY" \
  FRONTEND_URL="https://vnc-blockchain.vercel.app"

# Restart application
eb restart
```

**On Vercel (Frontend):**

```powershell
# Set environment variables
vercel env add NEXT_PUBLIC_API_URL
# Enter: https://vnc-backend-prod.elasticbeanstalk.com/api

# Redeploy
vercel --prod
```

### Step 8: Run Database Migrations (5 minutes)

```powershell
# SSH into AWS instance
eb ssh

# Navigate to app
cd /var/app/current

# Run migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate

# Exit SSH
exit
```

---

## 🎉 QUICK DEPLOYMENT COMPLETE!

**Your app is now live:**
- ✅ Frontend: https://vnc-blockchain.vercel.app
- ✅ Backend API: https://vnc-backend-prod.elasticbeanstalk.com
- ✅ Database: Running on AWS RDS
- ✅ SSL Certificate: Auto-configured by Vercel & AWS

**Total Time:** ~1 hour  
**Total Cost:** $0 (using free tiers)

---

## 💰 COST BREAKDOWN

### AWS Elastic Beanstalk + Vercel (Recommended for Beginners)

**Monthly Costs:**
- Elastic Beanstalk (t3.micro): $8.50/month
- RDS PostgreSQL (db.t3.micro): $15/month
- Vercel (Hobby): FREE
- **Total: $23.50/month** 🎉

### Full AWS Production Setup (For Scale)

**Monthly Costs:**
- EC2 instances (2x t3.large): $122/month
- RDS PostgreSQL (db.t3.medium): $61/month
- Application Load Balancer: $25/month
- S3 + CloudFront CDN: $30/month
- ElastiCache Redis: $15/month
- **Total: $253/month**

**With AWS Activate Credits:** FREE for 2 years!

---

## 🔧 ADVANCED DEPLOYMENT (Full AWS Production)

### Phase 1: Network Setup (1 hour)

#### 1.1 Create VPC

```bash
# Using AWS Console
1. Go to VPC → Create VPC
2. Name: vnc-blockchain-vpc
3. CIDR: 10.0.0.0/16
4. Enable DNS hostnames: Yes

# Create Subnets
Public Subnet 1: 10.0.1.0/24 (ap-south-1a)
Public Subnet 2: 10.0.2.0/24 (ap-south-1b)
Private Subnet 1: 10.0.10.0/24 (ap-south-1a)
Private Subnet 2: 10.0.11.0/24 (ap-south-1b)

# Create Internet Gateway
Name: vnc-igw
Attach to VPC

# Create NAT Gateway (for private subnets)
Allocate Elastic IP
Attach to public subnet

# Configure Route Tables
Public: 0.0.0.0/0 → Internet Gateway
Private: 0.0.0.0/0 → NAT Gateway
```

#### 1.2 Security Groups

```bash
# Load Balancer SG
Name: vnc-alb-sg
Inbound:
- HTTP (80) from 0.0.0.0/0
- HTTPS (443) from 0.0.0.0/0

# Backend SG
Name: vnc-backend-sg
Inbound:
- HTTP (5000) from ALB SG only
- SSH (22) from your IP

# Database SG
Name: vnc-db-sg
Inbound:
- PostgreSQL (5432) from Backend SG only

# Blockchain Node SG
Name: vnc-blockchain-sg
Inbound:
- Custom (30303) from 0.0.0.0/0 (P2P)
- Custom (8545) from Backend SG (RPC)
```

### Phase 2: Database Setup (30 minutes)

#### 2.1 Create RDS PostgreSQL

```bash
# Using AWS CLI
aws rds create-db-instance \
  --db-instance-identifier vnc-blockchain-db \
  --db-instance-class db.t3.medium \
  --engine postgres \
  --engine-version 15.5 \
  --master-username vncadmin \
  --master-user-password "YourSecurePassword123!" \
  --allocated-storage 100 \
  --storage-type gp3 \
  --backup-retention-period 7 \
  --multi-az \
  --vpc-security-group-ids sg-xxxxx \
  --db-subnet-group-name vnc-db-subnet \
  --publicly-accessible false \
  --storage-encrypted \
  --region ap-south-1

# Wait 10-15 minutes for creation
aws rds describe-db-instances --db-instance-identifier vnc-blockchain-db

# Get endpoint
# vnc-blockchain-db.xxxxxx.ap-south-1.rds.amazonaws.com
```

#### 2.2 Create ElastiCache Redis

```bash
aws elasticache create-cache-cluster \
  --cache-cluster-id vnc-redis \
  --cache-node-type cache.t3.micro \
  --engine redis \
  --num-cache-nodes 1 \
  --security-group-ids sg-xxxxx \
  --cache-subnet-group-name vnc-cache-subnet \
  --region ap-south-1
```

### Phase 3: Backend Deployment (1 hour)

#### 3.1 Create EC2 Instance

```bash
# Launch instance
aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --instance-type t3.large \
  --key-name vnc-backend-key \
  --security-group-ids sg-xxxxx \
  --subnet-id subnet-xxxxx \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=vnc-backend-1}]' \
  --user-data file://backend-setup.sh
```

#### 3.2 Backend Setup Script (backend-setup.sh)

```bash
#!/bin/bash

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL client
sudo apt install -y postgresql-client

# Install PM2
sudo npm install -g pm2

# Install Git
sudo apt install -y git

# Clone repository
cd /home/ubuntu
git clone https://github.com/your-org/vnc-blockchain.git

# Setup backend
cd vnc-blockchain/backend/api-server
npm install --production

# Create .env file
cat > .env << EOF
PORT=5000
NODE_ENV=production
DATABASE_URL="postgresql://vncadmin:password@vnc-blockchain-db.xxxxx.ap-south-1.rds.amazonaws.com:5432/vnc_blockchain"
JWT_SECRET="your-production-jwt-secret"
CASHFREE_APP_ID="YOUR_CASHFREE_APP_ID"
CASHFREE_SECRET_KEY="YOUR_CASHFREE_SECRET_KEY"
CASHFREE_ENVIRONMENT=PRODUCTION
FRONTEND_URL="https://vncblockchain.com"
REDIS_HOST="vnc-redis.xxxxx.cache.amazonaws.com"
REDIS_PORT=6379
EOF

# Run migrations
npx prisma generate
npx prisma migrate deploy

# Build TypeScript
npm run build

# Start with PM2
pm2 start dist/server.js --name vnc-backend-api

# Setup PM2 startup
pm2 startup
pm2 save

# Configure Nginx reverse proxy
sudo apt install -y nginx

cat > /etc/nginx/sites-available/vnc-backend << 'NGINX'
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
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
NGINX

sudo ln -s /etc/nginx/sites-available/vnc-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

echo "Backend setup complete!"
```

#### 3.3 Connect and Deploy

```powershell
# SSH into instance
ssh -i vnc-backend-key.pem ubuntu@<instance-public-ip>

# Check PM2 status
pm2 status

# View logs
pm2 logs vnc-backend-api

# Test backend
curl http://localhost:5000/health
```

### Phase 4: Frontend Deployment (30 minutes)

#### 4.1 Build Frontend

```powershell
# On your local machine
cd "d:\VNC Crypto Blockchan\frontend\presale-platform"

# Update environment
$env:NEXT_PUBLIC_API_URL="https://api.vncblockchain.com/api"

# Build for production
npm run build

# Test production build locally
npm start
```

#### 4.2 Deploy to S3 + CloudFront

```powershell
# Create S3 bucket
aws s3 mb s3://vnc-blockchain-frontend --region ap-south-1

# Enable static website hosting
aws s3 website s3://vnc-blockchain-frontend --index-document index.html

# Upload build files
cd .next
aws s3 sync . s3://vnc-blockchain-frontend/

# Create CloudFront distribution
aws cloudfront create-distribution \
  --origin-domain-name vnc-blockchain-frontend.s3.ap-south-1.amazonaws.com \
  --default-root-object index.html
```

#### 4.3 Alternative: Deploy Frontend to EC2

```bash
# Launch EC2 for frontend
aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --instance-type t3.large \
  --key-name vnc-frontend-key \
  --security-group-ids sg-xxxxx

# SSH and setup
ssh -i vnc-frontend-key.pem ubuntu@<ip>

# Install Node.js, clone repo
cd vnc-blockchain/frontend/presale-platform
npm install --production
npm run build
pm2 start npm --name vnc-frontend -- start

# Configure Nginx for frontend (same as backend)
```

### Phase 5: Load Balancer & Auto Scaling (1 hour)

#### 5.1 Create Application Load Balancer

```bash
# Create ALB
aws elbv2 create-load-balancer \
  --name vnc-alb \
  --subnets subnet-xxxxx subnet-yyyyy \
  --security-groups sg-xxxxx \
  --scheme internet-facing \
  --type application

# Create target groups
aws elbv2 create-target-group \
  --name vnc-backend-tg \
  --protocol HTTP \
  --port 5000 \
  --vpc-id vpc-xxxxx \
  --health-check-path /health

aws elbv2 create-target-group \
  --name vnc-frontend-tg \
  --protocol HTTP \
  --port 3002 \
  --vpc-id vpc-xxxxx

# Register targets
aws elbv2 register-targets \
  --target-group-arn arn:aws:elasticloadbalancing:... \
  --targets Id=i-xxxxx

# Create listener rules
aws elbv2 create-listener \
  --load-balancer-arn arn:aws:elasticloadbalancing:... \
  --protocol HTTP \
  --port 80 \
  --default-actions Type=forward,TargetGroupArn=arn:...
```

#### 5.2 Setup Auto Scaling

```bash
# Create launch template
aws ec2 create-launch-template \
  --launch-template-name vnc-backend-template \
  --version-description "VNC Backend v1" \
  --launch-template-data '{
    "ImageId": "ami-xxxxx",
    "InstanceType": "t3.large",
    "KeyName": "vnc-backend-key",
    "SecurityGroupIds": ["sg-xxxxx"],
    "UserData": "base64-encoded-setup-script"
  }'

# Create auto scaling group
aws autoscaling create-auto-scaling-group \
  --auto-scaling-group-name vnc-backend-asg \
  --launch-template LaunchTemplateName=vnc-backend-template \
  --min-size 2 \
  --max-size 10 \
  --desired-capacity 2 \
  --target-group-arns arn:aws:elasticloadbalancing:... \
  --vpc-zone-identifier "subnet-xxxxx,subnet-yyyyy"

# Create scaling policies
aws autoscaling put-scaling-policy \
  --auto-scaling-group-name vnc-backend-asg \
  --policy-name scale-out \
  --scaling-adjustment 2 \
  --adjustment-type ChangeInCapacity \
  --cooldown 300
```

### Phase 6: SSL Certificate & Domain (30 minutes)

#### 6.1 Request SSL Certificate

```bash
# Request certificate from ACM
aws acm request-certificate \
  --domain-name vncblockchain.com \
  --subject-alternative-names "*.vncblockchain.com" \
  --validation-method DNS \
  --region ap-south-1

# Get validation records
aws acm describe-certificate --certificate-arn arn:aws:acm:...

# Add CNAME records to your domain DNS (GoDaddy, Namecheap, etc.)
```

#### 6.2 Configure Route 53

```bash
# Create hosted zone
aws route53 create-hosted-zone \
  --name vncblockchain.com \
  --caller-reference "$(date +%s)"

# Get nameservers and update at domain registrar

# Create DNS records
aws route53 change-resource-record-sets \
  --hosted-zone-id Z1234567890ABC \
  --change-batch '{
    "Changes": [{
      "Action": "CREATE",
      "ResourceRecordSet": {
        "Name": "vncblockchain.com",
        "Type": "A",
        "AliasTarget": {
          "HostedZoneId": "ALB-HOSTED-ZONE-ID",
          "DNSName": "vnc-alb-xxxxx.ap-south-1.elb.amazonaws.com",
          "EvaluateTargetHealth": false
        }
      }
    }]
  }'
```

#### 6.3 Update ALB with SSL

```bash
# Add HTTPS listener to ALB
aws elbv2 create-listener \
  --load-balancer-arn arn:aws:elasticloadbalancing:... \
  --protocol HTTPS \
  --port 443 \
  --certificates CertificateArn=arn:aws:acm:... \
  --default-actions Type=forward,TargetGroupArn=arn:...

# Redirect HTTP to HTTPS
aws elbv2 modify-listener \
  --listener-arn arn:aws:elasticloadbalancing:... \
  --default-actions Type=redirect,RedirectConfig='{
    "Protocol": "HTTPS",
    "Port": "443",
    "StatusCode": "HTTP_301"
  }'
```

### Phase 7: Deploy Smart Contracts (1 hour)

```powershell
# On your local machine
cd "d:\VNC Crypto Blockchan\contracts"

# Install Hardhat
npm install

# Configure Hardhat for mainnet
# Edit hardhat.config.js

# Deploy VNCToken
npx hardhat run scripts/deploy.js --network mainnet

# Copy contract addresses
# VNCToken: 0x...
# VNCPresale: 0x...
# VNCStaking: 0x...

# Verify contracts on Etherscan
npx hardhat verify --network mainnet 0x... "VNC Token" "VNC"

# Update backend .env
ssh ubuntu@<backend-ip>
cd /home/ubuntu/vnc-blockchain/backend/api-server
nano .env

# Add:
# PRESALE_CONTRACT_ADDRESS=0x...
# TOKEN_CONTRACT_ADDRESS=0x...

# Restart backend
pm2 restart vnc-backend-api
```

### Phase 8: Monitoring & Logging (30 minutes)

#### 8.1 Setup CloudWatch

```bash
# Create log groups
aws logs create-log-group --log-group-name /aws/vnc/backend
aws logs create-log-group --log-group-name /aws/vnc/frontend

# Create dashboard
aws cloudwatch put-dashboard --dashboard-name VNC-Production --dashboard-body '{
  "widgets": [
    {
      "type": "metric",
      "properties": {
        "metrics": [
          ["AWS/EC2", "CPUUtilization", {"stat": "Average"}]
        ],
        "period": 300,
        "stat": "Average",
        "region": "ap-south-1",
        "title": "EC2 CPU Utilization"
      }
    }
  ]
}'

# Create alarms
aws cloudwatch put-metric-alarm \
  --alarm-name vnc-high-cpu \
  --alarm-description "Alert when CPU exceeds 80%" \
  --metric-name CPUUtilization \
  --namespace AWS/EC2 \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2
```

#### 8.2 Install CloudWatch Agent

```bash
# On EC2 instances
wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i amazon-cloudwatch-agent.deb

# Configure agent
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-config-wizard

# Start agent
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
  -a fetch-config \
  -m ec2 \
  -s \
  -c file:/opt/aws/amazon-cloudwatch-agent/config.json
```

---

## 🧪 POST-DEPLOYMENT TESTING

### Test 1: Backend Health Check

```powershell
curl https://api.vncblockchain.com/health
# Expected: {"status":"OK","timestamp":"..."}
```

### Test 2: Frontend Loading

```powershell
curl https://vncblockchain.com
# Expected: HTML with VNC Blockchain content
```

### Test 3: API Endpoints

```powershell
# Register user
curl -X POST https://api.vncblockchain.com/api/auth/signup `
  -H "Content-Type: application/json" `
  -d '{"email":"test@example.com","password":"Test@123456","name":"Test User"}'

# Login
curl -X POST https://api.vncblockchain.com/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"email":"test@example.com","password":"Test@123456"}'
```

### Test 4: Database Connection

```bash
# SSH into backend server
ssh ubuntu@<backend-ip>

# Test database
npx prisma studio
# Opens at http://localhost:5555
```

### Test 5: Cashfree Webhook

```powershell
# Make test payment
# Verify webhook received at https://api.vncblockchain.com/api/webhooks/cashfree

# Check logs
ssh ubuntu@<backend-ip>
pm2 logs vnc-backend-api
```

### Test 6: Email Notifications

```bash
# Trigger welcome email
# Register new user via frontend
# Check email inbox
```

### Test 7: Load Testing

```powershell
# Install Apache Bench
choco install apache-bench -y

# Test API
ab -n 1000 -c 50 https://api.vncblockchain.com/health

# Test frontend
ab -n 500 -c 25 https://vncblockchain.com/
```

---

## 🔒 SECURITY HARDENING

### 1. Enable AWS WAF

```bash
# Create web ACL
aws wafv2 create-web-acl \
  --name vnc-waf \
  --scope REGIONAL \
  --default-action Block={} \
  --rules file://waf-rules.json \
  --region ap-south-1

# Associate with ALB
aws wafv2 associate-web-acl \
  --web-acl-arn arn:aws:wafv2:... \
  --resource-arn arn:aws:elasticloadbalancing:...
```

### 2. Enable AWS Shield

```bash
# AWS Shield Standard is free and automatic
# For DDoS protection, enable Shield Advanced ($3000/month)
aws shield subscribe
```

### 3. Setup Secrets Manager

```bash
# Store secrets
aws secretsmanager create-secret \
  --name vnc/database/master \
  --secret-string '{"username":"vncadmin","password":"YourPassword"}'

aws secretsmanager create-secret \
  --name vnc/jwt/secret \
  --secret-string '{"secret":"your-jwt-secret"}'

# Update backend to read from Secrets Manager
```

### 4. Enable VPC Flow Logs

```bash
aws ec2 create-flow-logs \
  --resource-type VPC \
  --resource-ids vpc-xxxxx \
  --traffic-type ALL \
  --log-destination-type cloud-watch-logs \
  --log-group-name /aws/vpc/vnc-blockchain
```

### 5. Enable CloudTrail

```bash
aws cloudtrail create-trail \
  --name vnc-audit-trail \
  --s3-bucket-name vnc-cloudtrail-logs

aws cloudtrail start-logging --name vnc-audit-trail
```

---

## 📊 MONITORING DASHBOARD

### Key Metrics to Track:

1. **Backend Metrics:**
   - API response time (p95, p99)
   - Error rate (4xx, 5xx)
   - Request count
   - Database connections
   - Memory usage
   - CPU utilization

2. **Database Metrics:**
   - Connection count
   - Query duration
   - Disk usage
   - Replica lag (if Multi-AZ)

3. **Frontend Metrics:**
   - Page load time
   - JavaScript errors
   - User sessions
   - Bounce rate

4. **Business Metrics:**
   - User registrations
   - Presale purchases
   - Total raised (INR)
   - Active users

---

## 💰 COST OPTIMIZATION

### 1. Purchase Reserved Instances

```bash
# Save 72% on EC2 costs
aws ec2 purchase-reserved-instances-offering \
  --reserved-instances-offering-id xxxxx \
  --instance-count 2

# Before: $122/month (2x t3.large)
# After: $34/month (72% savings)
```

### 2. Enable S3 Intelligent Tiering

```bash
aws s3api put-bucket-intelligent-tiering-configuration \
  --bucket vnc-blockchain-frontend \
  --id default-tier \
  --intelligent-tiering-configuration '{
    "Id": "default-tier",
    "Status": "Enabled",
    "Tierings": [
      {"Days": 90, "AccessTier": "ARCHIVE_ACCESS"},
      {"Days": 180, "AccessTier": "DEEP_ARCHIVE_ACCESS"}
    ]
  }'
```

### 3. Setup Cost Alerts

```bash
aws budgets create-budget \
  --account-id 123456789012 \
  --budget '{
    "BudgetName": "vnc-monthly-budget",
    "BudgetLimit": {"Amount": "500", "Unit": "USD"},
    "TimeUnit": "MONTHLY",
    "BudgetType": "COST"
  }' \
  --notifications-with-subscribers '[{
    "Notification": {
      "NotificationType": "ACTUAL",
      "ComparisonOperator": "GREATER_THAN",
      "Threshold": 80
    },
    "Subscribers": [{
      "SubscriptionType": "EMAIL",
      "Address": "admin@vncblockchain.com"
    }]
  }]'
```

---

## 🆘 TROUBLESHOOTING

### Issue 1: Backend won't start

```bash
# Check PM2 logs
pm2 logs vnc-backend-api

# Common fixes:
pm2 delete vnc-backend-api
pm2 start dist/server.js --name vnc-backend-api
pm2 save
```

### Issue 2: Database connection failed

```bash
# Test connectivity
telnet vnc-blockchain-db.xxxxx.ap-south-1.rds.amazonaws.com 5432

# Check security group
# Ensure backend SG can access database SG on port 5432
```

### Issue 3: SSL certificate not working

```bash
# Check certificate status
aws acm describe-certificate --certificate-arn arn:aws:acm:...

# Verify DNS records
nslookup vncblockchain.com

# Check ALB listener
aws elbv2 describe-listeners --load-balancer-arn arn:...
```

### Issue 4: High costs

```bash
# View cost breakdown
aws ce get-cost-and-usage \
  --time-period Start=2026-01-01,End=2026-01-31 \
  --granularity MONTHLY \
  --metrics BlendedCost

# Identify expensive resources
# Stop unused instances
# Use Reserved Instances
# Enable auto-scaling
```

---

## 🎉 DEPLOYMENT COMPLETE!

### ✅ Your app is now live:
- Frontend: https://vncblockchain.com
- Backend API: https://api.vncblockchain.com
- Admin Panel: https://vncblockchain.com/super-admin
- Database: PostgreSQL on RDS
- Smart Contracts: Deployed to mainnet
- Monitoring: CloudWatch dashboards active
- Security: WAF, Shield, SSL enabled

---

## 📞 POST-LAUNCH SUPPORT

### Week 1 Tasks:
- [ ] Monitor CloudWatch dashboards daily
- [ ] Check error logs
- [ ] Test all user flows
- [ ] Verify email delivery
- [ ] Test Cashfree payments
- [ ] Monitor costs

### Week 2 Tasks:
- [ ] Optimize slow queries
- [ ] Enable Redis caching
- [ ] Setup auto-scaling policies
- [ ] Review security logs
- [ ] Backup testing

### Month 1 Tasks:
- [ ] Purchase Reserved Instances
- [ ] Penetration testing
- [ ] Load testing at scale
- [ ] Customer feedback review
- [ ] Feature improvements

---

**🚀 Congratulations! Your VNC Blockchain is now live in production!**

**Need Help?**
- AWS Support: https://console.aws.amazon.com/support
- Documentation: Read AWS_DEPLOYMENT_GUIDE.md
- Emergency: Check CloudWatch alarms

**Good luck with your launch!** 🎊
