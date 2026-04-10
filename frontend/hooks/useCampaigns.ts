import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from './useWeb3';
import { CrowdfundingFactoryABI, CrowdfundingCampaignABI } from '@/lib/abis';

const FACTORY_ADDRESS = process.env.NEXT_PUBLIC_FACTORY_ADDRESS || '';

interface Campaign {
  address: string;
  creator: string;
  name: string;
  description: string;
  goal: bigint;
  totalContributed: bigint;
  deadline: bigint;
  state: number;
}

export function useCampaigns() {
  const { provider } = useWeb3();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCampaigns = useCallback(async () => {
    if (!provider || !FACTORY_ADDRESS) {
      console.warn('Missing provider or factory address:', { provider: !!provider, factoryAddress: FACTORY_ADDRESS });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // 验证合约地址格式
      if (!ethers.isAddress(FACTORY_ADDRESS)) {
        throw new Error(`Invalid factory address: ${FACTORY_ADDRESS}`);
      }

      // 检查网络
      const network = await provider.getNetwork();
      console.log('Current network:', { chainId: Number(network.chainId), name: network.name });
      
      // 检查合约代码是否存在
      const code = await provider.getCode(FACTORY_ADDRESS);
      if (code === '0x') {
        throw new Error(`No contract found at address ${FACTORY_ADDRESS} on chain ${network.chainId}`);
      }
      console.log('Contract code found, length:', code.length);

      const factory = new ethers.Contract(
        FACTORY_ADDRESS,
        CrowdfundingFactoryABI,
        provider
      );

      const addresses = await factory.getAllCampaigns();
      
      const campaignPromises = addresses.map(async (address: string) => {
        const campaign = new ethers.Contract(
          address,
          CrowdfundingCampaignABI,
          provider
        );

        const [creator, name, description, goal, deadline, totalContributed, state] = await Promise.all([
          campaign.creator(),
          campaign.name(),
          campaign.description(),
          campaign.goal(),
          campaign.deadline(),
          campaign.totalContributed(),
          campaign.state(),
        ]);

        return {
          address,
          creator,
          name,
          description,
          goal,
          totalContributed,
          deadline,
          state: Number(state),
        };
      });

      const campaignData = await Promise.all(campaignPromises);
      setCampaigns(campaignData);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  }, [provider]);

  useEffect(() => {
    // 只在初始加载和依赖变化时获取数据，不自动刷新
    fetchCampaigns();
  }, [fetchCampaigns]);

  return { campaigns, loading, refresh: fetchCampaigns };
}
