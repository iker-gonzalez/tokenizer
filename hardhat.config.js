require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require('dotenv').config();

module.exports = {
  solidity: "0.8.20",
  paths: {
    sources: "./code/contracts", // Specify the custom contracts directory
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  networks: {
    development: {
      url: "http://127.0.0.1:8545",
      network_id: "*"
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: { mnemonic: process.env.MNEMONIC },
      gas: 5500000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: { mnemonic: process.env.MNEMONIC },
      gas: 5500000,
      confirmations: 2,
      timeoutBlocks: 200
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};