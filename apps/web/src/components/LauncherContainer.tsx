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
    if (!client || !account?.bech32Address || !deployment.currentDeployment?.cw721Address) return;
    mintMutation.mutate({
      senderAddress: account.bech32Address,
      contractAddress: deployment.currentDeployment.cw721Address,
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
      contractAddress={deployment.currentDeployment?.cw721Address}
      userAddress={account?.bech32Address}
      isMintPending={mintMutation.isPending}
      
      // Actions
      onLaunch={handleLaunch}
      onErrorClose={clearErrors}
      onMintPotatoNFT={handleMintPotatoNFT}
    />
  );
}