import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("DeMarkify", function () {
  async function deployFixture() {
    const [owner, otherAccount] = await ethers.getSigners();
    
    const DeMarkify = await ethers.getContractFactory("DeMarkify");
    const demarkify = await DeMarkify.deploy(
      "DeMarkify",
      "DMK",
      "https://ipfs.io/ipfs/"
    );

    return { demarkify, owner, otherAccount };
  }

  it("Should mint a new asset", async function () {
    const { demarkify, owner } = await loadFixture(deployFixture);
    
    await expect(demarkify.mint(
      owner.address,
      1,
      500, // 5% royalty
      "commercial",
      true,
      "0x"
    )).to.emit(demarkify, "AssetMinted");
    
    const asset = await demarkify.assets(1);
    expect(asset.creator).to.equal(owner.address);
  });

  it("Should return correct royalty info", async function () {
    const { demarkify, owner } = await loadFixture(deployFixture);
    
    await demarkify.mint(
      owner.address,
      1,
      750, // 7.5% royalty
      "editorial",
      false,
      "0x"
    );
    
    const [receiver, royaltyAmount] = await demarkify.royaltyInfo(1, 10000);
    expect(receiver).to.equal(owner.address);
    expect(royaltyAmount).to.equal(750);
  });
});