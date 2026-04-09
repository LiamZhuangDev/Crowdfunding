🪙 Web3 Crowdfunding Platform

A decentralized crowdfunding platform built with Solidity and Hardhat that enables project creators to raise funds securely while protecting contributors through transparent and automated smart contract logic.

✨ Features
🚀 Project Creation
- Creators can launch crowdfunding campaigns with:
  - Funding goal
  - Deadline
  - Project description
- Parameters are immutable once the project is created

💰 Contribution System
- Users can contribute funds to active campaigns
- Each contribution is recorded on-chain
- Real-time tracking of total funds raised per project

🔄 Automatic State Management
Projects automatically transition between states:
- Active → Fundraising in progress
- Successful → Goal reached before deadline
- Failed → Goal not reached before deadline

🔐 Fund Security
- Funds are locked in the smart contract
- If successful: Creator can withdraw funds
- If failed: Contributors can claim refunds

🎁 Contributor Rewards (Optional Extensions)

This platform is designed to be extensible. Contributors can receive:

- ERC20 tokens (governance or utility)
- NFTs (proof of contribution, rewards, perks)
- Future revenue sharing (advanced)

🏗️ Tech Stack
- Solidity — Smart contract development
- Hardhat 3 (ESM) — Development framework
- Ethers.js — Blockchain interaction
- TypeScript (optional) — Scripts and tooling