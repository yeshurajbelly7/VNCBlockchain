package gateway

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"sync"
	"time"
)

// Gateway Layer - Smart Gateway Architecture
// Based on the blockchain blueprint image showing:
// - Smart Gateway between Access Layer and Blockchain Layer
// - Communication links
// - Smart contracts interaction

// SmartGateway manages the interaction between users and blockchain
type SmartGateway struct {
	requests     map[string]*GatewayRequest
	mu           sync.RWMutex
	blockchain   BlockchainInterface
	authSystem   *AuthorizationSystem
}

// GatewayRequest represents a request passing through the gateway
type GatewayRequest struct {
	ID           string
	UserID       string
	UserRole     string
	Action       string
	Payload      map[string]interface{}
	Status       string // pending, validated, approved, rejected, executed
	CreatedAt    time.Time
	ValidatedAt  *time.Time
	ExecutedAt   *time.Time
	Hash         string
}

// BlockchainInterface - Interface to blockchain layer
type BlockchainInterface interface {
	SubmitTransaction(tx interface{}) error
	ValidateBlock(block interface{}) (bool, error)
	GetBlockHeight() int64
}

// NewSmartGateway creates a new gateway instance
func NewSmartGateway(blockchain BlockchainInterface) *SmartGateway {
	return &SmartGateway{
		requests:   make(map[string]*GatewayRequest),
		blockchain: blockchain,
		authSystem: NewAuthorizationSystem(),
	}
}

// ProcessRequest - Main gateway function to process all requests
func (sg *SmartGateway) ProcessRequest(userID, userRole, action string, payload map[string]interface{}) (*GatewayRequest, error) {
	// Step 1: Create request
	req := &GatewayRequest{
		ID:        generateRequestID(),
		UserID:    userID,
		UserRole:  userRole,
		Action:    action,
		Payload:   payload,
		Status:    "pending",
		CreatedAt: time.Now(),
	}
	
	// Step 2: Calculate request hash
	req.Hash = sg.calculateRequestHash(req)
	
	// Step 3: Authorization check (PEP -> PDP -> PAP)
	decision, err := sg.authSystem.Authorize(userID, userRole, action, payload)
	if err != nil {
		req.Status = "rejected"
		return req, fmt.Errorf("authorization failed: %v", err)
	}
	
	if decision.Decision != "Permit" {
		req.Status = "rejected"
		return req, fmt.Errorf("access denied: %s", decision.Reason)
	}
	
	// Step 4: Validate request
	if err := sg.validateRequest(req); err != nil {
		req.Status = "rejected"
		return req, fmt.Errorf("validation failed: %v", err)
	}
	
	now := time.Now()
	req.ValidatedAt = &now
	req.Status = "validated"
	
	// Step 5: Store request
	sg.mu.Lock()
	sg.requests[req.ID] = req
	sg.mu.Unlock()
	
	// Step 6: Execute on blockchain (if applicable)
	if sg.isBlockchainAction(action) {
		if err := sg.executeOnBlockchain(req); err != nil {
			req.Status = "failed"
			return req, fmt.Errorf("blockchain execution failed: %v", err)
		}
		execTime := time.Now()
		req.ExecutedAt = &execTime
		req.Status = "executed"
	} else {
		req.Status = "approved"
	}
	
	return req, nil
}

// calculateRequestHash - Generate hash for request integrity
func (sg *SmartGateway) calculateRequestHash(req *GatewayRequest) string {
	data := fmt.Sprintf("%s|%s|%s|%s|%v",
		req.ID, req.UserID, req.UserRole, req.Action, req.Payload)
	hash := sha256.Sum256([]byte(data))
	return hex.EncodeToString(hash[:])
}

// validateRequest - Validate request parameters
func (sg *SmartGateway) validateRequest(req *GatewayRequest) error {
	// Validate based on action type
	switch req.Action {
	case "buy_presale":
		if _, ok := req.Payload["amount"]; !ok {
			return fmt.Errorf("amount is required")
		}
	case "transfer_tokens":
		if _, ok := req.Payload["to"]; !ok {
			return fmt.Errorf("recipient address is required")
		}
		if _, ok := req.Payload["amount"]; !ok {
			return fmt.Errorf("amount is required")
		}
	case "stake_tokens":
		if _, ok := req.Payload["amount"]; !ok {
			return fmt.Errorf("amount is required")
		}
		if _, ok := req.Payload["duration"]; !ok {
			return fmt.Errorf("duration is required")
		}
	}
	
	return nil
}

// isBlockchainAction - Check if action requires blockchain execution
func (sg *SmartGateway) isBlockchainAction(action string) bool {
	blockchainActions := map[string]bool{
		"buy_presale":      true,
		"transfer_tokens":  true,
		"stake_tokens":     true,
		"validate_blocks":  true,
		"mint_burn_token":  true,
	}
	
	return blockchainActions[action]
}

// executeOnBlockchain - Execute validated request on blockchain
func (sg *SmartGateway) executeOnBlockchain(req *GatewayRequest) error {
	// Convert request to blockchain transaction
	tx := map[string]interface{}{
		"type":      req.Action,
		"from":      req.UserID,
		"data":      req.Payload,
		"hash":      req.Hash,
		"timestamp": req.CreatedAt.Unix(),
	}
	
	return sg.blockchain.SubmitTransaction(tx)
}

// GetRequestStatus - Get status of a request
func (sg *SmartGateway) GetRequestStatus(requestID string) (*GatewayRequest, error) {
	sg.mu.RLock()
	defer sg.mu.RUnlock()
	
	req, exists := sg.requests[requestID]
	if !exists {
		return nil, fmt.Errorf("request not found")
	}
	
	return req, nil
}

// Authorization System - PEP/PDP/PAP Architecture
// Based on image 3 showing Authorization System with CH, PDP, PAP components

// AuthorizationSystem implements XACML-style access control
type AuthorizationSystem struct {
	policies map[string]*Policy
	mu       sync.RWMutex
}

// Policy represents an access control policy
type Policy struct {
	ID          string
	Description string
	Target      PolicyTarget
	Rules       []PolicyRule
}

// PolicyTarget defines what the policy applies to
type PolicyTarget struct {
	Roles   []string
	Actions []string
}

// PolicyRule defines conditions and effects
type PolicyRule struct {
	Condition string // e.g., "amount < 1000000"
	Effect    string // Permit or Deny
}

// Decision represents authorization decision
type Decision struct {
	Decision string // Permit, Deny, NotApplicable
	Reason   string
}

// NewAuthorizationSystem creates authorization system
func NewAuthorizationSystem() *AuthorizationSystem {
	as := &AuthorizationSystem{
		policies: make(map[string]*Policy),
	}
	
	// Initialize default policies
	as.initializeDefaultPolicies()
	
	return as
}

// initializeDefaultPolicies - Set up default security policies
func (as *AuthorizationSystem) initializeDefaultPolicies() {
	// Policy 1: Super Admin can do anything
	as.policies["super_admin_policy"] = &Policy{
		ID:          "super_admin_policy",
		Description: "Super Admin has full access",
		Target: PolicyTarget{
			Roles:   []string{"super_admin"},
			Actions: []string{"*"},
		},
		Rules: []PolicyRule{
			{Condition: "true", Effect: "Permit"},
		},
	}
	
	// Policy 2: Users can only buy presale
	as.policies["user_presale_policy"] = &Policy{
		ID:          "user_presale_policy",
		Description: "Users can buy presale tokens",
		Target: PolicyTarget{
			Roles:   []string{"user"},
			Actions: []string{"buy_presale"},
		},
		Rules: []PolicyRule{
			{Condition: "kyc_verified == true", Effect: "Permit"},
			{Condition: "kyc_verified == false", Effect: "Deny"},
		},
	}
	
	// Policy 3: Admin Ops can approve KYC
	as.policies["admin_kyc_policy"] = &Policy{
		ID:          "admin_kyc_policy",
		Description: "Admin Ops can approve KYC",
		Target: PolicyTarget{
			Roles:   []string{"admin_ops"},
			Actions: []string{"approve_kyc", "reject_kyc"},
		},
		Rules: []PolicyRule{
			{Condition: "true", Effect: "Permit"},
		},
	}
}

// Authorize - Main authorization function (PDP)
func (as *AuthorizationSystem) Authorize(userID, userRole, action string, context map[string]interface{}) (*Decision, error) {
	as.mu.RLock()
	defer as.mu.RUnlock()
	
	// Check all applicable policies
	for _, policy := range as.policies {
		if as.isPolicyApplicable(policy, userRole, action) {
			decision := as.evaluatePolicy(policy, context)
			if decision.Decision != "NotApplicable" {
				return decision, nil
			}
		}
	}
	
	// Default deny
	return &Decision{
		Decision: "Deny",
		Reason:   "No applicable policy found",
	}, nil
}

// isPolicyApplicable - Check if policy applies to this request
func (as *AuthorizationSystem) isPolicyApplicable(policy *Policy, role, action string) bool {
	// Check role
	roleMatch := false
	for _, r := range policy.Target.Roles {
		if r == "*" || r == role {
			roleMatch = true
			break
		}
	}
	
	if !roleMatch {
		return false
	}
	
	// Check action
	actionMatch := false
	for _, a := range policy.Target.Actions {
		if a == "*" || a == action {
			actionMatch = true
			break
		}
	}
	
	return actionMatch
}

// evaluatePolicy - Evaluate policy rules
func (as *AuthorizationSystem) evaluatePolicy(policy *Policy, context map[string]interface{}) *Decision {
	// Evaluate each rule
	for _, rule := range policy.Rules {
		// Simple rule evaluation (in production, use proper expression evaluator)
		if rule.Condition == "true" {
			return &Decision{
				Decision: rule.Effect,
				Reason:   fmt.Sprintf("Policy %s matched", policy.ID),
			}
		}
	}
	
	return &Decision{
		Decision: "NotApplicable",
		Reason:   "No rules matched",
	}
}

// Utility functions

func generateRequestID() string {
	return fmt.Sprintf("REQ-%d", time.Now().UnixNano())
}

// Mock blockchain implementation for testing
type MockBlockchain struct{}

func (mb *MockBlockchain) SubmitTransaction(tx interface{}) error {
	txJSON, _ := json.MarshalIndent(tx, "", "  ")
	fmt.Printf("Blockchain TX submitted:\n%s\n", string(txJSON))
	return nil
}

func (mb *MockBlockchain) ValidateBlock(block interface{}) (bool, error) {
	return true, nil
}

func (mb *MockBlockchain) GetBlockHeight() int64 {
	return 12345
}
