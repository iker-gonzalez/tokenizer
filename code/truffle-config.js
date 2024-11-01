const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config({ path: '../.env' });

module.exports = {
  migrations_directory: './deploy', // Specify the custom migrations directory
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*", // Match any network id
    },
    sepolia: {
      provider: () => new HDWalletProvider({
        mnemonic: {
          phrase: process.env.MNEMONIC
        },
        providerOrUrl: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`
      }),
      network_id: 11155111, // Sepolia's id
      gas: 5500000,         // Sepolia has a lower block limit than mainnet
      confirmations: 2,     // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 200,   // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true      // Skip dry run before migrations? (default: false for public nets )
    },
    mainnet: {
      provider: () => new HDWalletProvider({
        mnemonic: {
          phrase: process.env.MNEMONIC
        },
        providerOrUrl: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`
      }),
      network_id: 1,       // Mainnet's id
      gas: 5500000,        // Mainnet has a higher block limit than Sepolia
      confirmations: 2,    // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: false    // Skip dry run before migrations? (default: false for public nets )
    }
  },
  compilers: {
    solc: {
      version: "0.8.0",    // Fetch exact version from solc-bin (default: truffle's version)
    }
  },
  plugins: [
    'truffle-plugin-verify'
  ],
  api_keys: {
    etherscan: process.env.ETHERSCAN_API_KEY
  }
};
