// CrowdfundingCampaign ABI
export const CrowdfundingCampaignABI = [
  'function creator() view returns (address)',
  'function name() view returns (string)',
  'function description() view returns (string)',
  'function goal() view returns (uint256)',
  'function deadline() view returns (uint256)',
  'function totalContributed() view returns (uint256)',
  'function state() view returns (uint8)',
  'function contributions(address) view returns (uint256)',
  'function contribute() payable',
  'function startCampaign()',
  'function finalize()',
  'function withdraw()',
  'function refund()',
  'event ContributionReceived(address indexed contributor, uint256 amount)',
  'event StateChanged(uint8 oldState, uint8 newState)',
  'event fundsWithdrawn(address indexed creator, uint256 amount)',
  'event fundsRefunded(address indexed contributor, uint256 amount)',
] as const;

// CrowdfundingFactory ABI
export const CrowdfundingFactoryABI = [
  'function createCampaign(string memory _name, string memory _description, uint256 _goal, uint256 _deadline) returns (address)',
  'function getAllCampaigns() view returns (address[])',
  'function getCampaignsByCreator(address user) view returns (address[])',
  'function getCampaignCount() view returns (uint256)',
  'function campaigns(uint256) view returns (address)',
  'event CampaignCreated(address indexed creator, address indexed campaignAddress)',
] as const;
