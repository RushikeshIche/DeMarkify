const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");

describe("NFT Marketplace", function () {
  async function deployFixture() {
    const [deployer, seller, buyer] = await ethers.getSigners();

    // Deploy NFT contract
    const NFT = await ethers.getContractFactory("NFT");
    const nft = await NFT.deploy();
    await nft.waitForDeployment();

    // Deploy Marketplace with 1% fee
    const Marketplace = await ethers.getContractFactory("Marketplace");
    const marketplace = await Marketplace.deploy(1);
    await marketplace.waitForDeployment();

    return { nft, marketplace, deployer, seller, buyer };
  }

  describe("Deployment", function () {
    it("Should set feeAccount and feePercent correctly", async function () {
      const { marketplace, deployer } = await loadFixture(deployFixture);
      expect(await marketplace.feeAccount()).to.equal(deployer.address);
      expect(await marketplace.feePercent()).to.equal(1);
    });
  });

  describe("NFT Listing", function () {
    it("Should allow minting and listing an NFT", async function () {
      const { nft, marketplace, seller } = await loadFixture(deployFixture);

      await nft.connect(seller).mint("ipfs://token-uri");
      expect(await nft.ownerOf(1)).to.equal(seller.address);

      await nft.connect(seller).approve(marketplace.getAddress(), 1);

      await marketplace.connect(seller).makeItem(nft.getAddress(), 1, ethers.parseEther("1"));

      const item = await marketplace.items(1);
      expect(item.itemId).to.equal(1);
      expect(item.tokenId).to.equal(1);
      expect(item.price).to.equal(ethers.parseEther("1"));
      expect(item.seller).to.equal(seller.address);
      expect(item.sold).to.equal(false);

      expect(await nft.ownerOf(1)).to.equal(await marketplace.getAddress());
    });

    it("Should fail if price is zero", async function () {
      const { nft, marketplace, seller } = await loadFixture(deployFixture);
      await nft.connect(seller).mint("ipfs://token-uri");
      await nft.connect(seller).approve(marketplace.getAddress(), 1);
      await expect(
        marketplace.connect(seller).makeItem(nft.getAddress(), 1, 0)
      ).to.be.revertedWith("Price must be greater than zero");
    });
  });

  describe("Purchasing", function () {
    it("Should allow buyer to purchase and transfer NFT", async function () {
      const { nft, marketplace, seller, buyer } = await loadFixture(deployFixture);

      await nft.connect(seller).mint("ipfs://token-uri");
      await nft.connect(seller).approve(marketplace.getAddress(), 1);
      await marketplace.connect(seller).makeItem(nft.getAddress(), 1, ethers.parseEther("1"));

      const totalPrice = await marketplace.getTotalPrice(1);

      const sellerBalanceBefore = await ethers.provider.getBalance(seller.address);
      const feeAccountBalanceBefore = await ethers.provider.getBalance(await marketplace.feeAccount());

      const tx = await marketplace.connect(buyer).purchaseItem(1, { value: totalPrice });
      await tx.wait();

      const item = await marketplace.items(1);
      expect(item.sold).to.equal(true);
      expect(await nft.ownerOf(1)).to.equal(buyer.address);

      const sellerBalanceAfter = await ethers.provider.getBalance(seller.address);
      const feeAccountBalanceAfter = await ethers.provider.getBalance(await marketplace.feeAccount());

      expect(sellerBalanceAfter).to.be.gt(sellerBalanceBefore);
      expect(feeAccountBalanceAfter).to.be.gt(feeAccountBalanceBefore);
    });

    it("Should fail if not enough ETH is sent", async function () {
      const { nft, marketplace, seller, buyer } = await loadFixture(deployFixture);

      await nft.connect(seller).mint("ipfs://token-uri");
      await nft.connect(seller).approve(marketplace.getAddress(), 1);
      await marketplace.connect(seller).makeItem(nft.getAddress(), 1, ethers.parseEther("1"));

      await expect(
        marketplace.connect(buyer).purchaseItem(1, { value: ethers.parseEther("0.5") })
      ).to.be.revertedWith("Not enough ETH to cover item price and fee");
    });

    it("Should fail if item is already sold", async function () {
      const { nft, marketplace, seller, buyer } = await loadFixture(deployFixture);

      await nft.connect(seller).mint("ipfs://token-uri");
      await nft.connect(seller).approve(marketplace.getAddress(), 1);
      await marketplace.connect(seller).makeItem(nft.getAddress(), 1, ethers.parseEther("1"));

      const totalPrice = await marketplace.getTotalPrice(1);
      await marketplace.connect(buyer).purchaseItem(1, { value: totalPrice });

      await expect(
        marketplace.connect(buyer).purchaseItem(1, { value: totalPrice })
      ).to.be.revertedWith("Item already sold");
    });
  });
});
