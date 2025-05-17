import { BlockfrostProvider } from "@meshsdk/core";

const blockfrostApiKey = process.env.BLOCKFROST_KEY!;

const sidanPoolId = process.env.NEXT_PUBLIC_SIDAN_POOL_ID!;
const sidanDRepId = process.env.NEXT_PUBLIC_SIDAN_DREP_ID_129!;

const blockchainProvider = new BlockfrostProvider(blockfrostApiKey);

export const checkIfStaked = async (stakeAddress: string) => {
  const info = await blockchainProvider.get(`/accounts/${stakeAddress}`);
  const { active, pool_id, drep_id } = info;

  if (!active) {
    return {
      isRegistered: active,
      isStaked: false,
      isDRepDelegated: false,
    };
  }

  return {
    isRegistered: active,
    isStaked: pool_id === sidanPoolId,
    isDRepDelegated: drep_id === sidanDRepId,
  };
};
