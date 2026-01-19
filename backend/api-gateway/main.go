package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
)

// APIGateway handles all backend API requests
type APIGateway struct {
	router   *mux.Router
	upgrader websocket.Upgrader
}

// Response structures
type APIResponse struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
}

type BlockchainInfo struct {
	ChainID       uint64  `json:"chain_id"`
	LatestBlock   uint64  `json:"latest_block"`
	TotalTxs      uint64  `json:"total_txs"`
	ValidatorCount int    `json:"validator_count"`
	TPS           float64 `json:"tps"`
	NetworkStatus string  `json:"network_status"`
}

type ValidatorInfo struct {
	Address         string  `json:"address"`
	Stake           string  `json:"stake"`
	Commission      float64 `json:"commission"`
	BlocksProduced  uint64  `json:"blocks_produced"`
	BlocksMissed    uint64  `json:"blocks_missed"`
	Uptime          float64 `json:"uptime"`
	IsActive        bool    `json:"is_active"`
}

type TransactionInfo struct {
	Hash        string `json:"hash"`
	From        string `json:"from"`
	To          string `json:"to"`
	Value       string `json:"value"`
	Status      string `json:"status"`
	BlockNumber uint64 `json:"block_number"`
	Timestamp   int64  `json:"timestamp"`
	GasUsed     uint64 `json:"gas_used"`
}

func NewAPIGateway() *APIGateway {
	router := mux.NewRouter()
	
	api := &APIGateway{
		router: router,
		upgrader: websocket.Upgrader{
			CheckOrigin: func(r *http.Request) bool {
				return true // Allow all origins (configure properly in production)
			},
		},
	}

	api.setupRoutes()
	return api
}

func (api *APIGateway) setupRoutes() {
	// Health check
	api.router.HandleFunc("/health", api.healthCheck).Methods("GET")

	// Blockchain API v1
	v1 := api.router.PathPrefix("/api/v1").Subrouter()

	// Blockchain endpoints
	v1.HandleFunc("/blockchain/info", api.getBlockchainInfo).Methods("GET")
	v1.HandleFunc("/blockchain/block/{number}", api.getBlock).Methods("GET")
	v1.HandleFunc("/blockchain/latest-blocks", api.getLatestBlocks).Methods("GET")
	v1.HandleFunc("/blockchain/stats", api.getBlockchainStats).Methods("GET")

	// Transaction endpoints
	v1.HandleFunc("/transaction/{hash}", api.getTransaction).Methods("GET")
	v1.HandleFunc("/transaction/send", api.sendTransaction).Methods("POST")
	v1.HandleFunc("/transaction/pending", api.getPendingTransactions).Methods("GET")

	// Validator endpoints
	v1.HandleFunc("/validators", api.getValidators).Methods("GET")
	v1.HandleFunc("/validator/{address}", api.getValidator).Methods("GET")
	v1.HandleFunc("/validator/register", api.registerValidator).Methods("POST")
	v1.HandleFunc("/validator/performance", api.getValidatorPerformance).Methods("GET")

	// Staking endpoints
	v1.HandleFunc("/staking/delegate", api.delegateStake).Methods("POST")
	v1.HandleFunc("/staking/undelegate", api.undelegateStake).Methods("POST")
	v1.HandleFunc("/staking/rewards/{address}", api.getStakingRewards).Methods("GET")
	v1.HandleFunc("/staking/claim", api.claimRewards).Methods("POST")

	// Presale endpoints
	v1.HandleFunc("/presale/info", api.getPresaleInfo).Methods("GET")
	v1.HandleFunc("/presale/buy", api.buyTokens).Methods("POST")
	v1.HandleFunc("/presale/claim", api.claimTokens).Methods("POST")
	v1.HandleFunc("/presale/vesting/{address}", api.getVestingSchedule).Methods("GET")

	// Account endpoints
	v1.HandleFunc("/account/{address}/balance", api.getBalance).Methods("GET")
	v1.HandleFunc("/account/{address}/transactions", api.getAccountTransactions).Methods("GET")
	v1.HandleFunc("/account/{address}/nonce", api.getNonce).Methods("GET")

	// Network endpoints
	v1.HandleFunc("/network/peers", api.getNetworkPeers).Methods("GET")
	v1.HandleFunc("/network/status", api.getNetworkStatus).Methods("GET")

	// WebSocket endpoint for real-time updates
	v1.HandleFunc("/ws", api.handleWebSocket)

	// Admin endpoints (should be protected with authentication)
	admin := v1.PathPrefix("/admin").Subrouter()
	admin.HandleFunc("/pause", api.pauseContract).Methods("POST")
	admin.HandleFunc("/unpause", api.unpauseContract).Methods("POST")
	admin.HandleFunc("/emergency-withdraw", api.emergencyWithdraw).Methods("POST")
}

// Health check endpoint
func (api *APIGateway) healthCheck(w http.ResponseWriter, r *http.Request) {
	response := map[string]interface{}{
		"status":    "healthy",
		"timestamp": time.Now().Unix(),
		"service":   "VNC Blockchain API Gateway",
		"version":   "1.0.0",
	}
	api.sendJSON(w, http.StatusOK, response)
}

// Get blockchain information
func (api *APIGateway) getBlockchainInfo(w http.ResponseWriter, r *http.Request) {
	// TODO: Get real data from blockchain node
	info := BlockchainInfo{
		ChainID:        20250,
		LatestBlock:    1250,
		TotalTxs:       15430,
		ValidatorCount: 21,
		TPS:            65000.0,
		NetworkStatus:  "running",
	}

	api.sendSuccess(w, info)
}

// Get block by number
func (api *APIGateway) getBlock(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	blockNumber := vars["number"]

	// TODO: Fetch block from blockchain
	block := map[string]interface{}{
		"number":      blockNumber,
		"hash":        "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb4",
		"timestamp":   time.Now().Unix(),
		"validator":   "0x1234567890123456789012345678901234567890",
		"txs":         []string{},
		"parent_hash": "0x0000000000000000000000000000000000000000",
	}

	api.sendSuccess(w, block)
}

// Get latest blocks
func (api *APIGateway) getLatestBlocks(w http.ResponseWriter, r *http.Request) {
	// TODO: Fetch latest blocks from blockchain
	blocks := []map[string]interface{}{
		{
			"number":    1250,
			"hash":      "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb4",
			"timestamp": time.Now().Unix(),
			"tx_count":  15,
		},
	}

	api.sendSuccess(w, blocks)
}

// Get blockchain statistics
func (api *APIGateway) getBlockchainStats(w http.ResponseWriter, r *http.Request) {
	stats := map[string]interface{}{
		"total_blocks":      1250,
		"total_txs":         15430,
		"avg_block_time":    2.0,
		"tps":               65000.0,
		"total_validators":  21,
		"active_validators": 21,
		"total_stake":       "100000000",
	}

	api.sendSuccess(w, stats)
}

// Get transaction by hash
func (api *APIGateway) getTransaction(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	txHash := vars["hash"]

	// TODO: Fetch transaction from blockchain
	tx := TransactionInfo{
		Hash:        txHash,
		From:        "0x1234567890123456789012345678901234567890",
		To:          "0x0987654321098765432109876543210987654321",
		Value:       "1000000000000000000",
		Status:      "success",
		BlockNumber: 1250,
		Timestamp:   time.Now().Unix(),
		GasUsed:     21000,
	}

	api.sendSuccess(w, tx)
}

// Send transaction
func (api *APIGateway) sendTransaction(w http.ResponseWriter, r *http.Request) {
	var txData map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&txData); err != nil {
		api.sendError(w, http.StatusBadRequest, "Invalid transaction data")
		return
	}

	// TODO: Broadcast transaction to network
	result := map[string]interface{}{
		"tx_hash": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb4",
		"status":  "pending",
	}

	api.sendSuccess(w, result)
}

// Get pending transactions
func (api *APIGateway) getPendingTransactions(w http.ResponseWriter, r *http.Request) {
	// TODO: Fetch from mempool
	txs := []map[string]interface{}{}
	api.sendSuccess(w, txs)
}

// Get all validators
func (api *APIGateway) getValidators(w http.ResponseWriter, r *http.Request) {
	// TODO: Fetch validators from blockchain
	validators := []ValidatorInfo{
		{
			Address:        "0x1234567890123456789012345678901234567890",
			Stake:          "1000000000000000000000000",
			Commission:     5.0,
			BlocksProduced: 1000,
			BlocksMissed:   5,
			Uptime:         99.5,
			IsActive:       true,
		},
	}

	api.sendSuccess(w, validators)
}

// Get validator by address
func (api *APIGateway) getValidator(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	address := vars["address"]

	// TODO: Fetch validator from blockchain
	validator := ValidatorInfo{
		Address:        address,
		Stake:          "1000000000000000000000000",
		Commission:     5.0,
		BlocksProduced: 1000,
		BlocksMissed:   5,
		Uptime:         99.5,
		IsActive:       true,
	}

	api.sendSuccess(w, validator)
}

// Register validator
func (api *APIGateway) registerValidator(w http.ResponseWriter, r *http.Request) {
	var validatorData map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&validatorData); err != nil {
		api.sendError(w, http.StatusBadRequest, "Invalid validator data")
		return
	}

	// TODO: Register validator on blockchain
	result := map[string]interface{}{
		"tx_hash": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb4",
		"status":  "pending",
	}

	api.sendSuccess(w, result)
}

// Get validator performance
func (api *APIGateway) getValidatorPerformance(w http.ResponseWriter, r *http.Request) {
	// TODO: Fetch performance metrics
	performance := map[string]interface{}{
		"blocks_produced": 1000,
		"blocks_missed":   5,
		"uptime":          99.5,
		"rewards_earned":  "50000000000000000000000",
	}

	api.sendSuccess(w, performance)
}

// Delegate stake
func (api *APIGateway) delegateStake(w http.ResponseWriter, r *http.Request) {
	api.sendSuccess(w, map[string]string{"status": "success"})
}

// Undelegate stake
func (api *APIGateway) undelegateStake(w http.ResponseWriter, r *http.Request) {
	api.sendSuccess(w, map[string]string{"status": "success"})
}

// Get staking rewards
func (api *APIGateway) getStakingRewards(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	address := vars["address"]

	rewards := map[string]interface{}{
		"address":          address,
		"pending_rewards":  "1000000000000000000000",
		"claimed_rewards":  "5000000000000000000000",
		"total_staked":     "10000000000000000000000",
	}

	api.sendSuccess(w, rewards)
}

// Claim rewards
func (api *APIGateway) claimRewards(w http.ResponseWriter, r *http.Request) {
	api.sendSuccess(w, map[string]string{"status": "success"})
}

// Get presale info
func (api *APIGateway) getPresaleInfo(w http.ResponseWriter, r *http.Request) {
	info := map[string]interface{}{
		"current_stage":    1,
		"price":            "0.006",
		"tokens_sold":      "25000000",
		"tokens_remaining": "35000000",
		"end_time":         time.Now().Add(30 * 24 * time.Hour).Unix(),
	}

	api.sendSuccess(w, info)
}

// Buy tokens
func (api *APIGateway) buyTokens(w http.ResponseWriter, r *http.Request) {
	api.sendSuccess(w, map[string]string{"status": "success"})
}

// Claim tokens
func (api *APIGateway) claimTokens(w http.ResponseWriter, r *http.Request) {
	api.sendSuccess(w, map[string]string{"status": "success"})
}

// Get vesting schedule
func (api *APIGateway) getVestingSchedule(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	address := vars["address"]

	schedule := map[string]interface{}{
		"address":         address,
		"total_amount":    "1000000000000000000000000",
		"released_amount": "300000000000000000000000",
		"vesting_end":     time.Now().Add(180 * 24 * time.Hour).Unix(),
	}

	api.sendSuccess(w, schedule)
}

// Get account balance
func (api *APIGateway) getBalance(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	address := vars["address"]

	balance := map[string]interface{}{
		"address": address,
		"balance": "1000000000000000000000",
	}

	api.sendSuccess(w, balance)
}

// Get account transactions
func (api *APIGateway) getAccountTransactions(w http.ResponseWriter, r *http.Request) {
	api.sendSuccess(w, []map[string]interface{}{})
}

// Get account nonce
func (api *APIGateway) getNonce(w http.ResponseWriter, r *http.Request) {
	api.sendSuccess(w, map[string]interface{}{"nonce": 0})
}

// Get network peers
func (api *APIGateway) getNetworkPeers(w http.ResponseWriter, r *http.Request) {
	peers := []map[string]interface{}{
		{"id": "peer1", "address": "192.168.1.1:30303"},
	}
	api.sendSuccess(w, peers)
}

// Get network status
func (api *APIGateway) getNetworkStatus(w http.ResponseWriter, r *http.Request) {
	status := map[string]interface{}{
		"peer_count": 21,
		"syncing":    false,
		"status":     "running",
	}
	api.sendSuccess(w, status)
}

// WebSocket handler for real-time updates
func (api *APIGateway) handleWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := api.upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("WebSocket upgrade failed: %v", err)
		return
	}
	defer conn.Close()

	// Send periodic updates
	ticker := time.NewTicker(5 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			update := map[string]interface{}{
				"type":      "block",
				"number":    1250,
				"timestamp": time.Now().Unix(),
			}
			if err := conn.WriteJSON(update); err != nil {
				return
			}
		}
	}
}

// Admin endpoints
func (api *APIGateway) pauseContract(w http.ResponseWriter, r *http.Request) {
	api.sendSuccess(w, map[string]string{"status": "paused"})
}

func (api *APIGateway) unpauseContract(w http.ResponseWriter, r *http.Request) {
	api.sendSuccess(w, map[string]string{"status": "unpaused"})
}

func (api *APIGateway) emergencyWithdraw(w http.ResponseWriter, r *http.Request) {
	api.sendSuccess(w, map[string]string{"status": "withdrawn"})
}

// Helper functions
func (api *APIGateway) sendJSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}

func (api *APIGateway) sendSuccess(w http.ResponseWriter, data interface{}) {
	response := APIResponse{
		Success: true,
		Data:    data,
	}
	api.sendJSON(w, http.StatusOK, response)
}

func (api *APIGateway) sendError(w http.ResponseWriter, status int, message string) {
	response := APIResponse{
		Success: false,
		Error:   message,
	}
	api.sendJSON(w, status, response)
}

func main() {
	api := NewAPIGateway()

	// CORS configuration
	corsHandler := handlers.CORS(
		handlers.AllowedOrigins([]string{"*"}),
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}),
		handlers.AllowedHeaders([]string{"Content-Type", "Authorization"}),
	)(api.router)

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Printf("🚀 API Gateway starting on port %s\n", port)
	log.Fatal(http.ListenAndServe(":"+port, corsHandler))
}
