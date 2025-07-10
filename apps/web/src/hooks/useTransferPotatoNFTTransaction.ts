import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { GranteeSignerClient } from "@burnt-labs/abstraxion";
import { DeliverTxResponse } from "@cosmjs/stargate";
import { generateTransferPotatoNFTMessage } from "../lib/nft";
import { executeBatchTransaction } from "../lib/txBase";

interface TransferPotatoNFTParams {
  senderAddress: string;
  contractAddress: string;
  recipient: string;
  client: GranteeSignerClient;
}

export function useTransferPotatoNFTTransaction(
  options?: UseMutationOptions<DeliverTxResponse, Error, TransferPotatoNFTParams>
) {
  return useMutation<DeliverTxResponse, Error, TransferPotatoNFTParams>({
    mutationFn: async ({ senderAddress, contractAddress, recipient, client }) => {
      const msg = generateTransferPotatoNFTMessage({
        senderAddress,
        contractAddress,
        recipient,
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