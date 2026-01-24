# 🚀 VNC Blockchain - FINAL Production Package

**✅ Ready for cPanel - Error-Free Deployment**

---

## 📦 What's Inside

This package contains your complete VNC Blockchain application:

### 1️⃣ Frontend (Next.js)
- **Folder:** `frontend/`
- **Port:** 3002
- **Works like:** http://localhost:3002
- **Will be:** https://vncblockchain.com

### 2️⃣ Backend (Express API)
- **Folder:** `backend/`
- **Port:** 5000
- **Works like:** http://localhost:5000
- **Will be:** https://api.vncblockchain.com

### 3️⃣ Documentation
- Complete deployment guides
- Connection examples are redacted — set production connection strings and secrets using your host's environment variables (cPanel/SSH). Do NOT store real credentials in repository files.
- Production admin info (seed instructions included below)

---

## ⚡ Quick Deployment (50 Minutes)

### Step 1: Upload to cPanel (10 min)

1. Login to your cPanel
2. Go to **File Manager**
3. Navigate to `public_html/`
4. Click **Upload**
5. Upload `vnc-blockchain-FINAL.zip`
6. Right-click → **Extract**
7. Delete the ZIP file after extraction

**Result:** You'll have `frontend/` and `backend/` folders

---

### Step 2: Build Backend (15 min)

Open **cPanel Terminal** or connect via **SSH**:

```bash
# Navigate to backend
cd ~/public_html/backend

# Install dependencies
npm ci --production

# Generate Prisma client
npx prisma generate

# Build TypeScript
npm run build

# Setup database
npx prisma migrate deploy

# Create admin account (ONLY ONE - no demo data!)
# The seeder will create a SUPER_ADMIN account. For security, production passwords are NOT published in repo files.
# Recommended approaches:
# 1) Provide the desired admin password through a secure environment variable or secret manager the seeder reads.
# 2) Run the seeder and immediately update the admin password via the Super Admin UI.
npx ts-node prisma/seed.ts
```

✅ **Backend is now ready!**

---

### Step 3: Configure Backend Node.js App (10 min)

1. **cPanel → Setup Node.js App → Create Application**

2. **Configure Backend:**
   ```
   Node.js version: 20.x
   Application mode: Production
   Application root: backend
   Application startup file: dist/server.js
   Application URL: api.vncblockchain.com
   ```

3. **Add Environment Variables:**
   ```
   PORT=5000
   NODE_ENV=production
   # IMPORTANT: Do NOT store raw passwords in files. Set the full connection string in cPanel env vars.
   # If your password contains special chars (like @), URL-encode them. Example: Admin@2026 -> Admin%402026
   # Example (URL-encoded password):
   # DATABASE_URL=postgresql://vncbloc1_admin:<URL_ENCODED_PASSWORD>@localhost:5432/vncbloc1_vncbloc1_vnc?schema=public
   JWT_SECRET=VNC_BLOCKCHAIN_2026_SUPER_SECURE_SECRET_KEY_256_BIT_MINIMUM
   JWT_REFRESH_SECRET=GENERATE_A_STRONG_REFRESH_SECRET_AT_LEAST_32_CHARS
   JWT_EXPIRES_IN=7d
   FRONTEND_URL=https://vncblockchain.com
   CORS_ORIGIN=https://vncblockchain.com
   
   CASHFREE_APP_ID=your_production_app_id
   CASHFREE_SECRET_KEY=your_production_secret_key
   # The backend reads CASHFREE_MODE. If your docs use CASHFREE_ENVIRONMENT, either set both
   # or rename to CASHFREE_MODE=PRODUCTION
   CASHFREE_MODE=PRODUCTION
   
   SMTP_HOST=turbo.rebootns.com
   SMTP_PORT=465
   SMTP_SECURE=true
   SMTP_USER=otp@vncblockchain.com
   SMTP_PASS=your_email_password
   ```

4. **Click "Start App"**

✅ **Backend API is live!**

---

### Step 4: Configure Frontend Node.js App (10 min)

1. **cPanel → Setup Node.js App → Create Application** (second app)

2. **Configure Frontend:**
   ```
   Node.js version: 20.x
   Application mode: Production
   Application root: frontend
   Application startup file: server.js
   Application URL: vncblockchain.com
   ```

3. **Add Environment Variables:**
   ```
   PORT=3002
   NODE_ENV=production
   NEXT_PUBLIC_API_URL=https://api.vncblockchain.com
   NEXT_PUBLIC_WS_URL=wss://api.vncblockchain.com
   NEXT_PUBLIC_CHAIN_ID=1
   NEXT_PUBLIC_NETWORK_NAME=VNC Blockchain
   NEXT_PUBLIC_ENV=production
   ```

4. **Click "Run NPM Install"** (wait 2-3 minutes)

5. **Click "Start App"**

✅ **Frontend website is live!**

---

### Step 5: Test Everything (5 min)

1. **Test Backend API:**
   ```
   https://api.vncblockchain.com/health
   ```
   Should return a health response (body may vary depending on environment).

2. **Test Frontend:**
   ```
   https://vncblockchain.com
   ```
   Should show: VNC Blockchain home page

3. **Test Login / Admin:**
   - Go to: https://vncblockchain.com/auth/login
   - The Super Admin account is created by the seeder. For security, production passwords are NOT published in repository files.
   - After seeding, update the Super Admin password immediately via the UI (Super Admin → Settings → Security) or reset it using your standard secure flow.

✅ **Everything working!**

---

## 🔐 Default Admin Credentials

```
Email:    admin@vncblockchain.com
Password: (seeded securely or set via environment) — DO NOT keep default production passwords in repository files
Role:     SUPER_ADMIN
```

### ⚠️ CHANGE PASSWORD IMMEDIATELY!

After first login:
1. Go to Super Admin → Settings → Security
2. Change password
3. Update admin email (optional)
4. Enable 2FA

---

## ✅ What's Clean in This Package

✅ **NO demo data** - Only admin account
✅ **NO test users** - Clean database start
✅ **NO fake transactions** - Fresh for production
✅ **Production ready** - Optimized builds
✅ **Error-free** - All dependencies included

---

## 📊 Database Status

When you run `npx ts-node prisma/seed.ts`, you get:

- ✅ **1 account only** - Super Admin
- ✅ **Clean tables** - No demo data
- ✅ **Ready for users** - People can register
- ✅ **Ready for transactions** - Start presale

---

## 🎯 After Deployment Checklist

- [ ] Backend running at https://api.vncblockchain.com
- [ ] Frontend running at https://vncblockchain.com
- [ ] SSL certificates installed (HTTPS working)
- [ ] Login working with admin credentials
- [ ] Changed admin password
- [ ] Configured Cashfree production keys
- [ ] Configured real SMTP email
- [ ] Tested payment flow
- [ ] All 7 dashboards accessible

---

## 📖 Need More Help?

Check these files in the package:
- `CLEAN_DEPLOYMENT_GUIDE.md` - Detailed walkthrough
- `DATABASE_CREDENTIALS.md` - Database info
- `PRODUCTION_ADMIN_ACCOUNT.md` - Admin account details

---

## 🚀 Your URLs After Deployment

- 🌐 **Main Website:** https://vncblockchain.com
- 🔧 **API Backend:** https://api.vncblockchain.com
- 👑 **Super Admin:** https://vncblockchain.com/super-admin
- 💰 **Presale:** https://vncblockchain.com/presale
- 🔍 **Explorer:** https://vncblockchain.com/explorer

---

## ⏱️ Deployment Timeline

- Upload & Extract: **10 minutes**
- Build Backend: **15 minutes**
- Configure Backend: **10 minutes**
- Configure Frontend: **10 minutes**
- Testing: **5 minutes**

**Total: ~50 minutes** ⚡

---

## 💡 Tips

1. **Keep both terminals open** during backend build to see progress
2. **Wait for "Start App" to show green** before testing
3. **Check Node.js App logs** if something doesn't work
4. **Use cPanel Terminal** if SSH is not available

---

**Package Created:** January 20, 2026
**Version:** 1.0.0 - Production Ready
**Status:** ✅ Error-Free, Clean Database, Ready to Deploy

---

🎉 **Good luck with your launch!**

For support, refer to the detailed guides included in this package.
