const Token = artifacts.require("Token");

module.exports = async function (deployer, network, accounts) {
  const name = "42Galaxy";
  const symbol = "42GX";
  const initialSupply = 1000000;

  await deployer.deploy(Token, name, symbol, initialSupply);
  const tokenInstance = await Token.deployed();

  if (network === 'mainnet' || network === 'sepolia') {
    await run("verify:verify", {
      address: tokenInstance.address,
      constructorArguments: [name, symbol, initialSupply],
    });
  }
};