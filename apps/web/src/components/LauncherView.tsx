import { PageTitle, MutedText } from "./ui/Typography";
import { DeployedContractsSection } from "./DeployedContractsSection";
import { LaunchSection } from "./LaunchSection";
import type { DeployedContract, DeploymentState } from "../hooks/useContractDeployment";

interface LauncherViewProps {
  // Content
  pageTitle: string;
  pageDescription: string;
  
  // State
  transactionHash: string;
  errorMessage: string;
  isPending: boolean;
  isSuccess: boolean;
  isLoadingContracts: boolean;
  isDeployed: boolean;
  previousDeployments: DeployedContract[];
  addresses: DeploymentState | null;
  account?: { bech32Address: string };
  
  // Actions
  onLaunch: () => void;
  onErrorClose: () => void;
}

export function LauncherView({
  pageTitle,
  pageDescription,
  transactionHash,
  errorMessage,
  isPending,
  isSuccess,
  isLoadingContracts,
  isDeployed,
  previousDeployments,
  addresses,
  account,
  onLaunch,
  onErrorClose,
}: LauncherViewProps) {
  // TODO: remove this
  console.log("addresses", addresses);
  console.log("account", account);
  return (
    <div className="flex flex-col w-full max-w-screen-md mx-auto">
      <header className="mb-4">
        <PageTitle>{pageTitle}</PageTitle>
        <MutedText>{pageDescription}</MutedText>
      </header>

      <DeployedContractsSection
        deployedContracts={previousDeployments}
      />

      <LaunchSection
        onLaunch={onLaunch}
        isPending={isPending || isLoadingContracts}
        isSuccess={isSuccess}
        transactionHash={transactionHash}
        errorMessage={errorMessage}
        onErrorClose={onErrorClose}
        isDeployed={isDeployed}
      />
    </div>
  );
}