// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title VNC Presale Contract
 * @dev 3-Stage Presale with Vesting
 */
contract VNCPresale is ReentrancyGuard, Ownable, Pausable {
    IERC20 public vncToken;
    
    // Presale stages
    enum Stage { Stage1, Stage2, Stage3, Ended }
    Stage public currentStage = Stage.Stage1;
    
    // Stage configurations
    struct StageConfig {
        uint256 tokenPrice;      // Price in wei per token (18 decimals)
        uint256 tokensAvailable;
        uint256 tokensSold;
        uint256 startTime;
        uint256 endTime;
        uint256 minPurchase;
        uint256 maxPurchase;
    }
    
    mapping(Stage => StageConfig) public stageConfigs;
    
    // User purchases
    mapping(address => Purchase) public purchases;
    
    struct Purchase {
        uint256 totalTokens;
        uint256 claimedTokens;
        uint256 purchaseTime;
        bool exists;
    }
    
    // Vesting configuration
    uint256 public constant TGE_RELEASE_PERCENT = 30; // 30% at TGE
    uint256 public tgeTime; // Token Generation Event time
    uint256 public constant VESTING_DURATION = 180 days; // 6 months vesting
    
    // Payment wallets
    address public paymentWallet;
    
    // Statistics
    uint256 public totalRaised;
    uint256 public totalParticipants;
    
    // Supported payment tokens (USDT, etc.)
    mapping(address => bool) public acceptedTokens;
    mapping(address => uint256) public tokenPrices; // Price in USD (6 decimals)
    
    // Events
    event TokensPurchased(address indexed buyer, uint256 amount, uint256 cost, Stage stage);
    event TokensClaimed(address indexed buyer, uint256 amount);
    event StageChanged(Stage newStage);
    event TGETimeSet(uint256 tgeTime);
    event PaymentWalletUpdated(address newWallet);
    
    constructor(address _vncToken, address _paymentWallet) Ownable(msg.sender) {
        vncToken = IERC20(_vncToken);
        paymentWallet = _paymentWallet;
        
        // Initialize Stage 1 (₹0.50 = $0.006 per token)
        stageConfigs[Stage.Stage1] = StageConfig({
            tokenPrice: 6000000000000000, // 0.006 ETH (assuming 1 ETH = $1000)
            tokensAvailable: 60_000_000 * 10**18,
            tokensSold: 0,
            startTime: block.timestamp,
            endTime: block.timestamp + 30 days,
            minPurchase: 1000 * 10**18,
            maxPurchase: 1_000_000 * 10**18
        });
        
        // Initialize Stage 2 (₹0.75 = $0.009 per token)
        stageConfigs[Stage.Stage2] = StageConfig({
            tokenPrice: 9000000000000000, // 0.009 ETH
            tokensAvailable: 52_500_000 * 10**18,
            tokensSold: 0,
            startTime: block.timestamp + 30 days,
            endTime: block.timestamp + 60 days,
            minPurchase: 1000 * 10**18,
            maxPurchase: 1_000_000 * 10**18
        });
        
        // Initialize Stage 3 (₹1.00 = $0.012 per token)
        stageConfigs[Stage.Stage3] = StageConfig({
            tokenPrice: 12000000000000000, // 0.012 ETH
            tokensAvailable: 37_500_000 * 10**18,
            tokensSold: 0,
            startTime: block.timestamp + 60 days,
            endTime: block.timestamp + 90 days,
            minPurchase: 1000 * 10**18,
            maxPurchase: 1_000_000 * 10**18
        });
    }
    
    /**
     * @dev Buy tokens with native currency (ETH/MATIC/BNB)
     */
    function buyTokens() external payable nonReentrant whenNotPaused {
        require(currentStage != Stage.Ended, "Presale: Presale ended");
        require(msg.value > 0, "Presale: Invalid amount");
        
        StageConfig storage config = stageConfigs[currentStage];
        require(block.timestamp >= config.startTime, "Presale: Stage not started");
        require(block.timestamp <= config.endTime, "Presale: Stage ended");
        
        uint256 tokenAmount = (msg.value * 10**18) / config.tokenPrice;
        
        require(tokenAmount >= config.minPurchase, "Presale: Below minimum");
        require(tokenAmount <= config.maxPurchase, "Presale: Above maximum");
        require(config.tokensSold + tokenAmount <= config.tokensAvailable, "Presale: Insufficient tokens");
        
        // Update purchase record
        if (!purchases[msg.sender].exists) {
            purchases[msg.sender] = Purchase({
                totalTokens: tokenAmount,
                claimedTokens: 0,
                purchaseTime: block.timestamp,
                exists: true
            });
            totalParticipants++;
        } else {
            purchases[msg.sender].totalTokens += tokenAmount;
        }
        
        // Update stats
        config.tokensSold += tokenAmount;
        totalRaised += msg.value;
        
        // Transfer funds to payment wallet
        payable(paymentWallet).transfer(msg.value);
        
        emit TokensPurchased(msg.sender, tokenAmount, msg.value, currentStage);
    }
    
    /**
     * @dev Buy tokens with stablecoin (USDT)
     */
    function buyTokensWithStablecoin(address token, uint256 amount) external nonReentrant whenNotPaused {
        require(acceptedTokens[token], "Presale: Token not accepted");
        require(currentStage != Stage.Ended, "Presale: Presale ended");
        
        StageConfig storage config = stageConfigs[currentStage];
        require(block.timestamp >= config.startTime, "Presale: Stage not started");
        require(block.timestamp <= config.endTime, "Presale: Stage ended");
        
        // Calculate token amount (assuming stablecoin has 6 decimals like USDT)
        uint256 tokenAmount = (amount * 10**18) / tokenPrices[token];
        
        require(tokenAmount >= config.minPurchase, "Presale: Below minimum");
        require(tokenAmount <= config.maxPurchase, "Presale: Above maximum");
        require(config.tokensSold + tokenAmount <= config.tokensAvailable, "Presale: Insufficient tokens");
        
        // Transfer stablecoin from buyer
        IERC20(token).transferFrom(msg.sender, paymentWallet, amount);
        
        // Update purchase record
        if (!purchases[msg.sender].exists) {
            purchases[msg.sender] = Purchase({
                totalTokens: tokenAmount,
                claimedTokens: 0,
                purchaseTime: block.timestamp,
                exists: true
            });
            totalParticipants++;
        } else {
            purchases[msg.sender].totalTokens += tokenAmount;
        }
        
        // Update stats
        config.tokensSold += tokenAmount;
        
        emit TokensPurchased(msg.sender, tokenAmount, amount, currentStage);
    }
    
    /**
     * @dev Calculate claimable tokens
     */
    function claimableAmount(address buyer) public view returns (uint256) {
        Purchase memory purchase = purchases[buyer];
        if (!purchase.exists || tgeTime == 0 || block.timestamp < tgeTime) {
            return 0;
        }
        
        // TGE release (30%)
        uint256 tgeRelease = (purchase.totalTokens * TGE_RELEASE_PERCENT) / 100;
        
        // Vesting release (70%)
        uint256 vestingAmount = purchase.totalTokens - tgeRelease;
        uint256 timeElapsed = block.timestamp - tgeTime;
        
        uint256 vestedAmount;
        if (timeElapsed >= VESTING_DURATION) {
            vestedAmount = vestingAmount;
        } else {
            vestedAmount = (vestingAmount * timeElapsed) / VESTING_DURATION;
        }
        
        uint256 totalClaimable = tgeRelease + vestedAmount;
        return totalClaimable - purchase.claimedTokens;
    }
    
    /**
     * @dev Claim tokens
     */
    function claimTokens() external nonReentrant {
        uint256 amount = claimableAmount(msg.sender);
        require(amount > 0, "Presale: No tokens to claim");
        
        purchases[msg.sender].claimedTokens += amount;
        vncToken.transfer(msg.sender, amount);
        
        emit TokensClaimed(msg.sender, amount);
    }
    
    /**
     * @dev Move to next stage
     */
    function nextStage() external onlyOwner {
        require(currentStage != Stage.Ended, "Presale: Already ended");
        
        if (currentStage == Stage.Stage1) {
            currentStage = Stage.Stage2;
        } else if (currentStage == Stage.Stage2) {
            currentStage = Stage.Stage3;
        } else {
            currentStage = Stage.Ended;
        }
        
        emit StageChanged(currentStage);
    }
    
    /**
     * @dev Set TGE time
     */
    function setTGETime(uint256 _tgeTime) external onlyOwner {
        require(_tgeTime > block.timestamp, "Presale: Invalid TGE time");
        tgeTime = _tgeTime;
        emit TGETimeSet(_tgeTime);
    }
    
    /**
     * @dev Update payment wallet
     */
    function updatePaymentWallet(address _paymentWallet) external onlyOwner {
        require(_paymentWallet != address(0), "Presale: Invalid address");
        paymentWallet = _paymentWallet;
        emit PaymentWalletUpdated(_paymentWallet);
    }
    
    /**
     * @dev Add accepted token
     */
    function addAcceptedToken(address token, uint256 priceInUSD) external onlyOwner {
        acceptedTokens[token] = true;
        tokenPrices[token] = priceInUSD;
    }
    
    /**
     * @dev Pause presale
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause presale
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Emergency withdraw (only unsold tokens)
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = vncToken.balanceOf(address(this));
        vncToken.transfer(owner(), balance);
    }
}
