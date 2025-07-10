import { useState } from "react";
import {
  useAbstraxionAccount,
  useAbstraxionSigningClient,
} from "@burnt-labs/abstraxion";
import { LauncherView } from "./LauncherView";
import { useContractDeployment } from "../hooks/useContractDeployment";
import launcherContent from "../content/launcher.json";
import { useMintPotatoNFTTransaction } from "../hooks/useMintPotatoNFTTransaction";

export default function LauncherContainer() {
  const { data: account } = useAbstraxionAccount();
  const { client } = useAbstraxionSigningClient();
  
  const deployment = useContractDeployment(account);

  // Transfer NFT global status
  const [transferSuccess, setTransferSuccess] = useState(false);
  const [transferError, setTransferError] = useState<string>("");
  const [transferTxHash, setTransferTxHash] = useState<string>("");

  const contractAddress = deployment.currentDeployment?.cw721Address;
  const userAddress = account?.bech32Address;

  // Mint Potato NFT mutation
  const mintMutation = useMintPotatoNFTTransaction();

  const handleLaunch = async () => {
    if (!client || !account) return;
    try {
      await deployment.deployNFTContract({
        senderAddress: account.bech32Address,
        client,
      });
    } catch {
      // Error is handled by the deployment hook
    }
  };

  const handleMintPotatoNFT = () => {
    if (!client || !userAddress || !contractAddress) return;
    mintMutation.mutate({
      senderAddress: userAddress,
      contractAddress,
      client,
    });
  };

  const clearErrors = () => {
    if (deployment.errorMessage) {
      deployment.clearError();
    }
    if (mintMutation.error) {
      mintMutation.reset();
    }
    setTransferError("");
    setTransferSuccess(false);
    setTransferTxHash("");
  };

  // Callbacks for transfer NFT
  const handleTransferSuccess = (txHash: string) => {
    setTransferSuccess(true);
    setTransferError("");
    setTransferTxHash(txHash);
  };
  const handleTransferError = (err: Error) => {
    setTransferSuccess(false);
    setTransferError(err.message);
    setTransferTxHash("");
  };

  return (
    <LauncherView
      // Content
      pageTitle={launcherContent.page_title}
      pageDescription={launcherContent.page_description}
      
      // State
      transactionHash={deployment.transactionHash}
      errorMessage={deployment.errorMessage || (mintMutation.error ? mintMutation.error.message : "")}
      isPending={deployment.isPending}
      isSuccess={deployment.isSuccess}
      isDeployed={!!deployment.currentDeployment?.cw721Address}
      contractAddress={contractAddress}
      userAddress={userAddress}
      isMintPending={mintMutation.isPending}
      
      // Transfer NFT status
      transferSuccess={transferSuccess}
      transferError={transferError}
      transferTxHash={transferTxHash}
      onTransferStatusClose={clearErrors}
      
      // Actions
      onLaunch={handleLaunch}
      onErrorClose={clearErrors}
      onMintPotatoNFT={handleMintPotatoNFT}
      onTransferSuccess={handleTransferSuccess}
      onTransferError={handleTransferError}
    />
  );
}