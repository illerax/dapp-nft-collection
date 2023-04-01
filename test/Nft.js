const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Nft", function () {

  async function deployFixture() {

    const [owner, otherAccount] = await ethers.getSigners();
    const Nft = await ethers.getContractFactory("Nft");
    const contract = await Nft.deploy();
    await contract.deployed();

    return { contract, owner, otherAccount };
  }

  describe("Deployment", function () {

    it("Should create token with correct initial values", async function () {
      const { contract, owner } = await loadFixture(deployFixture);
      expect(await contract.owner()).to.equal(owner.address);
      expect(await contract.name()).to.equal("CardDeck");
      expect(await contract.symbol()).to.equal("CD");
    });

  });

  describe("Mint", function () {
    it("Should fail if send wrong amount of ETH", async function () {
      const { contract, otherAccount } = await loadFixture(deployFixture);

      await expect(
       contract.safeMint(otherAccount.address)
      ).to.be.revertedWith("Please add valid amount of ETH");

      await expect(
          contract.connect(otherAccount).safeMint(otherAccount.address, {value: ethers.utils.parseEther("0.0001")})
      ).to.be.revertedWith("Please add valid amount of ETH");

      await expect(
          contract.connect(otherAccount).safeMint(otherAccount.address, {value: ethers.utils.parseEther("0.01")})
      ).to.be.revertedWith("Please add valid amount of ETH");

    });

    it("Should mint token", async function () {
      const { contract, otherAccount } = await loadFixture(deployFixture);

      await expect(
          contract.connect(otherAccount).safeMint(otherAccount.address, {value: ethers.utils.parseEther("0.001")})
      ).to.changeTokenBalances(contract, [otherAccount], [1]);

    });

    it("Should mint no more then maxSupply", async function () {
      const { contract, otherAccount } = await loadFixture(deployFixture);

      for (let i = 0; i < 52; i++) {
        await contract.connect(otherAccount).safeMint(otherAccount.address, {value: ethers.utils.parseEther("0.001")});
      }

      await expect(
          contract.connect(otherAccount).safeMint(otherAccount.address, {value: ethers.utils.parseEther("0.001")})
      ).to.be.revertedWith("You reached max supply");

    });
  });

  describe("Change base URI", function () {
    it("Should fail if called not by owner", async function () {
      const { contract, otherAccount } = await loadFixture(deployFixture);

      await expect(
          contract.connect(otherAccount).changeBaseURI("ipfs://test/")
      ).to.be.revertedWith("Ownable: caller is not the owner");

    });

    it("Should successfully change base URI", async function () {
      const { contract, owner } = await loadFixture(deployFixture);

      await contract.connect(owner).changeBaseURI("ipfs://test/");
      await contract.connect(owner).safeMint(owner.address, {value: ethers.utils.parseEther("0.001")});

      await expect(
          await contract.tokenURI(0)
      ).to.equal("ipfs://test/0.json");

    });
  });

});
