import { expect } from "chai";
import { network } from "hardhat";

const { ethers, networkHelpers } = await network.connect();

describe("Campaign", function () {
  async function deployCampaignFixture() {
    const [creator] = await ethers.getSigners();
    const goal = ethers.parseEther("10");
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60);

    const campaign = await ethers.deployContract("Campaign", [
        creator.address,
        "Test Campaign",
        "This is a test campaign",
        goal,
        deadline,
    ]);

    return { campaign, creator, goal, deadline };
  }
  
  it("Should start the campaign and emit the StateChanged event", async function () {
    const { campaign } = await networkHelpers.loadFixture(deployCampaignFixture);

    const tx = await campaign.startCampaign();
    const receipt = await tx.wait();
    const event = receipt?.logs
      .map((log) => campaign.interface.parseLog(log))
      .find((parsedLog) => parsedLog && parsedLog.name === "StateChanged");

    expect(event).to.not.be.undefined;
    expect(event?.args?.oldState).to.equal(0);
    expect(event?.args?.newState).to.equal(1);

    expect(await campaign.state()).to.equal(1);
  });
});