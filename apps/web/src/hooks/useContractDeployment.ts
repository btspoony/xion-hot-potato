import { useState, useEffect, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { type GranteeSignerClient } from "@burnt-labs/abstraxion";
import { useLaunchNFTTransaction } from "./useLaunchNFTTransaction";
import { ContractDeploymentService } from "../services/ContractDeploymentService";
import { useExistingContracts } from "./useExistingContracts";
import { NFT_SALT } from "../config/constants";

// const RPC_URL = import.meta.env.VITE_RPC_URL || "https://rpc.xion-testnet-2.burnt.com:443";
// const REST_URL = import.meta.env.VITE_REST_URL || "https://api.xion-testnet-2.burnt.com";

export interface DeployedContract {
  address: string;
  salt: string;
  creator?: string;
  minter?: string;
}

export interface DeploymentState {
  cw721Address?: string;
}

export interface ContractDeploymentResult {
  // State
  deployedContract: DeploymentState;
  transactionHash: string;
  errorMessage: string;
  
  // Computed values
  currentDeployment: DeploymentState | undefined;
  isPending: boolean;
  isSuccess: boolean;
  
  // Actions
  deployNFTContract: (params: { senderAddress: string; client: GranteeSignerClient }) => Promise<void>;
  clearError: () => void;
  clearTransaction: () => void;
}

export function useContractDeployment(
  account?: { bech32Address: string }
): ContractDeploymentResult {
  const queryClient = useQueryClient();
  const [transactionHash, setTransactionHash] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [deployedContract, setDeployedContract] = useState<DeploymentState>({});

  const { data: existingAddresses, refetch: refetchExistingContracts } = useExistingContracts(account?.bech32Address || "");

  // Initialize services
  const deploymentService = useMemo(() => new ContractDeploymentService(queryClient), [queryClient]);
  // const queryService = useMemo(() => new ContractQueryService(), []);

  // Clear success/error state when contract type changes
  useEffect(() => {
    setTransactionHash("");
    setErrorMessage("");
    if (account?.bech32Address) {
      refetchExistingContracts();
    }
  }, [account?.bech32Address]);

  // Check for existing contracts on startup
  useEffect(() => {
    if (existingAddresses?.contractExists) {
      setDeployedContract(prev => {
        const updates: DeploymentState = {};
        
        if (existingAddresses.contractAddress) {
          updates.cw721Address = existingAddresses.contractAddress;
        }
        
        if (Object.keys(updates).length > 0) {
          return {
            ...prev,
            ...updates
          };
        }
        
        return prev;
      });
    }
  }, [existingAddresses]);

  // Get current contract type's deployed addresses
  const currentDeployment = deployedContract;

  // NFT Contract deployment
  const {
    mutateAsync: launchNFTTransaction,
    isPending: isDeployPending,
    isSuccess: isDeploySuccess,
  } = useLaunchNFTTransaction({
    onSuccess: async (data) => {
      const result = deploymentService.processNFTDeployment({
        nftAddress: data.contractAddress,
        tx: {
          transactionHash: data.tx.transactionHash,
        },
      });
      const stateData = deploymentService.formatDeploymentForState(result);
      
      if (stateData && 'cw721Address' in stateData) {
        setDeployedContract(prev => ({
          ...prev,
          cw721Address: stateData.cw721Address,
        }));
      }
      
      await deploymentService.invalidateContractQueries(account?.bech32Address);
      setTransactionHash(result.transactionHash);
    },
    onError: (error) => {
      setErrorMessage(error.message);
    },
  });

  const isPending = isDeployPending;
  const isSuccess = isDeploySuccess;

  // Action handlers
  const deployNFTContract = async ({ senderAddress, client }: { 
    senderAddress: string; 
    client: GranteeSignerClient;
  }) => {
    await launchNFTTransaction({
      senderAddress,
      saltString: NFT_SALT,
      client,
    });
  };

  return {
    // State
    deployedContract,
    transactionHash,
    errorMessage,
    
    // Computed values
    currentDeployment,
    isPending,
    isSuccess,
    
    // Actions
    deployNFTContract,
    clearError: () => setErrorMessage(""),
    clearTransaction: () => setTransactionHash(""),
  };
}