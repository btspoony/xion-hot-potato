import { EncodeObject } from "@cosmjs/proto-signing";
import {
  generateInstantiateNFTContractMessage,
  predictContractAddress,
} from "./nft";
import { GranteeSignerClient } from "@burnt-labs/abstraxion";

export async function assembleInstantiateNFTTransaction({
  senderAddress,
  saltString,
}: {
  senderAddress: string;
  saltString: string;
}) {
  const messages: EncodeObject[] = [];
  const NFT_CODE_ID = import.meta.env.VITE_NFT_CODE_ID;
  
  if (!NFT_CODE_ID) {
    throw new Error("Missing environment variables");
  }

  const contractAddress = predictContractAddress(senderAddress, saltString);

  const nftInstantiateMessage = await generateInstantiateNFTContractMessage(
    senderAddress,
    saltString,
    NFT_CODE_ID,
  );
  messages.push(nftInstantiateMessage);

  return { messages, contractAddress };
}

export async function executeBatchTransaction({
  client,
  messages,
  senderAddress,
}: {
  client: GranteeSignerClient;
  messages: EncodeObject[];
  senderAddress: string;
}) {
  if (!client) {
    throw new Error("Client is not connected");
  }
  const tx = await client.signAndBroadcast(senderAddress, messages, "auto");
  return tx;
}
