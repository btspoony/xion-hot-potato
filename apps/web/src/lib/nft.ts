import { MsgInstantiateContract2 } from "cosmjs-types/cosmwasm/wasm/v1/tx";
import { toUtf8 } from "@cosmjs/encoding";
import { EncodeObject } from "@cosmjs/proto-signing";
import { predictInstantiate2Address } from "@burnt-labs/quick-start-utils";
import { NFT_INSTANTIATE_CHECKSUM } from "../config/constants";

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
