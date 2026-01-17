package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

// Role-Based Access Control (RBAC) Middleware
// Implements the Permission Matrix from the blockchain blueprint

type Role string

const (
	RoleSuperAdmin Role = "super_admin"
	RoleAdminOps   Role = "admin_ops"
	RoleUser       Role = "user"
	RoleValidator  Role = "validator"
	RolePublic     Role = "public"
)

// Permission represents an API action permission
type Permission struct {
	Action       string
	SuperAdmin   bool
	AdminOps     bool
	User         bool
	Validator    bool
	Public       bool
}

// PermissionMatrix - THE GOLDEN RULE: Least Privilege
// Based on the permission table from the blockchain blueprint
var PermissionMatrix = map[string]Permission{
	// Blockchain Status
	"view_blockchain_status": {
		Action:     "view_blockchain_status",
		SuperAdmin: true,
		AdminOps:   true,
		User:       false,
		Validator:  true,
		Public:     false,
	},
	
	// Blockchain Control
	"pause_blockchain": {
		Action:     "pause_blockchain",
		SuperAdmin: true,
		AdminOps:   false,
		User:       false,
		Validator:  false,
		Public:     false,
	},
	
	// Token Management
	"mint_burn_token": {
		Action:     "mint_burn_token",
		SuperAdmin: true,
		AdminOps:   false,
		User:       false,
		Validator:  false,
		Public:     false,
	},
	
	// KYC Management
	"approve_kyc": {
		Action:     "approve_kyc",
		SuperAdmin: false,
		AdminOps:   true,
		User:       false,
		Validator:  false,
		Public:     false,
	},
	
	// Wallet Operations
	"freeze_user_wallet": {
		Action:     "freeze_user_wallet",
		SuperAdmin: true,
		AdminOps:   true,
		User:       false,
		Validator:  false,
		Public:     false,
	},
	
	// Presale
	"buy_presale": {
		Action:     "buy_presale",
		SuperAdmin: false,
		AdminOps:   false,
		User:       true,
		Validator:  false,
		Public:     false,
	},
	
	// Wallet View
	"view_own_wallet": {
		Action:     "view_own_wallet",
		SuperAdmin: false,
		AdminOps:   false,
		User:       true,
		Validator:  false,
		Public:     false,
	},
	
	// Validator Operations
	"validate_blocks": {
		Action:     "validate_blocks",
		SuperAdmin: false,
		AdminOps:   false,
		User:       false,
		Validator:  true,
		Public:     false,
	},
	
	// Validator Management
	"slash_validator": {
		Action:     "slash_validator",
		SuperAdmin: true,
		AdminOps:   false,
		User:       false,
		Validator:  false,
		Public:     false,
	},
	
	// Audit Logs
	"view_audit_logs": {
		Action:     "view_audit_logs",
		SuperAdmin: true,
		AdminOps:   false, // Partial access implemented separately
		User:       false,
		Validator:  false,
		Public:     false,
	},
}

// RequireRole - Middleware to enforce role-based access
func RequireRole(requiredRoles ...Role) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get user role from JWT token (set by auth middleware)
		userRole, exists := c.Get("user_role")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Unauthorized: No role found",
			})
			c.Abort()
			return
		}

		// Convert to Role type
		role := Role(userRole.(string))

		// Check if user has required role
		hasPermission := false
		for _, requiredRole := range requiredRoles {
			if role == requiredRole {
				hasPermission = true
				break
			}
		}

		if !hasPermission {
			c.JSON(http.StatusForbidden, gin.H{
				"error": "Forbidden: Insufficient permissions",
				"required_roles": requiredRoles,
				"your_role": role,
			})
			c.Abort()
			return
		}

		c.Next()
	}
}

// RequirePermission - Middleware to check specific action permission
func RequirePermission(action string) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get user role from context
		userRole, exists := c.Get("user_role")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Unauthorized: No role found",
			})
			c.Abort()
			return
		}

		role := Role(userRole.(string))

		// Get permission from matrix
		permission, exists := PermissionMatrix[action]
		if !exists {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Permission not defined in matrix",
				"action": action,
			})
			c.Abort()
			return
		}

		// Check if role has permission
		hasPermission := false
		switch role {
		case RoleSuperAdmin:
			hasPermission = permission.SuperAdmin
		case RoleAdminOps:
			hasPermission = permission.AdminOps
		case RoleUser:
			hasPermission = permission.User
		case RoleValidator:
			hasPermission = permission.Validator
		case RolePublic:
			hasPermission = permission.Public
		}

		if !hasPermission {
			c.JSON(http.StatusForbidden, gin.H{
				"error": "Forbidden: You don't have permission for this action",
				"action": action,
				"your_role": role,
			})
			c.Abort()
			return
		}

		c.Next()
	}
}

// AuditLog - Middleware to log all admin actions
func AuditLog() gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, _ := c.Get("user_id")
		userRole, _ := c.Get("user_role")
		action := c.Request.Method + " " + c.Request.URL.Path

		// Log the action (should be stored in database)
		println("AUDIT LOG:", userID, userRole, action)

		c.Next()
	}
}

// GetUserPermissions - Get all permissions for a user role
func GetUserPermissions(role Role) []string {
	permissions := []string{}
	
	for action, perm := range PermissionMatrix {
		hasPermission := false
		
		switch role {
		case RoleSuperAdmin:
			hasPermission = perm.SuperAdmin
		case RoleAdminOps:
			hasPermission = perm.AdminOps
		case RoleUser:
			hasPermission = perm.User
		case RoleValidator:
			hasPermission = perm.Validator
		case RolePublic:
			hasPermission = perm.Public
		}
		
		if hasPermission {
			permissions = append(permissions, action)
		}
	}
	
	return permissions
}
