import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("CampaignFactory", function () {
  it("Should create a new campaign and emit the CampaignCreated event", async function () {
    const factory = await ethers.deployContract("CampaignFactory");
    const [creator] = await ethers.getSigners();
    const goal = ethers.parseEther("10");
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60);

    const tx = await factory.createCampaign(
      "Test Campaign",
      "This is a test campaign",
      goal,
      deadline,
    );

    const receipt = await tx.wait();
    const event = receipt?.logs
      .map((log) => factory.interface.parseLog(log))
      .find((parsedLog) => parsedLog && parsedLog.name === "CampaignCreated");

    expect(event).to.not.be.undefined;
    expect(event?.args?.creator).to.equal(creator.address);

    const campaignAddress = event?.args?.campaignAddress;
    expect(campaignAddress).to.properAddress;

    const campaign = await ethers.getContractAt("Campaign", campaignAddress);
    expect(await campaign.creator()).to.equal(creator.address);
    expect(await campaign.name()).to.equal("Test Campaign");
    expect(await campaign.description()).to.equal("This is a test campaign");
    expect(await campaign.goal()).to.equal(goal);
    expect(await campaign.deadline()).to.equal(deadline);
  });
});
