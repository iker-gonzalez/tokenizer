# Deploying a Smart Contract Using Hardhat - Deployment Guide

## Prerequisites

Before beginning the deployment process, ensure you have:

- Node.js and npm installed
- Hardhat project initialized
- Smart contract code ready
- `.env` file configured (for network credentials)

## Initial Setup

### 1. Install Required Dependencies

```bash
npm install --save-dev @nomiclabs/hardhat-ethers ethers dotenv
```

### 2. Configure Environment Variables

Create a `.env` file in your project root:

```plaintext
MNEMONIC=your_mnemonic_sentence
INFURA_API_KEY=your_infura_project_id
ETHERSCAN_API_KEY=your_etherscan_api_key
```

### 3. Configure Hardhat

Update your `hardhat.config.js`:

```javascript
require('@nomiclabs/hardhat-ethers');
require('dotenv').config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
      accounts: [process.env.PRIVATE_KEY]
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
      accounts: [process.env.PRIVATE_KEY]
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};
```

## Deployment Steps

### 1. Create Deployment Script

One basic deployment script is already provided in **scripts/deploy.js**.

### 2. Compile Contracts

```bash
npx hardhat compile
```

### 3. Deploy Contract

Choose the appropriate network for deployment:

**Local Testing:**
```bash
npx hardhat run scripts/deploy.js
```

**Testnet (Sepolia):**
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

**Mainnet:**
```bash
npx hardhat run scripts/deploy.js --network mainnet
```

## Verification Steps

### Verify on Etherscan

```bash
npx hardhat verify --network sepolia DEPLOYED_CONTRACT_ADDRESS [CONSTRUCTOR_ARGUMENTS]
```

## Post-Deployment

### 1. Record Contract Address

Save the deployed contract address in a secure location for future reference.

### 2. Test Deployment

Access the Hardhat console:
```bash
npx hardhat console --network sepolia
```

Interact with your contract:
```javascript
const Contract = await ethers.getContractFactory("YourContractName");
const contract = await Contract.attach("DEPLOYED_CONTRACT_ADDRESS");
// Now you can call contract methods
```

## Common Issues and Solutions

### Gas Price Issues

If deployment fails due to gas prices, modify your deployment script:

```javascript
const contract = await Contract.deploy({
  gasLimit: 3000000,
  gasPrice: ethers.utils.parseUnits('50', 'gwei')
});
```

### Network Issues

Common network problems and solutions:
- Ensure your network RPC is responsive
- Check wallet balance
- Verify network configuration in `hardhat.config.js`

## Best Practices

1. **Testing Protocol:**
   - Always test on local network first
   - Use testnet before mainnet deployment
   - Perform thorough testing of all contract functions

2. **Security Measures:**
   - Keep private keys secure
   - Never commit `.env` file to version control
   - Use hardware wallets for mainnet deployments

3. **Documentation:**
   - Document deployed addresses
   - Record deployment parameters
   - Maintain deployment history

4. **Verification:**
   - Verify contract source code on Etherscan
   - Double-check constructor arguments
   - Validate contract functionality post-deployment

5. **Gas Optimization:**
   - Monitor gas prices before deployment
   - Optimize contract code for gas efficiency
   - Consider deployment timing based on network activity

## Support Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [Ethers.js Documentation](https://docs.ethers.io/v5/)
- [OpenZeppelin Guides](https://docs.openzeppelin.com/learn/)
- [Ethereum Stack Exchange](https://ethereum.stackexchange.com/)

## Additional Notes

- Always keep backups of your deployment information
- Monitor your contract after deployment
- Set up monitoring for contract events
- Consider implementing an upgrade strategy
- Document any custom deployment configurations

Remember to double-check all parameters and configurations before deploying to mainnet. Blockchain deployments are permanent and cannot be undone.
