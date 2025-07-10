// import { useState } from "react";
import {
  useAbstraxionAccount,
  useAbstraxionSigningClient,
} from "@burnt-labs/abstraxion";
import { LauncherView } from "./LauncherView";
import { useContractDeployment } from "../hooks/useContractDeployment";
import launcherContent from "../content/launcher.json";

export default function LauncherContainer() {
  const { data: account } = useAbstraxionAccount();
  const { client } = useAbstraxionSigningClient();
  
  const deployment = useContractDeployment(account);

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

  return (
    <LauncherView
      // Content
      pageTitle={launcherContent.page_title}
      pageDescription={launcherContent.page_description}
      
      // State
      transactionHash={deployment.transactionHash}
      errorMessage={deployment.errorMessage}
      isPending={deployment.isPending}
      isSuccess={deployment.isSuccess}
      isDeployed={!!deployment.currentDeployment?.cw721Address}
      
      // Actions
      onLaunch={handleLaunch}
      onErrorClose={deployment.clearError}
    />
  );
}