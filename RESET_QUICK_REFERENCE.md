# Data Reset - Quick Reference

## 🚀 Fresh Server Deployment

```bash
# 1. Clone repository
git clone <repository-url>
cd VNCBlockchain

# 2. Initialize server (resets everything and starts fresh)
bash ./scripts/init-server.sh
```

That's it! Everything will start from 0.

---

## 🔄 Reset Commands

### Reset Everything
```bash
# Linux/Mac
npm run reset:all

# Windows
npm run reset:all:windows
```

### Reset Database Only
```bash
cd backend/api-server
npm run db:reset
npm run seed
```

### Reset Blockchain Only
```bash
cd blockchain
go run scripts/reset-data.go
```

---

## ✅ What Gets Reset to 0

| Component | Reset Value |
|-----------|-------------|
| Presale tokens_sold | 0 |
| Presale total_raised | 0 |
| Presale participants | 0 |
| User balances (INR, VNC, ETH, USDT) | 0 |
| Blockchain blocks | 0 (genesis) |
| Transactions | 0 |
| All user data | Deleted (except admin) |

---

## 📋 Initial Data After Reset

### Presale Stage 1
- Price: ₹0.50 / $0.006 per token
- Available: 2,000,000,000 tokens
- Sold: 0
- Raised: 0
- Participants: 0

### Default Admin User
- Email: `admin@vncblockchain.com`
- Password: `Admin@123456`
- Role: SUPER_ADMIN
- All Balances: 0

---

## 🐳 Docker Options

### Standard (with persistent data)
```bash
docker-compose up -d
```

### Fresh Start (no persistent data)
```bash
docker-compose -f docker-compose.fresh.yml up -d
```

---

## 📚 Full Documentation

See [DATA_RESET_GUIDE.md](./DATA_RESET_GUIDE.md) for complete documentation.
