const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token contract", function () {
  let Token;
  let token;
  let owner;
  let addr1;
  let addr2;
  let totalSupply = 1000000n; // Using BigInt for large numbers

  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    Token = await ethers.getContractFactory("Token");
    [owner, addr1, addr2] = await ethers.getSigners();

    token = await Token.deploy("Galaxy", "42GX", totalSupply);
    await token.deployed(); // Wait until the contract is deployed
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await token.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await token.balanceOf(owner.address);
      expect(await token.totalSupply()).to.equal(totalSupply);
      expect(ownerBalance).to.equal(totalSupply);
    });

    it("Should have the correct name and symbol", async function () {
      expect(await token.name()).to.equal("Galaxy");
      expect(await token.symbol()).to.equal("42GX");
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      await token.transfer(addr1.address, 50n);
      const addr1Balance = await token.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(50n);

      await token.connect(addr1).transfer(addr2.address, 50n);
      const addr2Balance = await token.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50n);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const initialOwnerBalance = await token.balanceOf(owner.address);

      await expect(
        token.connect(addr1).transfer(owner.address, 1n)
      ).to.be.revertedWith("ERC20InsufficientBalance");

      expect(await token.balanceOf(owner.address)).to.equal(initialOwnerBalance);
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = BigInt(await token.balanceOf(owner.address)); // Ensure BigInt

      await token.transfer(addr1.address, 100n);
      await token.transfer(addr2.address, 50n);

      const finalOwnerBalance = await token.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance - 150n);

      const addr1Balance = await token.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(100n);

      const addr2Balance = await token.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50n);
    });
  });
});