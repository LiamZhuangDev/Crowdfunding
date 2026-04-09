// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import './Campaign.sol';

contract CampaignFactory {
    Campaign[] public campaigns;
    mapping(address => Campaign[]) public campaignsByCreator;

    event CampaignCreated(address indexed creator, address indexed campaignAddress);

    function createCampaign(
        string memory _name, 
        string memory _description, 
        uint256 _goal, 
        uint256 _deadline) external returns (address)
    {
        Campaign newCampaign = new Campaign(msg.sender, _name, _description, _goal, _deadline);
        campaigns.push(newCampaign);
        campaignsByCreator[msg.sender].push(newCampaign);
        emit CampaignCreated(msg.sender, address(newCampaign));
        return address(newCampaign);
    }

    function getAllCampaigns() external view returns (address[] memory) {
        address[] memory campaignAddresses = new address[](campaigns.length);
        for (uint256 i = 0; i < campaigns.length; i++) {
            campaignAddresses[i] = address(campaigns[i]);
        }
        return campaignAddresses;
    }

    function getCampaignsByCreator(address _creator) external view returns (address[] memory) {
        Campaign[] memory creatorCampaigns = campaignsByCreator[_creator];
        address[] memory campaignAddresses = new address[](creatorCampaigns.length);
        for (uint256 i = 0; i < creatorCampaigns.length; i++) {
            campaignAddresses[i] = address(creatorCampaigns[i]);
        }
        return campaignAddresses;
    }

    function getCampaignCount() external view returns (uint256) {
        return campaigns.length;
    }
}