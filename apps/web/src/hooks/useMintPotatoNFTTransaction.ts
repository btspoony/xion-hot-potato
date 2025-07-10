import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { GranteeSignerClient } from "@burnt-labs/abstraxion";
import { DeliverTxResponse } from "@cosmjs/stargate";
import { generateMintPotatoNFTMessage } from "../lib/nft";
import { executeBatchTransaction } from "../lib/txBase";

interface MintPotatoNFTParams {
  senderAddress: string;
  contractAddress: string;
  client: GranteeSignerClient;
}

export function useMintPotatoNFTTransaction(
  options?: UseMutationOptions<DeliverTxResponse, Error, MintPotatoNFTParams>
) {
  return useMutation<DeliverTxResponse, Error, MintPotatoNFTParams>({
    mutationFn: async ({ senderAddress, contractAddress, client }) => {
      const msg = generateMintPotatoNFTMessage({
        senderAddress,
        contractAddress,
      });
      const tx = await executeBatchTransaction({
        client,
        messages: [msg],
        senderAddress,
      });
      return tx;
    },
    ...options,
  });
} 