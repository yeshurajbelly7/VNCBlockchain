# 🚀 Quick Upload to GitHub - 5 Minute Guide

## 1️⃣ Configure Git (First Time)
```powershell
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

## 2️⃣ Create Repository on GitHub
- Go to https://github.com/new
- Name: `vnc-blockchain`
- Visibility: Public or Private
- **Don't** initialize with README
- Click "Create repository"

## 3️⃣ Upload Your Code
```powershell
cd "d:\VNC Crypto Blockchan"
git add .
git commit -m "Initial commit: VNC Blockchain Platform"
git remote add origin https://github.com/YOUR_USERNAME/vnc-blockchain.git
git branch -M main
git push -u origin main
```

## 4️⃣ Authentication
- Username: Your GitHub username
- Password: **Personal Access Token** (get from https://github.com/settings/tokens)

## ✅ Done!
Your repo will be at: `https://github.com/YOUR_USERNAME/vnc-blockchain`

---

## 📝 What's Included
- ✅ Backend API (Express + TypeScript)
- ✅ Frontend (Next.js 14)
- ✅ Blockchain (Go)
- ✅ Smart Contracts (Solidity)
- ✅ All documentation
- ✅ 7 admin dashboards

## 🔒 What's Excluded
- ❌ node_modules (dependencies)
- ❌ .env files (secrets)
- ❌ Build outputs (dist/, out/)
- ❌ Deployment files

---

**Full guide:** See `GITHUB_UPLOAD_GUIDE.md`
