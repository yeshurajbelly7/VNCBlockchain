package consensus

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"math/big"
	"sync"
	"time"
)

// DPoSBFT implements Delegated Proof of Stake with Byzantine Fault Tolerance
type DPoSBFT struct {
	config         Config
	validators     map[string]*Validator
	currentEpoch   uint64
	currentBlock   uint64
	pendingBlocks  map[uint64]*Block
	blockVotes     map[uint64]map[string]bool
	mu             sync.RWMutex
	mempool        *Mempool
	stateDB        *StateDB
	isRunning      bool
}

// Config holds consensus configuration
type Config struct {
	ChainID           uint64
	BlockTime         int // seconds
	MaxValidators     int
	FinalityBlocks    int
	MinValidatorStake float64
	QuantumSecured    bool // Enable quantum security features
}

// Validator represents a network validator
type Validator struct {
	Address       string
	Stake         *big.Int
	DelegatedStake *big.Int
	Commission    float64
	IsActive      bool
	VotingPower   uint64
	BlocksProduced uint64
	MissedBlocks  uint64
}

// Block represents a blockchain block
type Block struct {
	Number        uint64
	Hash          string
	PreviousHash  string
	Timestamp     int64
	Transactions  []*Transaction
	Validator     string
	Signature     string
	StateRoot     string
	TxRoot        string
	GasUsed       uint64
	GasLimit      uint64
}

// Transaction represents a blockchain transaction
type Transaction struct {
	Hash     string
	From     string
	To       string
	Value    *big.Int
	Nonce    uint64
	GasPrice *big.Int
	GasLimit uint64
	Data     []byte
	Signature string
}

// Mempool holds pending transactions
type Mempool struct {
	transactions map[string]*Transaction
	mu           sync.RWMutex
}

// StateDB manages blockchain state
type StateDB struct {
	balances map[string]*big.Int
	nonces   map[string]uint64
	mu       sync.RWMutex
}

// NewDPoSBFT creates a new consensus engine
func NewDPoSBFT(config Config) *DPoSBFT {
	return &DPoSBFT{
		config:        config,
		validators:    make(map[string]*Validator),
		pendingBlocks: make(map[uint64]*Block),
		blockVotes:    make(map[uint64]map[string]bool),
		mempool:       NewMempool(),
		stateDB:       NewStateDB(),
		currentBlock:  0,
		currentEpoch:  0,
		isRunning:     false,
	}
}

// Start begins the consensus process
func (d *DPoSBFT) Start() {
	d.mu.Lock()
	d.isRunning = true
	d.mu.Unlock()

	fmt.Println("🎯 Consensus Engine Started")
	
	ticker := time.NewTicker(time.Duration(d.config.BlockTime) * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			d.produceBlock()
		}
	}
}

// produceBlock creates and proposes a new block
func (d *DPoSBFT) produceBlock() {
	d.mu.Lock()
	defer d.mu.Unlock()

	// Select block proposer
	proposer := d.selectProposer()
	if proposer == "" {
		return
	}

	// Collect transactions from mempool
	txs := d.mempool.GetPendingTransactions(1000)

	// Create block
	block := &Block{
		Number:       d.currentBlock + 1,
		PreviousHash: d.getPreviousBlockHash(),
		Timestamp:    time.Now().Unix(),
		Transactions: txs,
		Validator:    proposer,
		GasLimit:     30_000_000,
	}

	// Calculate transaction root
	block.TxRoot = d.calculateTxRoot(txs)

	// Execute transactions and update state
	gasUsed := d.executeTransactions(txs)
	block.GasUsed = gasUsed

	// Calculate state root
	block.StateRoot = d.stateDB.GetRoot()

	// Generate block hash
	block.Hash = d.calculateBlockHash(block)

	// Sign block
	block.Signature = d.signBlock(block, proposer)

	// Broadcast for validation
	d.pendingBlocks[block.Number] = block
	d.blockVotes[block.Number] = make(map[string]bool)

	fmt.Printf("📦 Block #%d proposed by %s with %d transactions\n", 
		block.Number, proposer[:10], len(txs))

	// Simulate validation (in production, wait for network votes)
	go d.validateBlock(block)
}

// selectProposer selects the next block proposer
func (d *DPoSBFT) selectProposer() string {
	validators := d.getActiveValidators()
	if len(validators) == 0 {
		return ""
	}

	// Round-robin selection based on block number
	index := int(d.currentBlock) % len(validators)
	return validators[index].Address
}

// validateBlock validates a proposed block
func (d *DPoSBFT) validateBlock(block *Block) {
	time.Sleep(500 * time.Millisecond) // Simulate validation time

	d.mu.Lock()
	defer d.mu.Unlock()

	// Verify block hash
	calculatedHash := d.calculateBlockHash(block)
	if calculatedHash != block.Hash {
		fmt.Println("❌ Block validation failed: Invalid hash")
		return
	}

	// Verify validator signature
	// In production: verify cryptographic signature

	// Collect votes (simulate BFT voting)
	votes := d.collectVotes(block)

	// Check if 2/3+ validators voted
	requiredVotes := (len(d.validators) * 2) / 3
	if len(votes) >= requiredVotes {
		d.finalizeBlock(block)
	}
}

// finalizeBlock adds block to chain after consensus
func (d *DPoSBFT) finalizeBlock(block *Block) {
	d.currentBlock = block.Number
	delete(d.pendingBlocks, block.Number)
	delete(d.blockVotes, block.Number)

	// Update validator stats
	if validator, exists := d.validators[block.Validator]; exists {
		validator.BlocksProduced++
	}

	fmt.Printf("✅ Block #%d finalized (Hash: %s...)\n", 
		block.Number, block.Hash[:10])
}

// collectVotes simulates BFT voting
func (d *DPoSBFT) collectVotes(block *Block) map[string]bool {
	votes := make(map[string]bool)
	for addr := range d.validators {
		// Simulate voting (in production: collect from network)
		votes[addr] = true
	}
	return votes
}

// executeTransactions processes transactions and updates state
func (d *DPoSBFT) executeTransactions(txs []*Transaction) uint64 {
	var totalGas uint64

	for _, tx := range txs {
		// Verify signature
		// Verify nonce
		// Check balance
		
		// Execute transaction
		d.stateDB.SubBalance(tx.From, tx.Value)
		d.stateDB.AddBalance(tx.To, tx.Value)
		d.stateDB.IncrementNonce(tx.From)

		totalGas += 21000 // Base gas cost
	}

	return totalGas
}

// RegisterValidator adds a new validator
func (d *DPoSBFT) RegisterValidator(address string, stake *big.Int, commission float64) error {
	d.mu.Lock()
	defer d.mu.Unlock()

	minStake := big.NewInt(int64(d.config.MinValidatorStake * 1e18))
	if stake.Cmp(minStake) < 0 {
		return fmt.Errorf("insufficient stake")
	}

	if len(d.validators) >= d.config.MaxValidators {
		return fmt.Errorf("max validators reached")
	}

	d.validators[address] = &Validator{
		Address:       address,
		Stake:         stake,
		DelegatedStake: big.NewInt(0),
		Commission:    commission,
		IsActive:      true,
		VotingPower:   uint64(stake.Int64()),
	}

	fmt.Printf("👥 Validator registered: %s (Stake: %s)\n", address[:10], stake.String())
	return nil
}

// getActiveValidators returns list of active validators
func (d *DPoSBFT) getActiveValidators() []*Validator {
	var active []*Validator
	for _, v := range d.validators {
		if v.IsActive {
			active = append(active, v)
		}
	}
	return active
}

// calculateBlockHash generates block hash
func (d *DPoSBFT) calculateBlockHash(block *Block) string {
	data := fmt.Sprintf("%d%s%d%s%s",
		block.Number,
		block.PreviousHash,
		block.Timestamp,
		block.TxRoot,
		block.StateRoot,
	)
	hash := sha256.Sum256([]byte(data))
	return hex.EncodeToString(hash[:])
}

// calculateTxRoot calculates Merkle root of transactions
func (d *DPoSBFT) calculateTxRoot(txs []*Transaction) string {
	if len(txs) == 0 {
		return ""
	}
	// Simplified - in production use Merkle Patricia Trie
	data := ""
	for _, tx := range txs {
		data += tx.Hash
	}
	hash := sha256.Sum256([]byte(data))
	return hex.EncodeToString(hash[:])
}

// signBlock signs a block
func (d *DPoSBFT) signBlock(block *Block, validator string) string {
	// In production: use ECDSA signature
	data := block.Hash + validator
	hash := sha256.Sum256([]byte(data))
	return hex.EncodeToString(hash[:])
}

// getPreviousBlockHash returns hash of previous block
func (d *DPoSBFT) getPreviousBlockHash() string {
	if d.currentBlock == 0 {
		return "0x0000000000000000000000000000000000000000000000000000000000000000"
	}
	// In production: retrieve from blockchain storage
	return fmt.Sprintf("0x%064d", d.currentBlock)
}

// GetCurrentBlock returns current block number
func (d *DPoSBFT) GetCurrentBlock() uint64 {
	d.mu.RLock()
	defer d.mu.RUnlock()
	return d.currentBlock
}

// GetValidatorCount returns number of active validators
func (d *DPoSBFT) GetValidatorCount() int {
	d.mu.RLock()
	defer d.mu.RUnlock()
	return len(d.getActiveValidators())
}

// NewMempool creates a new mempool
func NewMempool() *Mempool {
	return &Mempool{
		transactions: make(map[string]*Transaction),
	}
}

// AddTransaction adds a transaction to mempool
func (m *Mempool) AddTransaction(tx *Transaction) {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.transactions[tx.Hash] = tx
}

// GetPendingTransactions returns pending transactions
func (m *Mempool) GetPendingTransactions(limit int) []*Transaction {
	m.mu.RLock()
	defer m.mu.RUnlock()

	var txs []*Transaction
	count := 0
	for _, tx := range m.transactions {
		if count >= limit {
			break
		}
		txs = append(txs, tx)
		count++
	}
	return txs
}

// NewStateDB creates a new state database
func NewStateDB() *StateDB {
	return &StateDB{
		balances: make(map[string]*big.Int),
		nonces:   make(map[string]uint64),
	}
}

// GetBalance returns account balance
func (s *StateDB) GetBalance(address string) *big.Int {
	s.mu.RLock()
	defer s.mu.RUnlock()
	if balance, exists := s.balances[address]; exists {
		return balance
	}
	return big.NewInt(0)
}

// AddBalance adds to account balance
func (s *StateDB) AddBalance(address string, amount *big.Int) {
	s.mu.Lock()
	defer s.mu.Unlock()
	if _, exists := s.balances[address]; !exists {
		s.balances[address] = big.NewInt(0)
	}
	s.balances[address].Add(s.balances[address], amount)
}

// SubBalance subtracts from account balance
func (s *StateDB) SubBalance(address string, amount *big.Int) {
	s.mu.Lock()
	defer s.mu.Unlock()
	if _, exists := s.balances[address]; !exists {
		s.balances[address] = big.NewInt(0)
	}
	s.balances[address].Sub(s.balances[address], amount)
}

// IncrementNonce increments account nonce
func (s *StateDB) IncrementNonce(address string) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.nonces[address]++
}

// GetRoot returns state root hash
func (s *StateDB) GetRoot() string {
	s.mu.RLock()
	defer s.mu.RUnlock()
	// Simplified - in production use Merkle Patricia Trie
	hash := sha256.Sum256([]byte(fmt.Sprintf("%v", s.balances)))
	return hex.EncodeToString(hash[:])
}
