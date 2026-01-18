package storage

import (
	"encoding/json"
	"fmt"
	"sync"

	"github.com/syndtr/goleveldb/leveldb"
	"github.com/syndtr/goleveldb/leveldb/util"
)

// BlockchainDB handles persistent storage for blockchain data
type BlockchainDB struct {
	db    *leveldb.DB
	mutex sync.RWMutex
}

// Database key prefixes
const (
	PrefixBlock       = "block:"
	PrefixTransaction = "tx:"
	PrefixState       = "state:"
	PrefixValidator   = "validator:"
	PrefixMetadata    = "meta:"
	PrefixReceipt     = "receipt:"
)

// NewBlockchainDB creates a new blockchain database
func NewBlockchainDB(dataDir string) (*BlockchainDB, error) {
	db, err := leveldb.OpenFile(dataDir, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to open database: %w", err)
	}

	blockchain := &BlockchainDB{
		db: db,
	}

	fmt.Printf("💾 Database opened at: %s\n", dataDir)
	
	// Check if this is a fresh start
	latestBlock, err := blockchain.GetLatestBlockNumber()
	if err == nil && latestBlock == 0 {
		fmt.Println("🆕 Starting with fresh blockchain data (block 0)")
	} else if err == nil {
		fmt.Printf("📊 Resuming from block %d\n", latestBlock)
	}
	
	return blockchain, nil
}

// SaveBlock saves a block to the database
func (db *BlockchainDB) SaveBlock(blockNumber uint64, blockData interface{}) error {
	db.mutex.Lock()
	defer db.mutex.Unlock()

	key := fmt.Sprintf("%s%d", PrefixBlock, blockNumber)
	data, err := json.Marshal(blockData)
	if err != nil {
		return fmt.Errorf("failed to marshal block: %w", err)
	}

	if err := db.db.Put([]byte(key), data, nil); err != nil {
		return fmt.Errorf("failed to save block: %w", err)
	}

	return nil
}

// GetBlock retrieves a block from the database
func (db *BlockchainDB) GetBlock(blockNumber uint64) (map[string]interface{}, error) {
	db.mutex.RLock()
	defer db.mutex.RUnlock()

	key := fmt.Sprintf("%s%d", PrefixBlock, blockNumber)
	data, err := db.db.Get([]byte(key), nil)
	if err != nil {
		return nil, fmt.Errorf("block not found: %w", err)
	}

	var block map[string]interface{}
	if err := json.Unmarshal(data, &block); err != nil {
		return nil, fmt.Errorf("failed to unmarshal block: %w", err)
	}

	return block, nil
}

// SaveTransaction saves a transaction to the database
func (db *BlockchainDB) SaveTransaction(txHash string, txData interface{}) error {
	db.mutex.Lock()
	defer db.mutex.Unlock()

	key := fmt.Sprintf("%s%s", PrefixTransaction, txHash)
	data, err := json.Marshal(txData)
	if err != nil {
		return fmt.Errorf("failed to marshal transaction: %w", err)
	}

	return db.db.Put([]byte(key), data, nil)
}

// GetTransaction retrieves a transaction from the database
func (db *BlockchainDB) GetTransaction(txHash string) (map[string]interface{}, error) {
	db.mutex.RLock()
	defer db.mutex.RUnlock()

	key := fmt.Sprintf("%s%s", PrefixTransaction, txHash)
	data, err := db.db.Get([]byte(key), nil)
	if err != nil {
		return nil, fmt.Errorf("transaction not found: %w", err)
	}

	var tx map[string]interface{}
	if err := json.Unmarshal(data, &tx); err != nil {
		return nil, fmt.Errorf("failed to unmarshal transaction: %w", err)
	}

	return tx, nil
}

// SaveState saves account state to the database
func (db *BlockchainDB) SaveState(address string, state interface{}) error {
	db.mutex.Lock()
	defer db.mutex.Unlock()

	key := fmt.Sprintf("%s%s", PrefixState, address)
	data, err := json.Marshal(state)
	if err != nil {
		return fmt.Errorf("failed to marshal state: %w", err)
	}

	return db.db.Put([]byte(key), data, nil)
}

// GetState retrieves account state from the database
func (db *BlockchainDB) GetState(address string) (map[string]interface{}, error) {
	db.mutex.RLock()
	defer db.mutex.RUnlock()

	key := fmt.Sprintf("%s%s", PrefixState, address)
	data, err := db.db.Get([]byte(key), nil)
	if err != nil {
		return nil, fmt.Errorf("state not found: %w", err)
	}

	var state map[string]interface{}
	if err := json.Unmarshal(data, &state); err != nil {
		return nil, fmt.Errorf("failed to unmarshal state: %w", err)
	}

	return state, nil
}

// SaveValidator saves validator information
func (db *BlockchainDB) SaveValidator(address string, validatorData interface{}) error {
	db.mutex.Lock()
	defer db.mutex.Unlock()

	key := fmt.Sprintf("%s%s", PrefixValidator, address)
	data, err := json.Marshal(validatorData)
	if err != nil {
		return fmt.Errorf("failed to marshal validator: %w", err)
	}

	return db.db.Put([]byte(key), data, nil)
}

// GetValidator retrieves validator information
func (db *BlockchainDB) GetValidator(address string) (map[string]interface{}, error) {
	db.mutex.RLock()
	defer db.mutex.RUnlock()

	key := fmt.Sprintf("%s%s", PrefixValidator, address)
	data, err := db.db.Get([]byte(key), nil)
	if err != nil {
		return nil, fmt.Errorf("validator not found: %w", err)
	}

	var validator map[string]interface{}
	if err := json.Unmarshal(data, &validator); err != nil {
		return nil, fmt.Errorf("failed to unmarshal validator: %w", err)
	}

	return validator, nil
}

// GetAllValidators retrieves all validators
func (db *BlockchainDB) GetAllValidators() ([]map[string]interface{}, error) {
	db.mutex.RLock()
	defer db.mutex.RUnlock()

	validators := make([]map[string]interface{}, 0)
	iter := db.db.NewIterator(util.BytesPrefix([]byte(PrefixValidator)), nil)
	defer iter.Release()

	for iter.Next() {
		var validator map[string]interface{}
		if err := json.Unmarshal(iter.Value(), &validator); err != nil {
			continue
		}
		validators = append(validators, validator)
	}

	return validators, iter.Error()
}

// SaveMetadata saves blockchain metadata
func (db *BlockchainDB) SaveMetadata(key string, value interface{}) error {
	db.mutex.Lock()
	defer db.mutex.Unlock()

	metaKey := fmt.Sprintf("%s%s", PrefixMetadata, key)
	data, err := json.Marshal(value)
	if err != nil {
		return fmt.Errorf("failed to marshal metadata: %w", err)
	}

	return db.db.Put([]byte(metaKey), data, nil)
}

// GetMetadata retrieves blockchain metadata
func (db *BlockchainDB) GetMetadata(key string) (interface{}, error) {
	db.mutex.RLock()
	defer db.mutex.RUnlock()

	metaKey := fmt.Sprintf("%s%s", PrefixMetadata, key)
	data, err := db.db.Get([]byte(metaKey), nil)
	if err != nil {
		return nil, fmt.Errorf("metadata not found: %w", err)
	}

	var value interface{}
	if err := json.Unmarshal(data, &value); err != nil {
		return nil, fmt.Errorf("failed to unmarshal metadata: %w", err)
	}

	return value, nil
}

// GetLatestBlockNumber retrieves the latest block number
func (db *BlockchainDB) GetLatestBlockNumber() (uint64, error) {
	value, err := db.GetMetadata("latest_block")
	if err != nil {
		return 0, nil // Start from genesis
	}

	if blockNum, ok := value.(float64); ok {
		return uint64(blockNum), nil
	}

	return 0, nil
}

// SetLatestBlockNumber sets the latest block number
func (db *BlockchainDB) SetLatestBlockNumber(blockNumber uint64) error {
	return db.SaveMetadata("latest_block", blockNumber)
}

// SaveReceipt saves a transaction receipt
func (db *BlockchainDB) SaveReceipt(txHash string, receipt interface{}) error {
	db.mutex.Lock()
	defer db.mutex.Unlock()

	key := fmt.Sprintf("%s%s", PrefixReceipt, txHash)
	data, err := json.Marshal(receipt)
	if err != nil {
		return fmt.Errorf("failed to marshal receipt: %w", err)
	}

	return db.db.Put([]byte(key), data, nil)
}

// GetReceipt retrieves a transaction receipt
func (db *BlockchainDB) GetReceipt(txHash string) (map[string]interface{}, error) {
	db.mutex.RLock()
	defer db.mutex.RUnlock()

	key := fmt.Sprintf("%s%s", PrefixReceipt, txHash)
	data, err := db.db.Get([]byte(key), nil)
	if err != nil {
		return nil, fmt.Errorf("receipt not found: %w", err)
	}

	var receipt map[string]interface{}
	if err := json.Unmarshal(data, &receipt); err != nil {
		return nil, fmt.Errorf("failed to unmarshal receipt: %w", err)
	}

	return receipt, nil
}

// Close closes the database
func (db *BlockchainDB) Close() error {
	db.mutex.Lock()
	defer db.mutex.Unlock()

	return db.db.Close()
}

// GetStats returns database statistics
func (db *BlockchainDB) GetStats() (map[string]interface{}, error) {
	stats := make(map[string]interface{})

	// Get latest block number
	latestBlock, _ := db.GetLatestBlockNumber()
	stats["latest_block"] = latestBlock

	// Count validators
	validators, _ := db.GetAllValidators()
	stats["validator_count"] = len(validators)

	return stats, nil
}
