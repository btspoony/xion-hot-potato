import { type QueryClient } from "@tanstack/react-query";
import { EXISTING_CONTRACTS_QUERY_KEY } from "../hooks/useExistingContracts";
import { CONTRACT_TYPES } from "../config/contractTypes";

export interface ContractAddresses {
  cw721Address?: string;
}

export interface CW721Deployment {
  address: string;
  minter: string;
  creator: string;
}

export interface DeploymentResult {
  addresses: ContractAddresses;
  transactionHash: string;
  deployments?: CW721Deployment[];
}

export class ContractDeploymentService {
  private queryClient: QueryClient;
  
  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient;
  }

  /**
   * Invalidate contract queries after deployment
   */
  async invalidateContractQueries(accountAddress?: string, delay: number = 3000): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.queryClient.invalidateQueries({
          queryKey: [EXISTING_CONTRACTS_QUERY_KEY, accountAddress],
        });
        resolve();
      }, delay);
    });
  }

  /**
   * Process UserMap deployment result
   */
  processUserMapDeployment(data: {
    nftAddress: string;
    tx: { transactionHash: string };
  }): DeploymentResult {
    return {
      addresses: {
        cw721Address: data.nftAddress,
      },
      transactionHash: data.tx.transactionHash,
    };
  }

  /**
   * Get deployment state key based on contract type
   */
  getDeploymentStateKey(contractType: string): CONTRACT_TYPES {
    return contractType as CONTRACT_TYPES;
  }

  /**
   * Format deployment for state storage
   */
  formatDeploymentForState(result: DeploymentResult): {
    cw721Address: string;
  } | null {
    if (result.addresses.cw721Address) {
      return {
        cw721Address: result.addresses.cw721Address,
      };
    }
    return null;
  }

  /**
   * Log deployment information
   */
  logDeploymentInfo(deployments?: CW721Deployment[]): void {
    if (deployments && deployments.length > 0) {
      const deploymentInfo = deployments
        .map(d => `${d.minter}: ${d.address}`)
        .join('\n');
      console.log('Deployed CW721contracts:', deploymentInfo);
    }
  }
}