require('dotenv').config();
const { ethers } = require("hardhat");
const fs = require('fs');

async function main() {
  // Read the deployed token contract address from the file
  const tokenAddress = fs.readFileSync('lastDeployedAddress.txt', 'utf8').trim();
  if (!tokenAddress) {
    console.error("No deployed address found in lastDeployedAddress.txt");
    process.exit(1);
  }

  // Load recipient address from .env file
  const recipientAddress = process.env.RECIPIENT_ADDRESS;
  if (!recipientAddress) {
    console.error("No recipient address found in .env file");
    process.exit(1);
  }

  // Replace with the amount to mint
  const amount = ethers.utils.parseUnits("100", 18);

  // Get the signer (account) that will be used to mint tokens
  const [minter] = await ethers.getSigners();

  // Attach to the deployed contract
  const Token = await ethers.getContractFactory("Token");
  const token = Token.attach(tokenAddress);

  console.log(`Minting tokens to ${recipientAddress} from ${minter.address}`);
  console.log(`🌐 Token contract address: https://sepolia.etherscan.io/address/${token.address}`);

  // Call the mint function
  const tx = await token.mint(recipientAddress, amount);
  await tx.wait();

  console.log(`Minted ${amount.toString()} tokens to ${recipientAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });