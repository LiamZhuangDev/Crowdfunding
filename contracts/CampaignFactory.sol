// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import './Campaign.sol';

contract CampaignFactory {
    Campaign[] public campaigns;
    mapping(address => uint256[]) public campaignsByCreator;

    event CampaignCreated(address indexed creator, address indexed campaignAddress);

    function createCampaign(
        string memory _name, 
        string memory _description, 
        uint256 _goal, 
        uint256 _deadline) external returns (address)
    {
        Campaign newCampaign = new Campaign(msg.sender, _name, _description, _goal, _deadline);
        campaigns.push(newCampaign);
        campaignsByCreator[msg.sender].push(campaigns.length - 1);
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
        uint256[] memory indices = campaignsByCreator[_creator];
        uint256 length = indices.length;
        address[] memory campaignAddresses = new address[](length);
        for (uint256 i = 0; i < length; i++) {
            uint256 index = indices[i];
            campaignAddresses[i] = address(campaigns[index]);
        }
        return campaignAddresses;
    }

    function getCampaignCount() external view returns (uint256) {
        return campaigns.length;
    }
}