import { MsgInstantiateContract2 } from "cosmjs-types/cosmwasm/wasm/v1/tx";
import { toUtf8 } from "@cosmjs/encoding";
import { EncodeObject } from "@cosmjs/proto-signing";
import { predictInstantiate2Address } from "@burnt-labs/quick-start-utils";
import { NFT_INSTANTIATE_CHECKSUM } from "../config/constants";
import { MsgExecuteContract } from "cosmjs-types/cosmwasm/wasm/v1/tx";
import { NFT_TOKEN_URI } from "../config/constants";

const REST_URL = import.meta.env.VITE_REST_URL || "https://api.xion-testnet-2.burnt.com";

export function predictContractAddress(
  senderAddress: string,
  saltString: string
) {
  const salt = new TextEncoder().encode(saltString);

  const predictedContractAddress = predictInstantiate2Address({
    senderAddress,
    checksum: NFT_INSTANTIATE_CHECKSUM,
    salt,
  });

  return predictedContractAddress;
}
export async function generateInstantiateNFTContractMessage(
  senderAddress: string,
  saltString: string,
  codeId: number,
  nftName?: string,
  nftSymbol?: string,
) {
  const salt = new TextEncoder().encode(saltString);
  const msg = {
    name: nftName || "Hot Potato",
    symbol: nftSymbol || "HOTPOTATO",
  };

  const msgUserMapMessage = MsgInstantiateContract2.fromPartial({
    sender: senderAddress,
    admin: senderAddress,
    codeId: BigInt(codeId),
    label: `NFT Contract`,
    msg: toUtf8(JSON.stringify(msg)),
    funds: [],
    salt: salt,
    fixMsg: false,
  });

  const wrappedMsg: EncodeObject = {
    typeUrl: "/cosmwasm.wasm.v1.MsgInstantiateContract2",
    value: msgUserMapMessage,
  };

  return wrappedMsg;
}

/**
 * Query if a specific NFT token is minted and get its owner (CW721 standard)
 * Returns: { minted: boolean, owner?: string }
 */
export async function queryPotatoNFTOwner(contractAddress: string, tokenId = "potato_1") {
  try {
    const queryMsg = { owner_of: { token_id: tokenId } };
    const res = await fetch(
      `${REST_URL}/cosmwasm/wasm/v1/contract/${contractAddress}/smart/${btoa(
        JSON.stringify(queryMsg)
      )}`
    );
    if (!res.ok) return { minted: false };
    const jsonRes = await res.json();
    // CW721 returns { owner: string }
    if (jsonRes.data && jsonRes.data.owner) {
      return { minted: true, owner: jsonRes.data.owner };
    }
    if (jsonRes.owner) {
      return { minted: true, owner: jsonRes.owner };
    }
    return { minted: false };
  } catch {
    // If error is "not found", treat as not minted
    return { minted: false };
  }
}

/**
 * Generate a MsgExecuteContract to mint the 1/1 potato NFT
 */
export function generateMintPotatoNFTMessage({
  senderAddress,
  contractAddress,
  tokenId = "potato_1",
  tokenUri = NFT_TOKEN_URI,
}: {
  senderAddress: string;
  contractAddress: string;
  tokenId?: string;
  tokenUri?: string;
}): EncodeObject {
  const mintMsg = {
    mint: {
      token_id: tokenId,
      owner: senderAddress,
      token_uri: tokenUri,
    },
  };
  const msg = MsgExecuteContract.fromPartial({
    sender: senderAddress,
    contract: contractAddress,
    msg: toUtf8(JSON.stringify(mintMsg)),
    funds: [],
  });
  return {
    typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
    value: msg,
  };
}

/**
 * Generate a MsgExecuteContract to transfer the 1/1 potato NFT
 */
export function generateTransferPotatoNFTMessage({
  senderAddress,
  contractAddress,
  recipient,
  tokenId = "potato_1",
}: {
  senderAddress: string;
  contractAddress: string;
  recipient: string;
  tokenId?: string;
}): EncodeObject {
  const transferMsg = {
    transfer_nft: {
      recipient,
      token_id: tokenId,
    },
  };
  const msg = MsgExecuteContract.fromPartial({
    sender: senderAddress,
    contract: contractAddress,
    msg: toUtf8(JSON.stringify(transferMsg)),
    funds: [],
  });
  return {
    typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
    value: msg,
  };
}
