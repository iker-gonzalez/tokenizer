const Token = artifacts.require("Token");

module.exports = async function (deployer, network, accounts) {
  const name = "42Galaxy";
  const symbol = "42GX";
  const initialSupply = 1000000;

  await deployer.deploy(Token, name, symbol, initialSupply);
};