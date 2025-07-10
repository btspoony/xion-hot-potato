import { EncodeObject } from "@cosmjs/proto-signing";
import {
  generateInstantiateNFTContractMessage,
  predictContractAddress,
} from "./nft";

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
