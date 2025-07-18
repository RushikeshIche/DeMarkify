import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("DeMarkifyMarketplace", function () {
  async function deployFixture() {
    const [owner, seller, buyer] = await ethers.getSigners();
    
    // Deploy NFT
    const DeMarkify = await ethers.getContractFactory("DeMarkify");
    const demarkify = await DeMarkify.deploy(
      "DeMarkify",
      "DMK",
      "https://ipfs.io/ipfs/"
    );

    // Deploy Marketplace
    const Marketplace = await ethers.getContractFactory("DeMarkifyMarketplace");
    const marketplace = await Marketplace.deploy(owner.address, 250); // 2.5% fee

    // Mint test NFT
    await demarkify.mint(
      seller.address,
      1,
      500, // 5% royalty
      "commercial",
      true,
      "0x"
    );

    return { demarkify, marketplace, owner, seller, buyer };
  }

  it("Should list an item", async function () {
    const { demarkify, marketplace, seller } = await loadFixture(deployFixture);
    
    await demarkify.connect(seller).setApprovalForAll(marketplace.target, true);
    
    await expect(marketplace.connect(seller).listItem(
      demarkify.target,
      1, // tokenId
      1, // amount
      ethers.parseEther("1.0"), // price
      ethers.ZeroAddress // ETH payment
    )).to.emit(marketplace, "Listed");
  });

  it("Should purchase an item", async function () {
    const { demarkify, marketplace, seller, buyer } = await loadFixture(deployFixture);
    
    await demarkify.connect(seller).setApprovalForAll(marketplace.target, true);
    await marketplace.connect(seller).listItem(
      demarkify.target,
      1, // tokenId
      1, // amount
      ethers.parseEther("1.0"), // price
      ethers.ZeroAddress // ETH payment
    );
    
    await expect(marketplace.connect(buyer).purchaseItem(
      demarkify.target,
      1, // listingId
      1, // amount
      { value: ethers.parseEther("1.0") }
    )).to.emit(marketplace, "Purchased");
  });
});