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

  describe("Privileges", function () {
    it("Should allow owner to mint tokens", async function () {
      await token.mint(addr1.address, 100n);
      const addr1Balance = await token.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(100n);
    });

    it("Should not allow non-minter to mint tokens", async function () {
      await expect(
        token.connect(addr1).mint(addr1.address, 100n)
      ).to.be.revertedWith("Token: must have minter role to mint");
    });

    it("Should allow owner to burn tokens", async function () {
      await token.burn(owner.address, 100n);
      const ownerBalance = await token.balanceOf(owner.address);
      expect(ownerBalance).to.equal(totalSupply - 100n);
    });

    it("Should not allow non-burner to burn tokens", async function () {
      await expect(
        token.connect(addr1).burn(owner.address, 100n)
      ).to.be.revertedWith("Token: must have burner role to burn");
    });

    it("Should allow owner to assign and revoke roles", async function () {
      await token.grantRole(await token.MINTER_ROLE(), addr1.address);
      expect(await token.hasRole(await token.MINTER_ROLE(), addr1.address)).to.be.true;

      await token.revokeRole(await token.MINTER_ROLE(), addr1.address);
      expect(await token.hasRole(await token.MINTER_ROLE(), addr1.address)).to.be.false;
    });

    it("Should allow owner to grant minter role", async function () {
      await token.grantMinterRole(addr1.address);
      expect(await token.hasRole(await token.MINTER_ROLE(), addr1.address)).to.be.true;
    });

    it("Should allow owner to revoke minter role", async function () {
      await token.grantMinterRole(addr1.address);
      await token.revokeMinterRole(addr1.address);
      expect(await token.hasRole(await token.MINTER_ROLE(), addr1.address)).to.be.false;
    });

    it("Should allow owner to grant burner role", async function () {
      await token.grantBurnerRole(addr1.address);
      expect(await token.hasRole(await token.BURNER_ROLE(), addr1.address)).to.be.true;
    });

    it("Should allow owner to revoke burner role", async function () {
      await token.grantBurnerRole(addr1.address);
      await token.revokeBurnerRole(addr1.address);
      expect(await token.hasRole(await token.BURNER_ROLE(), addr1.address)).to.be.false;
    });

    it("Should not allow non-admin to grant minter role", async function () {
      await expect(
        token.connect(addr1).grantMinterRole(addr2.address)
      ).to.be.revertedWith("Token: must have admin role to grant minter role");
    });

    it("Should not allow non-admin to revoke minter role", async function () {
      await token.grantMinterRole(addr1.address);
      await expect(
        token.connect(addr1).revokeMinterRole(addr1.address)
      ).to.be.revertedWith("Token: must have admin role to revoke minter role");
    });

    it("Should not allow non-admin to grant burner role", async function () {
      await expect(
        token.connect(addr1).grantBurnerRole(addr2.address)
      ).to.be.revertedWith("Token: must have admin role to grant burner role");
    });

    it("Should not allow non-admin to revoke burner role", async function () {
      await token.grantBurnerRole(addr1.address);
      await expect(
        token.connect(addr1).revokeBurnerRole(addr1.address)
      ).to.be.revertedWith("Token: must have admin role to revoke burner role");
    });
  });
});