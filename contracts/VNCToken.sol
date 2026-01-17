// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title VNC Token
 * @dev VNC-20 Blockchain Native Token (ERC-20)
 * Symbol: VNC
 * Decimals: 18
 * Total Supply: 1,000,000,000 VNC
 */
contract VNCToken is ERC20, ERC20Burnable, Pausable, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18; // 1 Billion VNC
    
    // Token allocation
    uint256 public constant PRESALE_ALLOCATION = 150_000_000 * 10**18;      // 15%
    uint256 public constant LIQUIDITY_ALLOCATION = 200_000_000 * 10**18;    // 20%
    uint256 public constant STAKING_REWARDS = 250_000_000 * 10**18;         // 25%
    uint256 public constant TEAM_ALLOCATION = 150_000_000 * 10**18;         // 15%
    uint256 public constant DEVELOPMENT_FUND = 100_000_000 * 10**18;        // 10%
    uint256 public constant MARKETING = 50_000_000 * 10**18;                // 5%
    uint256 public constant ECOSYSTEM_FUND = 100_000_000 * 10**18;          // 10%
    
    // Vesting tracking
    mapping(address => VestingSchedule) public vestingSchedules;
    
    struct VestingSchedule {
        uint256 totalAmount;
        uint256 releasedAmount;
        uint256 startTime;
        uint256 cliff;
        uint256 duration;
    }
    
    event TokensLocked(address indexed beneficiary, uint256 amount, uint256 releaseTime);
    event TokensReleased(address indexed beneficiary, uint256 amount);
    
    constructor() ERC20("VNC Blockchain Token", "VNC") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
    }
    
    /**
     * @dev Mint new tokens (only by MINTER_ROLE)
     */
    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        require(totalSupply() + amount <= MAX_SUPPLY, "VNC: Max supply exceeded");
        _mint(to, amount);
    }
    
    /**
     * @dev Pause token transfers
     */
    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }
    
    /**
     * @dev Unpause token transfers
     */
    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }
    
    /**
     * @dev Create vesting schedule
     */
    function createVestingSchedule(
        address beneficiary,
        uint256 amount,
        uint256 startTime,
        uint256 cliff,
        uint256 duration
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(beneficiary != address(0), "VNC: Invalid beneficiary");
        require(amount > 0, "VNC: Invalid amount");
        require(vestingSchedules[beneficiary].totalAmount == 0, "VNC: Schedule exists");
        
        vestingSchedules[beneficiary] = VestingSchedule({
            totalAmount: amount,
            releasedAmount: 0,
            startTime: startTime,
            cliff: cliff,
            duration: duration
        });
        
        emit TokensLocked(beneficiary, amount, startTime + duration);
    }
    
    /**
     * @dev Calculate releasable amount
     */
    function releasableAmount(address beneficiary) public view returns (uint256) {
        VestingSchedule memory schedule = vestingSchedules[beneficiary];
        
        if (block.timestamp < schedule.startTime + schedule.cliff) {
            return 0;
        }
        
        uint256 timeElapsed = block.timestamp - schedule.startTime;
        if (timeElapsed >= schedule.duration) {
            return schedule.totalAmount - schedule.releasedAmount;
        }
        
        uint256 vestedAmount = (schedule.totalAmount * timeElapsed) / schedule.duration;
        return vestedAmount - schedule.releasedAmount;
    }
    
    /**
     * @dev Release vested tokens
     */
    function release() public {
        uint256 amount = releasableAmount(msg.sender);
        require(amount > 0, "VNC: No tokens to release");
        
        vestingSchedules[msg.sender].releasedAmount += amount;
        _mint(msg.sender, amount);
        
        emit TokensReleased(msg.sender, amount);
    }
    
    /**
     * @dev Override _update to add pause functionality
     */
    function _update(
        address from,
        address to,
        uint256 value
    ) internal override whenNotPaused {
        super._update(from, to, value);
    }
}
