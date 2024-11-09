const fs = require('fs');
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const Token = await ethers.getContractFactory("Token");
  const token = await Token.deploy("42Galaxy", "42GX", ethers.utils.parseUnits("1000000", 18));

  await token.deployed(); // Wait until the contract is deployed

  console.log(`🌐 Token deployed to: https://sepolia.etherscan.io/address/${token.address}`);

  // Save the deployed contract address to a file
  fs.writeFileSync('lastDeployedAddress.txt', token.address);

  // Get the transaction receipt to find out the gas used
  const receipt = await token.deployTransaction.wait();
  console.log("🔥 Gas used for deployment:", receipt.gasUsed.toString());

  // Fetch the current gas price from the network
  const gasPrice = await ethers.provider.getGasPrice();
  console.log("🪙 Current gas price (in wei):", gasPrice.toString());

  // Calculate the cost in ETH
  const costInWei = receipt.gasUsed.mul(gasPrice);
  const costInEth = ethers.utils.formatEther(costInWei);
  console.log("💰 Cost of deployment in ETH:", costInEth);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });