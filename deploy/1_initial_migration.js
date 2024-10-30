const Token = artifacts.require("Token");

module.exports = function (deployer) {
  const name = "MyToken";
  const symbol = "MTK";
  const initialSupply = 1000000;

  deployer.deploy(Token, name, symbol, initialSupply);
};
