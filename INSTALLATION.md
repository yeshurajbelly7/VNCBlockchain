# VNC-20 Blockchain - Installation & Setup Guide

## 🚀 Quick Start

This guide will help you set up the complete VNC-20 blockchain development environment.

## 📋 Prerequisites

### Required Software

1. **Node.js** (v18 or higher)
   ```powershell
   # Check if installed
   node --version
   
   # Download from: https://nodejs.org/
   ```

2. **npm** (v9 or higher)
   ```powershell
   npm --version
   ```

3. **Git**
   ```powershell
   git --version
   
   # Download from: https://git-scm.com/
   ```

4. **Docker Desktop** (for Windows)
   - Download from: https://www.docker.com/products/docker-desktop/
   - Includes Docker Compose

5. **Visual Studio Code** (recommended)
   - Download from: https://code.visualstudio.com/

### Recommended VS Code Extensions

- ESLint
- Prettier
- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense
- Docker
- GitLens

## 📦 Installation Steps

### Step 1: Clone the Repository

```powershell
cd d:\
git clone <your-repo-url> "VNC Crypto Blockchan"
cd "VNC Crypto Blockchan"
```

### Step 2: Install Root Dependencies

```powershell
npm install
```

### Step 3: Set Up Environment Variables

```powershell
# Copy the example environment file
Copy-Item .env.example .env

# Edit .env with your preferred editor
code .env
```

**Important**: Update the following variables in `.env`:
- Database passwords
- JWT secret
- API keys
- Any external service credentials

### Step 4: Install Frontend Dependencies

Navigate to each frontend workspace and install dependencies:

```powershell
# Public Website
cd frontend\public-website
npm install
cd ..\..

# User Wallet
cd frontend\user-wallet
npm install
cd ..\..

# Developer Portal
cd frontend\developer-portal
npm install
cd ..\..

# Validator Dashboard
cd frontend\validator-dashboard
npm install
cd ..\..

# Governance Portal
cd frontend\governance-portal
npm install
cd ..\..

# Admin Dashboard
cd frontend\admin-dashboard
npm install
cd ..\..
```

### Step 5: Install Backend Dependencies

```powershell
# API Gateway
cd backend\api-gateway
npm install
cd ..\..

# RPC Server
cd backend\rpc-server
npm install
cd ..\..

# Indexer
cd backend\indexer
npm install
cd ..\..

# WebSocket Server
cd backend\websocket-server
npm install
cd ..\..
```

## 🐳 Docker Setup (Recommended for Development)

### Start All Services

```powershell
# Start databases and infrastructure
docker-compose up -d

# Check if all containers are running
docker-compose ps

# View logs
docker-compose logs -f
```

### Individual Service Commands

```powershell
# Start only databases
docker-compose up -d postgres redis mongodb

# Start specific service
docker-compose up -d api-gateway

# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: deletes data)
docker-compose down -v

# Restart a service
docker-compose restart api-gateway
```

## 💻 Running in Development Mode

### Option 1: Run All Services (Recommended)

From the root directory:

```powershell
npm run dev
```

This starts all frontend and backend services concurrently.

### Option 2: Run Individual Services

```powershell
# Public Website (Port 3001)
npm run dev:public

# User Wallet (Port 3002)
npm run dev:wallet

# Developer Portal (Port 3003)
npm run dev:developer

# Validator Dashboard (Port 3004)
npm run dev:validator

# Governance Portal (Port 3005)
npm run dev:governance

# Admin Dashboard (Port 3006)
npm run dev:admin

# API Gateway (Port 3000)
npm run dev:api
```

### Access the Applications

Once started, you can access:

- **Public Website**: http://localhost:3001
- **User Wallet**: http://localhost:3002
- **Developer Portal**: http://localhost:3003
- **Validator Dashboard**: http://localhost:3004
- **Governance Portal**: http://localhost:3005
- **Admin Dashboard**: http://localhost:3006
- **API Gateway**: http://localhost:3000/api/v1
- **Grafana**: http://localhost:3007 (admin/admin)
- **Prometheus**: http://localhost:9090

## 🗄️ Database Setup

### Initialize Databases

```powershell
# Run migrations
npm run db:migrate

# Seed initial data
npm run db:seed
```

### Manual Database Access

```powershell
# PostgreSQL
docker exec -it vnc-postgres psql -U vnc_admin -d vnc_blockchain

# MongoDB
docker exec -it vnc-mongodb mongosh -u vnc_admin -p vnc_mongo_password

# Redis
docker exec -it vnc-redis redis-cli
AUTH vnc_redis_password
```

## 🛠️ Building for Production

```powershell
# Build all services
npm run build

# Build specific frontend
cd frontend\public-website
npm run build
npm run start
```

## 🧪 Running Tests

```powershell
# Run all tests
npm test

# Run tests for specific workspace
npm test --workspace=frontend/public-website

# Run tests with coverage
npm test -- --coverage
```

## 📝 Code Quality

```powershell
# Lint all code
npm run lint

# Format code with Prettier
npm run format

# Type check TypeScript
cd frontend\public-website
npm run type-check
```

## 🐛 Troubleshooting

### Port Already in Use

```powershell
# Find process using a port (e.g., 3001)
netstat -ano | findstr :3001

# Kill the process (replace PID with the actual process ID)
taskkill /PID <PID> /F
```

### Docker Issues

```powershell
# Reset Docker
docker-compose down -v
docker system prune -a
docker-compose up -d

# Check Docker logs
docker-compose logs <service-name>
```

### Module Not Found Errors

```powershell
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
Remove-Item -Recurse -Force node_modules
npm install
```

### TypeScript Errors

```powershell
# Rebuild TypeScript project
cd frontend\public-website
Remove-Item -Recurse -Force .next
npm run build
```

## 🔒 Security Checklist

Before deploying to production:

- [ ] Change all default passwords in `.env`
- [ ] Generate strong JWT secret
- [ ] Configure CORS properly
- [ ] Set up SSL/TLS certificates
- [ ] Enable rate limiting
- [ ] Review and update firewall rules
- [ ] Set up monitoring and alerting
- [ ] Configure backup strategies
- [ ] Review smart contract audits
- [ ] Enable 2FA for admin accounts

## 📚 Project Structure

```
VNC-Crypto-Blockchain/
├── frontend/              # All dashboard frontends
│   ├── public-website/   # Public network dashboard
│   ├── user-wallet/      # Wallet interface
│   ├── developer-portal/ # Developer tools
│   ├── validator-dashboard/
│   ├── governance-portal/
│   └── admin-dashboard/
├── backend/              # Backend services
│   ├── api-gateway/      # Main API
│   ├── rpc-server/       # JSON-RPC
│   ├── indexer/          # Blockchain indexer
│   └── websocket-server/ # Real-time events
├── blockchain/           # Core blockchain
│   ├── consensus/        # DPoS-BFT
│   ├── execution/        # Parallel execution
│   └── networking/       # P2P layer
├── contracts/            # Smart contracts
│   ├── standards/        # VNC-20, VNC-721, etc.
│   ├── governance/       # DAO contracts
│   └── staking/          # Staking contracts
├── docs/                 # Documentation
└── tools/                # Development tools
```

## 🆘 Getting Help

- **Documentation**: https://docs.vnc20.io
- **Discord**: https://discord.gg/vnc20
- **Telegram**: https://t.me/vnc20official
- **GitHub Issues**: https://github.com/vnc20/vnc-blockchain/issues

## 📄 License

Apache License 2.0 - see LICENSE file for details

---

**Next Steps**: After installation, check out the [Development Guide](./docs/DEVELOPMENT.md) to start building on VNC-20.
