// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title VNC Staking Contract
 * @dev Validator staking with DPoS mechanism
 */
contract VNCStaking is ReentrancyGuard, Ownable, Pausable {
    IERC20 public vncToken;
    
    // Validator structure
    struct Validator {
        address validatorAddress;
        uint256 stake;
        uint256 delegatedStake;
        uint256 commission; // Percentage (0-100)
        uint256 totalRewards;
        uint256 blocksProduced;
        uint256 missedBlocks;
        uint256 joinTime;
        bool isActive;
        bool isSlashed;
    }
    
    // Delegator structure
    struct Delegation {
        uint256 amount;
        uint256 delegatedAt;
        uint256 rewards;
        uint256 lastClaimTime;
    }
    
    // Constants
    uint256 public constant MIN_VALIDATOR_STAKE = 100_000 * 10**18; // 100K VNC
    uint256 public constant MIN_DELEGATION = 1_000 * 10**18; // 1K VNC
    uint256 public constant MAX_VALIDATORS = 101;
    uint256 public constant SLASH_PERCENTAGE = 10; // 10% slash
    uint256 public constant REWARD_RATE = 20; // 20% APY
    uint256 public constant EPOCH_DURATION = 1 days;
    
    // State variables
    mapping(address => Validator) public validators;
    mapping(address => mapping(address => Delegation)) public delegations; // delegator => validator => delegation
    address[] public activeValidators;
    
    uint256 public totalStaked;
    uint256 public totalDelegated;
    uint256 public currentEpoch;
    uint256 public lastEpochTime;
    
    // Events
    event ValidatorRegistered(address indexed validator, uint256 stake, uint256 commission);
    event ValidatorDeactivated(address indexed validator);
    event Staked(address indexed validator, uint256 amount);
    event Unstaked(address indexed validator, uint256 amount);
    event Delegated(address indexed delegator, address indexed validator, uint256 amount);
    event Undelegated(address indexed delegator, address indexed validator, uint256 amount);
    event RewardsClaimed(address indexed user, uint256 amount);
    event ValidatorSlashed(address indexed validator, uint256 amount);
    event EpochAdvanced(uint256 epoch);
    
    constructor(address _vncToken) Ownable(msg.sender) {
        vncToken = IERC20(_vncToken);
        lastEpochTime = block.timestamp;
    }
    
    /**
     * @dev Register as validator
     */
    function registerValidator(uint256 commission) external nonReentrant whenNotPaused {
        require(commission <= 100, "Staking: Invalid commission");
        require(!validators[msg.sender].isActive, "Staking: Already validator");
        require(activeValidators.length < MAX_VALIDATORS, "Staking: Max validators reached");
        
        // Transfer stake
        vncToken.transferFrom(msg.sender, address(this), MIN_VALIDATOR_STAKE);
        
        validators[msg.sender] = Validator({
            validatorAddress: msg.sender,
            stake: MIN_VALIDATOR_STAKE,
            delegatedStake: 0,
            commission: commission,
            totalRewards: 0,
            blocksProduced: 0,
            missedBlocks: 0,
            joinTime: block.timestamp,
            isActive: true,
            isSlashed: false
        });
        
        activeValidators.push(msg.sender);
        totalStaked += MIN_VALIDATOR_STAKE;
        
        emit ValidatorRegistered(msg.sender, MIN_VALIDATOR_STAKE, commission);
    }
    
    /**
     * @dev Add stake to existing validator
     */
    function addStake(uint256 amount) external nonReentrant whenNotPaused {
        require(validators[msg.sender].isActive, "Staking: Not a validator");
        require(amount > 0, "Staking: Invalid amount");
        
        vncToken.transferFrom(msg.sender, address(this), amount);
        validators[msg.sender].stake += amount;
        totalStaked += amount;
        
        emit Staked(msg.sender, amount);
    }
    
    /**
     * @dev Delegate tokens to validator
     */
    function delegate(address validator, uint256 amount) external nonReentrant whenNotPaused {
        require(validators[validator].isActive, "Staking: Invalid validator");
        require(amount >= MIN_DELEGATION, "Staking: Below minimum");
        
        vncToken.transferFrom(msg.sender, address(this), amount);
        
        Delegation storage delegation = delegations[msg.sender][validator];
        delegation.amount += amount;
        delegation.delegatedAt = block.timestamp;
        delegation.lastClaimTime = block.timestamp;
        
        validators[validator].delegatedStake += amount;
        totalDelegated += amount;
        
        emit Delegated(msg.sender, validator, amount);
    }
    
    /**
     * @dev Undelegate tokens
     */
    function undelegate(address validator, uint256 amount) external nonReentrant {
        Delegation storage delegation = delegations[msg.sender][validator];
        require(delegation.amount >= amount, "Staking: Insufficient delegation");
        
        // Claim pending rewards first
        _claimDelegationRewards(validator);
        
        delegation.amount -= amount;
        validators[validator].delegatedStake -= amount;
        totalDelegated -= amount;
        
        vncToken.transfer(msg.sender, amount);
        
        emit Undelegated(msg.sender, validator, amount);
    }
    
    /**
     * @dev Calculate rewards
     */
    function calculateRewards(address validator) public view returns (uint256) {
        Validator memory val = validators[validator];
        if (!val.isActive) return 0;
        
        uint256 timeStaked = block.timestamp - val.joinTime;
        uint256 annualReward = (val.stake * REWARD_RATE) / 100;
        uint256 reward = (annualReward * timeStaked) / 365 days;
        
        return reward;
    }
    
    /**
     * @dev Calculate delegation rewards
     */
    function calculateDelegationRewards(address delegator, address validator) public view returns (uint256) {
        Delegation memory delegation = delegations[delegator][validator];
        if (delegation.amount == 0) return 0;
        
        uint256 timeStaked = block.timestamp - delegation.lastClaimTime;
        uint256 annualReward = (delegation.amount * REWARD_RATE) / 100;
        uint256 grossReward = (annualReward * timeStaked) / 365 days;
        
        // Deduct validator commission
        uint256 commission = (grossReward * validators[validator].commission) / 100;
        uint256 netReward = grossReward - commission;
        
        return netReward;
    }
    
    /**
     * @dev Claim validator rewards
     */
    function claimValidatorRewards() external nonReentrant {
        require(validators[msg.sender].isActive, "Staking: Not a validator");
        
        uint256 reward = calculateRewards(msg.sender);
        require(reward > 0, "Staking: No rewards");
        
        validators[msg.sender].totalRewards += reward;
        validators[msg.sender].joinTime = block.timestamp; // Reset for next calculation
        
        vncToken.transfer(msg.sender, reward);
        
        emit RewardsClaimed(msg.sender, reward);
    }
    
    /**
     * @dev Claim delegation rewards
     */
    function claimDelegationRewards(address validator) external nonReentrant {
        _claimDelegationRewards(validator);
    }
    
    function _claimDelegationRewards(address validator) internal {
        uint256 reward = calculateDelegationRewards(msg.sender, validator);
        if (reward == 0) return;
        
        delegations[msg.sender][validator].rewards += reward;
        delegations[msg.sender][validator].lastClaimTime = block.timestamp;
        
        vncToken.transfer(msg.sender, reward);
        
        emit RewardsClaimed(msg.sender, reward);
    }
    
    /**
     * @dev Record block production (only owner/consensus)
     */
    function recordBlockProduction(address validator) external onlyOwner {
        require(validators[validator].isActive, "Staking: Invalid validator");
        validators[validator].blocksProduced++;
    }
    
    /**
     * @dev Record missed block (only owner/consensus)
     */
    function recordMissedBlock(address validator) external onlyOwner {
        require(validators[validator].isActive, "Staking: Invalid validator");
        validators[validator].missedBlocks++;
        
        // Auto-slash if too many missed blocks
        if (validators[validator].missedBlocks > 100) {
            _slashValidator(validator);
        }
    }
    
    /**
     * @dev Slash validator
     */
    function slashValidator(address validator) external onlyOwner {
        _slashValidator(validator);
    }
    
    function _slashValidator(address validator) internal {
        require(validators[validator].isActive, "Staking: Invalid validator");
        
        uint256 slashAmount = (validators[validator].stake * SLASH_PERCENTAGE) / 100;
        validators[validator].stake -= slashAmount;
        validators[validator].isSlashed = true;
        totalStaked -= slashAmount;
        
        // Burn slashed tokens
        // vncToken.burn(slashAmount); // If burn function exists
        
        emit ValidatorSlashed(validator, slashAmount);
    }
    
    /**
     * @dev Get top validators by stake
     */
    function getTopValidators(uint256 count) external view returns (address[] memory) {
        require(count <= activeValidators.length, "Staking: Invalid count");
        
        // Simple sorting (in production, use off-chain sorting)
        address[] memory sorted = new address[](count);
        // Implementation needed for sorting by total stake
        
        return sorted;
    }
    
    /**
     * @dev Advance epoch
     */
    function advanceEpoch() external onlyOwner {
        require(block.timestamp >= lastEpochTime + EPOCH_DURATION, "Staking: Too early");
        
        currentEpoch++;
        lastEpochTime = block.timestamp;
        
        emit EpochAdvanced(currentEpoch);
    }
    
    /**
     * @dev Pause staking
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause staking
     */
    function unpause() external onlyOwner {
        _unpause();
    }
}
