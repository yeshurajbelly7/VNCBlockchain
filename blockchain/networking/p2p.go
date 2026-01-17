package networking

import (
	"context"
	"crypto/rand"
	"encoding/json"
	"fmt"
	"sync"
	"time"

	"github.com/libp2p/go-libp2p"
	"github.com/libp2p/go-libp2p/core/crypto"
	"github.com/libp2p/go-libp2p/core/host"
	"github.com/libp2p/go-libp2p/core/network"
	"github.com/libp2p/go-libp2p/core/peer"
	"github.com/libp2p/go-libp2p/core/protocol"
	pubsub "github.com/libp2p/go-libp2p-pubsub"
	"github.com/multiformats/go-multiaddr"
)

// P2PNetwork handles peer-to-peer networking
type P2PNetwork struct {
	Host       host.Host
	PubSub     *pubsub.PubSub
	Topics     map[string]*pubsub.Topic
	ctx        context.Context
	cancel     context.CancelFunc
	peers      map[peer.ID]*PeerInfo
	peersMutex sync.RWMutex
}

// PeerInfo stores information about connected peers
type PeerInfo struct {
	ID            peer.ID
	Address       multiaddr.Multiaddr
	Connected     time.Time
	LastSeen      time.Time
	IsValidator   bool
	BlockHeight   uint64
	Latency       time.Duration
}

// Message types for P2P communication
const (
	ProtocolBlock       protocol.ID = "/vnc/block/1.0.0"
	ProtocolTransaction protocol.ID = "/vnc/tx/1.0.0"
	ProtocolConsensus   protocol.ID = "/vnc/consensus/1.0.0"
	ProtocolSync        protocol.ID = "/vnc/sync/1.0.0"
)

// Topic names for pub-sub
const (
	TopicBlocks       = "vnc-blocks"
	TopicTransactions = "vnc-transactions"
	TopicConsensus    = "vnc-consensus"
)

// NewP2PNetwork creates a new P2P network instance
func NewP2PNetwork(listenPort int, bootstrapPeers []string) (*P2PNetwork, error) {
	ctx, cancel := context.WithCancel(context.Background())

	// Generate a new keypair for this host
	priv, _, err := crypto.GenerateKeyPairWithReader(crypto.RSA, 2048, rand.Reader)
	if err != nil {
		cancel()
		return nil, fmt.Errorf("failed to generate key pair: %w", err)
	}

	// Create libp2p host
	listenAddr := fmt.Sprintf("/ip4/0.0.0.0/tcp/%d", listenPort)
	h, err := libp2p.New(
		libp2p.ListenAddrStrings(listenAddr),
		libp2p.Identity(priv),
		libp2p.DefaultTransports,
		libp2p.DefaultMuxers,
		libp2p.DefaultSecurity,
		libp2p.NATPortMap(),
	)
	if err != nil {
		cancel()
		return nil, fmt.Errorf("failed to create libp2p host: %w", err)
	}

	// Create gossipsub pub-sub
	ps, err := pubsub.NewGossipSub(ctx, h)
	if err != nil {
		h.Close()
		cancel()
		return nil, fmt.Errorf("failed to create pubsub: %w", err)
	}

	network := &P2PNetwork{
		Host:   h,
		PubSub: ps,
		Topics: make(map[string]*pubsub.Topic),
		ctx:    ctx,
		cancel: cancel,
		peers:  make(map[peer.ID]*PeerInfo),
	}

	// Setup stream handlers
	network.setupStreamHandlers()

	// Join topics
	if err := network.joinTopics(); err != nil {
		h.Close()
		cancel()
		return nil, err
	}

	// Connect to bootstrap peers
	if err := network.connectToBootstrapPeers(bootstrapPeers); err != nil {
		fmt.Printf("Warning: failed to connect to some bootstrap peers: %v\n", err)
	}

	// Start peer discovery
	go network.peerDiscoveryLoop()

	fmt.Printf("🌐 P2P Network started on %s\n", listenAddr)
	fmt.Printf("📡 Peer ID: %s\n", h.ID().String())

	return network, nil
}

// setupStreamHandlers sets up protocol stream handlers
func (n *P2PNetwork) setupStreamHandlers() {
	n.Host.SetStreamHandler(ProtocolBlock, n.handleBlockStream)
	n.Host.SetStreamHandler(ProtocolTransaction, n.handleTransactionStream)
	n.Host.SetStreamHandler(ProtocolConsensus, n.handleConsensusStream)
	n.Host.SetStreamHandler(ProtocolSync, n.handleSyncStream)
}

// joinTopics joins all pub-sub topics
func (n *P2PNetwork) joinTopics() error {
	topics := []string{TopicBlocks, TopicTransactions, TopicConsensus}

	for _, topicName := range topics {
		topic, err := n.PubSub.Join(topicName)
		if err != nil {
			return fmt.Errorf("failed to join topic %s: %w", topicName, err)
		}
		n.Topics[topicName] = topic

		// Subscribe to topic
		sub, err := topic.Subscribe()
		if err != nil {
			return fmt.Errorf("failed to subscribe to topic %s: %w", topicName, err)
		}

		// Start message handler for this topic
		go n.handleTopicMessages(topicName, sub)
	}

	return nil
}

// connectToBootstrapPeers connects to initial bootstrap peers
func (n *P2PNetwork) connectToBootstrapPeers(bootstrapPeers []string) error {
	for _, peerAddr := range bootstrapPeers {
		maddr, err := multiaddr.NewMultiaddr(peerAddr)
		if err != nil {
			continue
		}

		peerInfo, err := peer.AddrInfoFromP2pAddr(maddr)
		if err != nil {
			continue
		}

		if err := n.Host.Connect(n.ctx, *peerInfo); err != nil {
			fmt.Printf("Failed to connect to bootstrap peer %s: %v\n", peerInfo.ID, err)
			continue
		}

		n.addPeer(peerInfo.ID, maddr)
		fmt.Printf("✅ Connected to bootstrap peer: %s\n", peerInfo.ID)
	}

	return nil
}

// handleBlockStream handles incoming block messages
func (n *P2PNetwork) handleBlockStream(s network.Stream) {
	defer s.Close()

	// Decode block data
	var blockData map[string]interface{}
	if err := json.NewDecoder(s).Decode(&blockData); err != nil {
		fmt.Printf("Error decoding block: %v\n", err)
		return
	}

	fmt.Printf("📦 Received block from peer %s\n", s.Conn().RemotePeer())
	// TODO: Process block through consensus engine
}

// handleTransactionStream handles incoming transaction messages
func (n *P2PNetwork) handleTransactionStream(s network.Stream) {
	defer s.Close()

	var txData map[string]interface{}
	if err := json.NewDecoder(s).Decode(&txData); err != nil {
		fmt.Printf("Error decoding transaction: %v\n", err)
		return
	}

	fmt.Printf("💸 Received transaction from peer %s\n", s.Conn().RemotePeer())
	// TODO: Add transaction to mempool
}

// handleConsensusStream handles consensus messages
func (n *P2PNetwork) handleConsensusStream(s network.Stream) {
	defer s.Close()

	var consensusData map[string]interface{}
	if err := json.NewDecoder(s).Decode(&consensusData); err != nil {
		fmt.Printf("Error decoding consensus message: %v\n", err)
		return
	}

	fmt.Printf("🎯 Received consensus message from peer %s\n", s.Conn().RemotePeer())
	// TODO: Process consensus vote
}

// handleSyncStream handles blockchain synchronization
func (n *P2PNetwork) handleSyncStream(s network.Stream) {
	defer s.Close()

	var syncRequest map[string]interface{}
	if err := json.NewDecoder(s).Decode(&syncRequest); err != nil {
		fmt.Printf("Error decoding sync request: %v\n", err)
		return
	}

	fmt.Printf("🔄 Received sync request from peer %s\n", s.Conn().RemotePeer())
	// TODO: Send blockchain data
}

// handleTopicMessages handles messages from pub-sub topics
func (n *P2PNetwork) handleTopicMessages(topicName string, sub *pubsub.Subscription) {
	for {
		msg, err := sub.Next(n.ctx)
		if err != nil {
			if n.ctx.Err() == nil {
				fmt.Printf("Error reading from topic %s: %v\n", topicName, err)
			}
			return
		}

		// Skip messages from self
		if msg.ReceivedFrom == n.Host.ID() {
			continue
		}

		fmt.Printf("📨 Received message on topic %s from %s\n", topicName, msg.ReceivedFrom)
		// TODO: Process message based on topic
	}
}

// BroadcastBlock broadcasts a block to all peers
func (n *P2PNetwork) BroadcastBlock(block interface{}) error {
	data, err := json.Marshal(block)
	if err != nil {
		return fmt.Errorf("failed to marshal block: %w", err)
	}

	topic := n.Topics[TopicBlocks]
	if topic == nil {
		return fmt.Errorf("blocks topic not found")
	}

	if err := topic.Publish(n.ctx, data); err != nil {
		return fmt.Errorf("failed to publish block: %w", err)
	}

	fmt.Printf("📡 Broadcasted block to network\n")
	return nil
}

// BroadcastTransaction broadcasts a transaction to all peers
func (n *P2PNetwork) BroadcastTransaction(tx interface{}) error {
	data, err := json.Marshal(tx)
	if err != nil {
		return fmt.Errorf("failed to marshal transaction: %w", err)
	}

	topic := n.Topics[TopicTransactions]
	if topic == nil {
		return fmt.Errorf("transactions topic not found")
	}

	if err := topic.Publish(n.ctx, data); err != nil {
		return fmt.Errorf("failed to publish transaction: %w", err)
	}

	return nil
}

// SendConsensusVote sends a consensus vote to validators
func (n *P2PNetwork) SendConsensusVote(vote interface{}) error {
	data, err := json.Marshal(vote)
	if err != nil {
		return fmt.Errorf("failed to marshal vote: %w", err)
	}

	topic := n.Topics[TopicConsensus]
	if topic == nil {
		return fmt.Errorf("consensus topic not found")
	}

	return topic.Publish(n.ctx, data)
}

// addPeer adds a peer to the peer list
func (n *P2PNetwork) addPeer(id peer.ID, addr multiaddr.Multiaddr) {
	n.peersMutex.Lock()
	defer n.peersMutex.Unlock()

	if _, exists := n.peers[id]; !exists {
		n.peers[id] = &PeerInfo{
			ID:        id,
			Address:   addr,
			Connected: time.Now(),
			LastSeen:  time.Now(),
		}
	}
}

// peerDiscoveryLoop continuously discovers new peers
func (n *P2PNetwork) peerDiscoveryLoop() {
	ticker := time.NewTicker(30 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-n.ctx.Done():
			return
		case <-ticker.C:
			n.updatePeerInfo()
		}
	}
}

// updatePeerInfo updates information about connected peers
func (n *P2PNetwork) updatePeerInfo() {
	n.peersMutex.Lock()
	defer n.peersMutex.Unlock()

	connectedPeers := n.Host.Network().Peers()
	fmt.Printf("👥 Connected peers: %d\n", len(connectedPeers))

	for _, peerID := range connectedPeers {
		if _, exists := n.peers[peerID]; !exists {
			n.peers[peerID] = &PeerInfo{
				ID:        peerID,
				Connected: time.Now(),
				LastSeen:  time.Now(),
			}
		} else {
			n.peers[peerID].LastSeen = time.Now()
		}
	}
}

// GetPeers returns list of connected peers
func (n *P2PNetwork) GetPeers() []*PeerInfo {
	n.peersMutex.RLock()
	defer n.peersMutex.RUnlock()

	peers := make([]*PeerInfo, 0, len(n.peers))
	for _, peer := range n.peers {
		peers = append(peers, peer)
	}
	return peers
}

// GetPeerCount returns the number of connected peers
func (n *P2PNetwork) GetPeerCount() int {
	return len(n.Host.Network().Peers())
}

// Close shuts down the P2P network
func (n *P2PNetwork) Close() error {
	n.cancel()
	return n.Host.Close()
}
