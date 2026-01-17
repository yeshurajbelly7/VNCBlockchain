const hre = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("🚀 Starting VNC Blockchain Contract Deployment...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString(), "\n");

  // 1. Deploy VNC Token
  console.log("📝 Deploying VNC Token Contract...");
  const VNCToken = await hre.ethers.getContractFactory("VNCToken");
  const vncToken = await VNCToken.deploy();
  await vncToken.deployed();
  console.log("✅ VNC Token deployed to:", vncToken.address);
  console.log("   Total Supply:", await vncToken.totalSupply(), "\n");

  // 2. Deploy VNC Presale
  console.log("📝 Deploying VNC Presale Contract...");
  const paymentWallet = deployer.address; // Change to your payment wallet
  const VNCPresale = await hre.ethers.getContractFactory("VNCPresale");
  const vncPresale = await VNCPresale.deploy(vncToken.address, paymentWallet);
  await vncPresale.deployed();
  console.log("✅ VNC Presale deployed to:", vncPresale.address, "\n");

  // 3. Deploy VNC Staking
  console.log("📝 Deploying VNC Staking Contract...");
  const VNCStaking = await hre.ethers.getContractFactory("VNCStaking");
  const vncStaking = await VNCStaking.deploy(vncToken.address);
  await vncStaking.deployed();
  console.log("✅ VNC Staking deployed to:", vncStaking.address, "\n");

  // 4. Grant roles and allocate tokens
  console.log("⚙️  Configuring contracts...");
  
  // Grant MINTER_ROLE to presale contract
  const MINTER_ROLE = await vncToken.MINTER_ROLE();
  await vncToken.grantRole(MINTER_ROLE, vncPresale.address);
  console.log("✅ Granted MINTER_ROLE to Presale contract");

  // Mint presale allocation to presale contract
  const PRESALE_ALLOCATION = await vncToken.PRESALE_ALLOCATION();
  await vncToken.mint(vncPresale.address, PRESALE_ALLOCATION);
  console.log("✅ Minted presale allocation:", PRESALE_ALLOCATION.toString());

  // Mint staking rewards to staking contract
  const STAKING_REWARDS = await vncToken.STAKING_REWARDS();
  await vncToken.mint(vncStaking.address, STAKING_REWARDS);
  console.log("✅ Minted staking rewards:", STAKING_REWARDS.toString(), "\n");

  // 5. Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    chainId: (await deployer.provider.getNetwork()).chainId,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      VNCToken: {
        address: vncToken.address,
        totalSupply: (await vncToken.totalSupply()).toString()
      },
      VNCPresale: {
        address: vncPresale.address,
        paymentWallet: paymentWallet
      },
      VNCStaking: {
        address: vncStaking.address,
        minValidatorStake: (await vncStaking.MIN_VALIDATOR_STAKE()).toString()
      }
    }
  };

  const deploymentsDir = "./deployments";
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }

  fs.writeFileSync(
    `${deploymentsDir}/${hre.network.name}.json`,
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("📄 Deployment info saved to:", `deployments/${hre.network.name}.json`);
  
  // 6. Verification instructions
  console.log("\n📋 Contract Verification Commands:");
  console.log(`npx hardhat verify --network ${hre.network.name} ${vncToken.address}`);
  console.log(`npx hardhat verify --network ${hre.network.name} ${vncPresale.address} ${vncToken.address} ${paymentWallet}`);
  console.log(`npx hardhat verify --network ${hre.network.name} ${vncStaking.address} ${vncToken.address}`);

  console.log("\n✨ Deployment Complete! ✨\n");
  console.log("Next steps:");
  console.log("1. Update frontend config with contract addresses");
  console.log("2. Verify contracts on block explorer");
  console.log("3. Set TGE time in presale contract");
  console.log("4. Test presale functionality\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
