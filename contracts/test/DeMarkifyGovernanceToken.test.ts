import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("DeMarkifyGovernanceToken", function () {
  async function deployFixture() {
    const [owner, otherAccount] = await ethers.getSigners();
    
    const GovernanceToken = await ethers.getContractFactory("DeMarkifyGovernanceToken");
    const governanceToken = await GovernanceToken.deploy();

    return { governanceToken, owner, otherAccount };
  }

  it("Should have correct initial supply", async function () {
    const { governanceToken, owner } = await loadFixture(deployFixture);
    
    expect(await governanceToken.balanceOf(owner.address)).to.equal(
      await governanceToken.MAX_SUPPLY()
    );
  });

  it("Should allow owner to mint more tokens", async function () {
    const { governanceToken, owner, otherAccount } = await loadFixture(deployFixture);
    
    const amount = ethers.parseEther("1000");
    await governanceToken.mint(otherAccount.address, amount);
    
    expect(await governanceToken.balanceOf(otherAccount.address)).to.equal(amount);
  });
});