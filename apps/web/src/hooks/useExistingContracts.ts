import { useQuery } from "@tanstack/react-query";
import { predictInstantiate2Address, verifyContractExists } from "@burnt-labs/quick-start-utils";
import { NFT_INSTANTIATE_CHECKSUM, NFT_SALT, PRE_DEPLOYED_NFT_CONTRACT_ADDRESS } from "../config/constants";
import { queryPotatoNFTOwner } from "../lib/nft";

export const EXISTING_CONTRACTS_QUERY_KEY = "existing-contracts";

// const RPC_URL = import.meta.env.VITE_RPC_URL || "https://rpc.xion-testnet-2.burnt.com:443";
const REST_URL = import.meta.env.VITE_REST_URL || "https://api.xion-testnet-2.burnt.com";

export const useExistingContracts = (address: string) => {
  return useQuery({
    queryKey: [EXISTING_CONTRACTS_QUERY_KEY, address],
    queryFn: async () => {
      // Treasury addresses for each contract type (using unique salts)
      const contractAddress = predictInstantiate2Address({
        senderAddress: address,
        checksum: NFT_INSTANTIATE_CHECKSUM,
        salt: new TextEncoder().encode(NFT_SALT),
      });

      const contractExists = await verifyContractExists({
        address: contractAddress,
        restUrl: REST_URL,
      });

      return {
        contractExists,
        contractAddress,
      };
    },
    enabled: !!address,
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export function usePotatoNFTOwner(userAddress: string | undefined) {
  return useQuery({
    queryKey: ["potato-nft-owner", userAddress],
    queryFn: async () => {
      const result = await queryPotatoNFTOwner(PRE_DEPLOYED_NFT_CONTRACT_ADDRESS);
      return {
        ...result,
        isOwner: !!userAddress && result.minted && result.owner === userAddress,
      };
    },
    enabled: !!userAddress,
    refetchOnWindowFocus: false,
  });
}
