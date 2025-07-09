import { useState, useEffect, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { type GranteeSignerClient } from "@burnt-labs/abstraxion";
import { useLaunchUserMapTransaction } from "./useLaunchNFTTransaction";
import { ContractDeploymentService } from "../services/ContractDeploymentService";
import { ContractQueryService } from "../services/ContractQueryService";

const RPC_URL = import.meta.env.VITE_RPC_URL || "https://rpc.xion-testnet-2.burnt.com:443";
const REST_URL = import.meta.env.VITE_REST_URL || "https://api.xion-testnet-2.burnt.com";

export interface DeployedContract {
  address: string;
  salt: string;
  index?: number;
  creator?: string;
  minter?: string;
}

export interface DeploymentState {
  cw721Address: string;
}

export interface ContractDeploymentResult {
  // State
  deployedContracts: DeploymentState;
  previousDeployments: DeployedContract[];
  transactionHash: string;
  errorMessage: string;
  isLoadingContracts: boolean;
  
  // Computed values
  currentDeployment: DeploymentState | undefined;
  addresses: {
    cw721: string;
  } | null;
  textboxValue: string;
  isPending: boolean;
  isSuccess: boolean;
  
  // Actions
  deployCW721: (params: { senderAddress: string; client: GranteeSignerClient }) => Promise<void>;
  clearError: () => void;
  clearTransaction: () => void;
}

export function useContractDeployment(
  account?: { bech32Address: string }
): ContractDeploymentResult {
  const queryClient = useQueryClient();
  const [transactionHash, setTransactionHash] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [deployedContracts, setDeployedContracts] = useState<DeploymentState>({});
  const [previousDeployments, setPreviousDeployments] = useState<DeployedContract[]>([]);
  const [isLoadingContracts, setIsLoadingContracts] = useState(false);

  // Initialize services
  const deploymentService = useMemo(() => new ContractDeploymentService(queryClient), [queryClient]);
  const queryService = useMemo(() => new ContractQueryService(), []);

  // Clear success/error state when contract type changes
  useEffect(() => {
    setTransactionHash("");
    setErrorMessage("");
    if (account?.bech32Address) {
      // FIXME: Need to fetch existing contracts
      // refetchExistingContracts();
    }
  }, [account?.bech32Address]);

  // Fetch previously deployed contracts with different salts
  useEffect(() => {
    async function fetchPreviousDeployments() {
      if (!account?.bech32Address) {
        setPreviousDeployments([]);
        return;
      }

      setIsLoadingContracts(true);
      try {
        // FIXME: Need to fetch existing deployments
        // const deploymentsWithMetadata = 
        // setPreviousDeployments(deploymentsWithMetadata);
      } catch (error) {
        console.error("Error fetching previous deployments:", error);
      } finally {
        setIsLoadingContracts(false);
      }
    }

    fetchPreviousDeployments();
  }, [account?.bech32Address, queryService]);

  // Check for existing contracts on startup
  useEffect(() => {
    if (existingAddresses) {
      setDeployedContracts(prev => {
        const updates: DeploymentState = {};
        
        if (existingAddresses.appAddress) {
          updates[CONTRACT_TYPES.CW721] = {
            cw721Address: existingAddresses.appAddress,
          };
        }
        
        if (existingAddresses.rumAddress) {
          // Preserve the existing treasury address if we already have one from deployment
          updates[CONTRACT_TYPES.CW721] = {
            cw721Address: existingAddresses.rumAddress,
          };
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
  const currentDeployment = deployedContracts;
  
  // Format addresses for display
  const addresses = useMemo(() => {
    if (!currentDeployment) return null;
    
    return {
      cw721Address: currentDeployment.cw721Address,
    };
  }, [currentDeployment]);

  // NFT Contract deployment
  const {
    mutateAsync: launchUserMapTransaction,
    isPending: isUserMapPending,
    isSuccess: isUserMapSuccess,
  } = useLaunchUserMapTransaction({
    onSuccess: async (data) => {
      const result = deploymentService.processNFTDeployment(data);
      const stateData = deploymentService.formatDeploymentForState(result);
      
      if (stateData && 'appAddress' in stateData) {
        setDeployedContracts(prev => ({
          ...prev,
          [CONTRACT_TYPES.USER_MAP]: stateData as { appAddress: string; treasuryAddress: string },
        }));
      }
      
      await deploymentService.invalidateContractQueries(account?.bech32Address);
      setTransactionHash(result.transactionHash);
    },
    onError: (error) => {
      setErrorMessage(error.message);
    },
  });

  const isPending = contractType === CONTRACT_TYPES.RUM ? isMultiRumPending : isUserMapPending;
  const isSuccess = contractType === CONTRACT_TYPES.RUM ? isMultiRumSuccess : isUserMapSuccess;

  // Action handlers
  const deployNFTContract = async ({ senderAddress, client }: { 
    senderAddress: string; 
    client: GranteeSignerClient;
  }) => {
    await launchUserMapTransaction({
      senderAddress,
      saltString: INSTANTIATE_SALT,
      client,
    });
  };

  return {
    // State
    deployedContracts,
    previousDeployments,
    transactionHash,
    errorMessage,
    isLoadingContracts,
    
    // Computed values
    currentDeployment,
    currentAddresses,
    textboxValue,
    isPending,
    isSuccess,
    
    // Actions
    deployNFTContract,
    clearError: () => setErrorMessage(""),
    clearTransaction: () => setTransactionHash(""),
  };
}