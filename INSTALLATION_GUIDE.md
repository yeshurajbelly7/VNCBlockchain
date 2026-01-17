# VNC Blockchain Platform - Installation Guide

## 🚀 First-Time Setup

### Access Installation Page
1. Navigate to: **http://localhost:3002** or **https://vncblockchain.com**
2. You will be automatically redirected to `/install` if the system is not configured
3. Complete the installation wizard

### Installation Steps

#### 1. Administrator Account Setup
Configure the main admin account with full system access:
- **Full Name**: Your administrator name
- **Email Address**: Admin email (e.g., admin@vncblockchain.com)
- **Password**: Strong password (minimum 8 characters)
- **Confirm Password**: Re-enter password for verification

#### 2. System Configuration
Set up your organization details:
- **Organization Name**: VNC Blockchain (default)
- **Website URL**: https://vncblockchain.com
- **Support Email**: support@vncblockchain.com

#### 3. Complete Installation
- Review all information
- Click "Install VNC Blockchain"
- Save the displayed credentials securely

---

## 📋 Default Credentials (After Installation)

### Admin Account
- **Email**: (What you set during installation)
- **Password**: (What you set during installation)
- **Access Level**: Full admin access

### Demo User Account
- **Email**: user@vncblockchain.com
- **Password**: User@123456
- **Access Level**: Standard user access

⚠️ **IMPORTANT**: Change default passwords immediately after first login!

---

## 🔐 Login Process

1. Visit: **http://localhost:3002/login**
2. Enter your credentials (admin or user)
3. Click "Sign In"
4. You'll be redirected to the dashboard

### Protected Routes
After login, you can access:
- `/dashboard` - Main user dashboard
- `/presale` - Token presale page
- `/wallet` - Crypto wallet management
- `/super-admin` - Admin panel (admin only)

---

## 🔄 Reset Installation

If you need to reset the entire system:

1. Navigate to: **http://localhost:3002/reset-installation**
2. Enter the master reset password: **VNC@Reset2026**
3. Check the confirmation checkbox
4. Click "Reset Installation"

⚠️ **WARNING**: This will permanently delete ALL data including:
- All administrator accounts
- All user accounts
- System configuration
- Authentication tokens

---

## 🌐 Domain Configuration

### Single Domain Setup (vncblockchain.com)

This platform is designed to run on a single domain with different sections:

```
vncblockchain.com/
├── /                    → Home page (presale landing)
├── /login               → User login
├── /signup              → User registration
├── /install             → First-time setup (auto-redirect)
├── /dashboard           → User dashboard
├── /presale             → Token sale page
├── /wallet              → Wallet management
├── /super-admin         → Admin panel
├── /validator-dashboard → Validator stats
└── /blockchain-explorer → Block explorer
```

### Deployment Notes
- All routes are within the same Next.js application
- No subdomains required
- Single SSL certificate needed
- Easy to manage and deploy

---

## 🛠️ Technical Details

### Storage
- **Method**: LocalStorage (development)
- **Production**: Replace with database (PostgreSQL/MongoDB recommended)

### Authentication
- **Method**: Token-based (localStorage)
- **Production**: Implement JWT with refresh tokens
- **Security**: Add rate limiting, 2FA, and password hashing

### Credentials Storage
Current localStorage keys:
- `vnc_system_installed`: Installation status
- `vnc_admin_user`: Admin user data
- `vnc_system_config`: System configuration
- `vnc_default_users`: Default user accounts
- `vnc_auth_token`: Current session token
- `vnc_user_email`: Logged-in user email
- `vnc_user_role`: User role (admin/user)

---

## 🔒 Security Recommendations

### For Production Deployment:

1. **Password Hashing**
   - Use bcrypt or Argon2 for password hashing
   - Never store plain text passwords

2. **Database Migration**
   - Move from localStorage to secure database
   - Use parameterized queries to prevent SQL injection

3. **JWT Implementation**
   - Replace localStorage tokens with HTTP-only cookies
   - Implement refresh token rotation
   - Add token expiration and validation

4. **Environment Variables**
   - Store sensitive data in .env files
   - Never commit credentials to version control
   - Use different configs for dev/staging/production

5. **HTTPS**
   - Enforce HTTPS in production
   - Use valid SSL certificates
   - Implement HSTS headers

6. **Rate Limiting**
   - Add rate limiting on login attempts
   - Implement CAPTCHA for signup/login
   - Monitor for brute force attacks

7. **Input Validation**
   - Sanitize all user inputs
   - Validate on both client and server
   - Prevent XSS and injection attacks

8. **Change Default Passwords**
   - Master reset password: VNC@Reset2026
   - Demo user password: User@123456
   - All default credentials should be changed

---

## 📞 Support

- **Email**: support@vncblockchain.com
- **Website**: https://vncblockchain.com
- **Documentation**: /docs

---

## 🎯 Quick Start Checklist

- [ ] Visit http://localhost:3002 or vncblockchain.com
- [ ] Complete installation wizard
- [ ] Save admin credentials securely
- [ ] Login with admin account
- [ ] Change default passwords
- [ ] Test user account login
- [ ] Configure system settings
- [ ] Review security recommendations
- [ ] Deploy to production with proper security

---

**Version**: 1.0.0  
**Last Updated**: January 8, 2026  
**Platform**: VNC Blockchain - Quantum-Ready Blockchain
