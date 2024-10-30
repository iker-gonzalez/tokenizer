const Token = artifacts.require("Token");

module.exports = function (deployer) {
  const name = "42Galaxy";
  const symbol = "42GX";
  const initialSupply = 1000000;

  deployer.deploy(Token, name, symbol, initialSupply);
};
