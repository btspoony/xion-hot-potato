import { predictInstantiate2Address } from "@burnt-labs/quick-start-utils";
import type { DeployedContract } from "../hooks/useContractDeployment";
import { NFT_INSTANTIATE_CHECKSUM, NFT_SALT } from "../config/constants";

const REST_URL = import.meta.env.VITE_REST_URL || "https://api.xion-testnet-2.burnt.com";

export interface ContractQueryOptions {
  senderAddress: string;
}

export class ContractQueryService {
  /**
   * Fetch previously deployed contracts with metadata
   */
  async fetchDeployedContracts(
    options: ContractQueryOptions
  ): Promise<DeployedContract[]> {
    const { senderAddress } = options;
    
    // Treasury addresses for each contract type (using unique salts)
    const contractAddress = predictInstantiate2Address({
      senderAddress: senderAddress,
      checksum: NFT_INSTANTIATE_CHECKSUM,
      salt: new TextEncoder().encode(NFT_SALT),
    });

    const contractExists = await this.checkContractExists(contractAddress);

    const deployments: DeployedContract[] = [];
    if (contractExists) {
      deployments.push({
        address: contractAddress,
        salt: NFT_SALT,
        creator: senderAddress,
        minter: senderAddress,
      });
    }

    return deployments;
  }

  /**
   * Check if a specific contract exists at an address
   */
  async checkContractExists(address: string): Promise<boolean> {
    try {
      const response = await fetch(`${REST_URL}/cosmos/wasm/v1/contract/${address}`);
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Get contract info
   */
  async getContractInfo(address: string): Promise<unknown> {
    try {
      const response = await fetch(`${REST_URL}/cosmos/wasm/v1/contract/${address}`);
      if (!response.ok) return null;
      const data = await response.json();
      return data.contract_info;
    } catch {
      return null;
    }
  }
}