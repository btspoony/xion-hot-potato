import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { GranteeSignerClient } from "@burnt-labs/abstraxion";
import { DeliverTxResponse } from "@cosmjs/stargate";
import {
  assembleInstantiateNFTTransaction,
  executeBatchTransaction,
} from "../lib/transactionLaunchNFT";

interface LaunchNFTTransactionParams {
  senderAddress: string;
  saltString: string;
  client: GranteeSignerClient;
}

interface LaunchNFTTransactionResult {
  tx: DeliverTxResponse;
  contractAddress: string;
}

export function useLaunchNFTTransaction(
  options?: UseMutationOptions<
    LaunchNFTTransactionResult,
    Error,
    LaunchNFTTransactionParams
  >
) {
  return useMutation<LaunchNFTTransactionResult, Error, LaunchNFTTransactionParams>({
    mutationFn: async ({ senderAddress, saltString, client }) => {
      const { messages, contractAddress } =
        await assembleInstantiateNFTTransaction({
          senderAddress,
          saltString,
        });

      const tx = await executeBatchTransaction({
        client,
        messages,
        senderAddress,
      });

      return {
        tx,
        contractAddress,
      };
    },
    ...options,
  });
}