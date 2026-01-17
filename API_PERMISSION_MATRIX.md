# 🔐 API PERMISSION MATRIX - COMPLETE REFERENCE

## Based on Blockchain Blueprint Architecture

This document maps every API endpoint to the RBAC permission matrix, ensuring proper access control across all 7 dashboards.

---

## 🎯 PERMISSION ENFORCEMENT ARCHITECTURE

### 3-Layer Security Model

```
┌─────────────────────────────────────────────────┐
│  USER REQUEST                                   │
│  (Dashboard → API Call)                         │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  GATEWAY LAYER (Smart Gateway)                  │
│  ┌──────────────────────────────────────┐      │
│  │  PEP: Policy Enforcement Point        │      │
│  │  - Extract JWT token                  │      │
│  │  - Get user role                      │      │
│  │  - Forward to PDP                     │      │
│  └──────────────┬───────────────────────┘      │
│                 │                                │
│                 ▼                                │
│  ┌──────────────────────────────────────┐      │
│  │  PDP: Policy Decision Point           │      │
│  │  - Check permission matrix            │      │
│  │  - Evaluate conditions                │      │
│  │  - Query PAP for policies             │      │
│  └──────────────┬───────────────────────┘      │
│                 │                                │
│                 ▼                                │
│  ┌──────────────────────────────────────┐      │
│  │  PAP: Policy Administration Point     │      │
│  │  - Return applicable policies         │      │
│  │  - Return Permit/Deny decision        │      │
│  └──────────────┬───────────────────────┘      │
└─────────────────┼────────────────────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
    PERMIT               DENY
        │                   │
        ▼                   ▼
┌───────────────┐    ┌──────────────┐
│ Execute API   │    │ Return 403   │
│ + Audit Log   │    │ Forbidden    │
└───────────────┘    └──────────────┘
```

---

## 🔑 ROLE DEFINITIONS

| Role | Code | Dashboard Access | User Count |
|------|------|------------------|------------|
| 🔴 Super Admin | `super_admin` | ALL + God Mode | 2-3 |
| 🟠 Admin Ops | `admin_ops` | Admin, Wallet, Presale | 10-20 |
| 🟢 User | `user` | User Dashboard | 8,500+ |
| 🟣 Validator | `validator` | Validator Dashboard | 21 |
| ⚪ Public | `public` | Blockchain Explorer | Unlimited |

---

## 📊 COMPLETE API PERMISSION MATRIX

### 🔴 BLOCKCHAIN CONTROL APIs

| Endpoint | Method | Action | Super Admin | Admin Ops | User | Validator | Public |
|----------|--------|--------|-------------|-----------|------|-----------|--------|
| `/api/blockchain/status` | GET | `view_blockchain_status` | ✅ | ✅ | ❌ | ✅ | ❌ |
| `/api/blockchain/pause` | POST | `pause_blockchain` | ✅ | ❌ | ❌ | ❌ | ❌ |
| `/api/blockchain/resume` | POST | `resume_blockchain` | ✅ | ❌ | ❌ | ❌ | ❌ |
| `/api/blockchain/parameters` | GET | `view_blockchain_params` | ✅ | ✅ | ❌ | ✅ | ❌ |
| `/api/blockchain/parameters` | PUT | `update_blockchain_params` | ✅ | ❌ | ❌ | ❌ | ❌ |
| `/api/blockchain/rollback` | POST | `rollback_blockchain` | ✅ | ❌ | ❌ | ❌ | ❌ |

**Audit**: All actions logged with timestamp, user ID, and parameters

---

### 🪙 TOKEN MANAGEMENT APIs

| Endpoint | Method | Action | Super Admin | Admin Ops | User | Validator | Public |
|----------|--------|--------|-------------|-----------|------|-----------|--------|
| `/api/token/supply` | GET | `view_token_supply` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/api/token/mint` | POST | `mint_token` | ✅ | ❌ | ❌ | ❌ | ❌ |
| `/api/token/burn` | POST | `burn_token` | ✅ | ❌ | ❌ | ❌ | ❌ |
| `/api/token/pause` | POST | `pause_transfers` | ✅ | ❌ | ❌ | ❌ | ❌ |
| `/api/token/resume` | POST | `resume_transfers` | ✅ | ❌ | ❌ | ❌ | ❌ |

**Warning**: Mint/burn actions require extreme caution warnings in UI

---

### 👥 USER MANAGEMENT APIs

| Endpoint | Method | Action | Super Admin | Admin Ops | User | Validator | Public |
|----------|--------|--------|-------------|-----------|------|-----------|--------|
| `/api/users` | GET | `list_users` | ✅ | ✅ | ❌ | ❌ | ❌ |
| `/api/users/:id` | GET | `view_user` | ✅ | ✅ | Self | ❌ | ❌ |
| `/api/users/:id/activate` | POST | `activate_user` | ✅ | ✅ | ❌ | ❌ | ❌ |
| `/api/users/:id/deactivate` | POST | `deactivate_user` | ✅ | ✅ | ❌ | ❌ | ❌ |
| `/api/users/:id/freeze` | POST | `freeze_user_wallet` | ✅ | ✅ | ❌ | ❌ | ❌ |
| `/api/users/:id/unfreeze` | POST | `unfreeze_user_wallet` | ✅ | ✅ | ❌ | ❌ | ❌ |

**Note**: User can only view their own profile (Self)

---

### 📋 KYC MANAGEMENT APIs

| Endpoint | Method | Action | Super Admin | Admin Ops | User | Validator | Public |
|----------|--------|--------|-------------|-----------|------|-----------|--------|
| `/api/kyc/pending` | GET | `list_pending_kyc` | ✅ | ✅ | ❌ | ❌ | ❌ |
| `/api/kyc/:id` | GET | `view_kyc` | ✅ | ✅ | Self | ❌ | ❌ |
| `/api/kyc/:id/approve` | POST | `approve_kyc` | ❌ | ✅ | ❌ | ❌ | ❌ |
| `/api/kyc/:id/reject` | POST | `reject_kyc` | ❌ | ✅ | ❌ | ❌ | ❌ |
| `/api/kyc/submit` | POST | `submit_kyc` | ❌ | ❌ | ✅ | ❌ | ❌ |

**Golden Rule**: Only Admin Ops can approve KYC (NOT Super Admin)

---

### 💰 WALLET SYSTEM APIs

| Endpoint | Method | Action | Super Admin | Admin Ops | User | Validator | Public |
|----------|--------|--------|-------------|-----------|------|-----------|--------|
| `/api/wallet/hot` | GET | `view_hot_wallet` | ✅ | ✅ | ❌ | ❌ | ❌ |
| `/api/wallet/cold` | GET | `view_cold_wallet` | ✅ | ✅ | ❌ | ❌ | ❌ |
| `/api/wallet/transfer/hot-to-cold` | POST | `transfer_hot_to_cold` | ✅ | ✅ | ❌ | ❌ | ❌ |
| `/api/wallet/my` | GET | `view_own_wallet` | ❌ | ❌ | ✅ | ❌ | ❌ |
| `/api/wallet/balance/:user_id` | GET | `view_user_balance` | ✅ | ✅ | Self | ❌ | ❌ |
| `/api/wallet/limits` | GET | `view_wallet_limits` | ✅ | ✅ | ❌ | ❌ | ❌ |
| `/api/wallet/limits` | PUT | `update_wallet_limits` | ✅ | ❌ | ❌ | ❌ | ❌ |

**Security**: Hot/Cold wallet access restricted to financial admins

---

### 🔄 WITHDRAWAL APIs

| Endpoint | Method | Action | Super Admin | Admin Ops | User | Validator | Public |
|----------|--------|--------|-------------|-----------|------|-----------|--------|
| `/api/withdrawal/request` | POST | `request_withdrawal` | ❌ | ❌ | ✅ | ❌ | ❌ |
| `/api/withdrawal/pending` | GET | `list_pending_withdrawals` | ✅ | ✅ | ❌ | ❌ | ❌ |
| `/api/withdrawal/:id` | GET | `view_withdrawal` | ✅ | ✅ | Owner | ❌ | ❌ |
| `/api/withdrawal/:id/approve` | POST | `approve_withdrawal` | ✅ | ✅ | ❌ | ❌ | ❌ |
| `/api/withdrawal/:id/reject` | POST | `reject_withdrawal` | ✅ | ✅ | ❌ | ❌ | ❌ |
| `/api/withdrawal/my` | GET | `view_my_withdrawals` | ❌ | ❌ | ✅ | ❌ | ❌ |

**Multi-Sig**: Large withdrawals (>₹1M) require 3-of-3 approval signatures

---

### 🎫 PRESALE APIs

| Endpoint | Method | Action | Super Admin | Admin Ops | User | Validator | Public |
|----------|--------|--------|-------------|-----------|------|-----------|--------|
| `/api/presale/status` | GET | `view_presale_status` | ✅ | ✅ | ✅ | ❌ | ✅ |
| `/api/presale/buy` | POST | `buy_presale` | ❌ | ❌ | ✅ | ❌ | ❌ |
| `/api/presale/stage` | GET | `view_presale_stage` | ✅ | ✅ | ✅ | ❌ | ✅ |
| `/api/presale/stage` | PUT | `update_presale_stage` | ✅ | ✅ | ❌ | ❌ | ❌ |
| `/api/presale/pause` | POST | `pause_presale` | ✅ | ✅ | ❌ | ❌ | ❌ |
| `/api/presale/resume` | POST | `resume_presale` | ✅ | ✅ | ❌ | ❌ | ❌ |
| `/api/presale/investors` | GET | `list_presale_investors` | ✅ | ✅ | ❌ | ❌ | ❌ |
| `/api/presale/vesting` | GET | `view_vesting_schedule` | ✅ | ✅ | Self | ❌ | ❌ |
| `/api/presale/vesting` | PUT | `update_vesting_schedule` | ✅ | ❌ | ❌ | ❌ | ❌ |

**KYC Requirement**: `buy_presale` requires `kyc_verified == true` (enforced by PDP)

---

### 🏆 VALIDATOR APIs

| Endpoint | Method | Action | Super Admin | Admin Ops | User | Validator | Public |
|----------|--------|--------|-------------|-----------|------|-----------|--------|
| `/api/validators` | GET | `list_validators` | ✅ | ✅ | ❌ | ✅ | ✅ |
| `/api/validators/:id` | GET | `view_validator` | ✅ | ✅ | ❌ | Self | ✅ |
| `/api/validators/:id/approve` | POST | `approve_validator` | ✅ | ❌ | ❌ | ❌ | ❌ |
| `/api/validators/:id/remove` | POST | `remove_validator` | ✅ | ❌ | ❌ | ❌ | ❌ |
| `/api/validators/:id/slash` | POST | `slash_validator` | ✅ | ❌ | ❌ | ❌ | ❌ |
| `/api/validators/:id/stake` | POST | `stake_as_validator` | ❌ | ❌ | ❌ | ✅ | ❌ |
| `/api/validators/:id/blocks` | GET | `view_validator_blocks` | ✅ | ✅ | ❌ | Self | ✅ |
| `/api/validators/:id/rewards` | GET | `view_validator_rewards` | ✅ | ✅ | ❌ | Self | ❌ |

**Critical**: Only Super Admin can slash validators

---

### 📝 AUDIT LOG APIs

| Endpoint | Method | Action | Super Admin | Admin Ops | User | Validator | Public |
|----------|--------|--------|-------------|-----------|------|-----------|--------|
| `/api/audit/logs` | GET | `view_audit_logs` | ✅ | Partial | ❌ | ❌ | ❌ |
| `/api/audit/logs/:action` | GET | `view_audit_by_action` | ✅ | Partial | ❌ | ❌ | ❌ |
| `/api/audit/logs/my` | GET | `view_my_audit_logs` | ❌ | ✅ | ❌ | ❌ | ❌ |

**Partial Access**: Admin Ops can only see their own actions, not system-level logs

---

### 🔍 BLOCKCHAIN EXPLORER APIs (PUBLIC)

| Endpoint | Method | Action | Super Admin | Admin Ops | User | Validator | Public |
|----------|--------|--------|-------------|-----------|------|-----------|--------|
| `/api/explorer/blocks` | GET | `list_blocks` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/api/explorer/blocks/:height` | GET | `view_block` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/api/explorer/transactions` | GET | `list_transactions` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/api/explorer/transactions/:hash` | GET | `view_transaction` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/api/explorer/address/:addr` | GET | `view_address` | ✅ | ✅ | Self | ✅ | ✅ |

**Public Access**: All explorer APIs are public (read-only)

---

## 🛡️ IMPLEMENTATION GUIDE

### Backend Middleware Stack

```go
// Example: Protected Super Admin endpoint
router.POST("/api/blockchain/pause",
    middleware.RequireAuth(),              // Step 1: Verify JWT
    middleware.RequireRole("super_admin"), // Step 2: Check role
    middleware.RequirePermission("pause_blockchain"), // Step 3: Check permission
    middleware.AuditLog(),                 // Step 4: Log action
    handlers.PauseBlockchain,              // Step 5: Execute
)

// Example: User endpoint
router.POST("/api/presale/buy",
    middleware.RequireAuth(),
    middleware.RequireRole("user"),
    middleware.RequirePermission("buy_presale"),
    middleware.CheckKYC(),                 // Additional: Verify KYC
    middleware.AuditLog(),
    handlers.BuyPresale,
)
```

### Frontend Dashboard Protection

```typescript
// Route guard in Next.js
export function DashboardLayout({ children, requiredRole }) {
  const { user } = useAuth();
  
  if (!user || user.role !== requiredRole) {
    return <Redirect to="/unauthorized" />;
  }
  
  return <>{children}</>;
}

// Component-level permission check
function MintTokenButton() {
  const { hasPermission } = useAuth();
  
  if (!hasPermission('mint_token')) {
    return null; // Hide button
  }
  
  return <button onClick={handleMint}>Mint Tokens</button>;
}
```

---

## 🚨 SECURITY RULES (CRITICAL)

### ❌ NEVER MERGE THESE PERMISSIONS

| Action | Reason | Risk Level |
|--------|--------|------------|
| Super Admin + Admin Ops | Privilege escalation | 🔴 CRITICAL |
| User + Wallet System | Fund manipulation | 🔴 CRITICAL |
| Validator + Admin | Consensus attack | 🔴 CRITICAL |
| KYC Approve + User | Self-approval fraud | 🟠 HIGH |

### ✅ SAFE TO MERGE (WITH CAUTION)

| Merge | Condition | Notes |
|-------|-----------|-------|
| Admin Ops + KYC | Same trust level | Common in exchanges |
| Presale Admin + Admin Ops | Read-only control | Can view, limited modify |
| Wallet System + Finance Admin | Internal only | Never expose to users |

---

## 📊 PERMISSION SUMMARY

| Role | Total Permissions | Critical Actions | Dashboard Access |
|------|-------------------|------------------|------------------|
| 🔴 Super Admin | 35+ | Mint, Burn, Pause, Slash | ALL |
| 🟠 Admin Ops | 15-20 | KYC, Freeze, Presale | 3 dashboards |
| 🟢 User | 8-10 | Buy, Stake, Transfer | 1 dashboard |
| 🟣 Validator | 5-8 | Validate, Stake | 1 dashboard |
| ⚪ Public | 5 | View only | Explorer |

---

## 🎯 TESTING CHECKLIST

### For Each API Endpoint:

- [ ] Test with correct role → Should succeed
- [ ] Test with wrong role → Should return 403 Forbidden
- [ ] Test without auth → Should return 401 Unauthorized
- [ ] Test with expired token → Should return 401
- [ ] Verify audit log entry created
- [ ] Verify proper error messages

### For Critical Actions:

- [ ] Super Admin actions logged
- [ ] Multi-sig withdrawals require 3 approvals
- [ ] KYC required for presale purchase
- [ ] Blockchain pause creates alert
- [ ] Token mint/burn shows extreme warning

---

## 📝 COMPLIANCE NOTES

### For Exchange Listing:

✅ All admin actions auditable
✅ Multi-signature for large transfers
✅ Role separation enforced
✅ Public blockchain explorer
✅ KYC integration
✅ Withdrawal approval process

### For Security Audit:

✅ Least privilege principle
✅ No single point of failure
✅ JWT token-based auth
✅ Rate limiting implemented
✅ Input validation on all APIs
✅ SQL injection protection

---

**🔐 THE GOLDEN RULE: If you design permissions correctly, security comes automatically!**

---

*Document Version: 1.0*  
*Last Updated: January 7, 2026*  
*Status: Production Ready* ✅
