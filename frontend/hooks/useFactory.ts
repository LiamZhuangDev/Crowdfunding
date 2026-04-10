import { ethers } from 'ethers';
import { useWeb3 } from './useWeb3';
import { CrowdfundingFactoryABI } from '@/lib/abis';

const FACTORY_ADDRESS = process.env.NEXT_PUBLIC_FACTORY_ADDRESS || '';

export function useFactory() {
  const { signer } = useWeb3();

  const createCampaign = async (
    name: string,
    description: string,
    goal: string,
    durationInDays: number
  ) => {
    console.log('useFactory.createCampaign called with:', { name, description, goal, durationInDays });
    
    if (!signer) {
      console.error('Signer is null');
      throw new Error('钱包未连接，请先连接钱包');
    }
    
    if (!FACTORY_ADDRESS) {
      console.error('Factory address not configured');
      throw new Error('工厂合约地址未配置');
    }

    if (!name || name.trim().length === 0) {
      throw new Error('活动名称不能为空');
    }

    if (durationInDays < 1) {
      throw new Error('活动持续时间必须至少为 1 天');
    }

    try {
      console.log('Creating factory contract instance...');
      const factory = new ethers.Contract(
        FACTORY_ADDRESS,
        CrowdfundingFactoryABI,
        signer
      );

      console.log('Calling createCampaign on factory...');
      const goalWei = ethers.parseEther(goal);
      const deadline = BigInt(Math.floor(Date.now() / 1000) + durationInDays * 24 * 60 * 60);
      console.log('Goal in wei:', goalWei.toString());
      console.log('Deadline:', deadline.toString());
      
      const tx = await factory.createCampaign(
        name.trim(),
        description.trim(),
        goalWei,
        deadline
      );
      console.log('Transaction sent:', tx.hash);
      console.log('Waiting for transaction confirmation...');
      
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);
      
      return receipt;
    } catch (error: any) {
      console.error('Error in createCampaign:', error);
      // 提供更友好的错误信息
      if (error.code === 'ACTION_REJECTED') {
        throw new Error('用户取消了交易');
      } else if (error.code === 'INSUFFICIENT_FUNDS') {
        throw new Error('余额不足，请确保账户有足够的 ETH');
      } else if (error.reason) {
        throw new Error(error.reason);
      } else {
        throw error;
      }
    }
  };

  return { createCampaign };
}
