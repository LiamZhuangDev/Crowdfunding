import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("CampaignModule", (m) => {
  const factory = m.contract("CampaignFactory"); // Deploy the factory contract
  return { factory };
});