import { PageTitle, MutedText } from "./ui/Typography";
import { ContractSelectionSection } from "./ContractSelectionSection";
import { DeployedContractsSection } from "./DeployedContractsSection";
import { LaunchSection } from "./LaunchSection";
import { FrameworkSelectionSection } from "./FrameworkSelectionSection";
import { InstallationSection } from "./InstallationSection";
import { type ContractType } from "../config/contractTypes";
import { type FrontendTemplate } from "../config/constants";
import type { DeployedContract } from "../hooks/useContractDeployment";

interface LauncherViewProps {
  // Content
  pageTitle: string;
  pageDescription: string;
  
  // State
  contractType: ContractType;
  frontendTemplate: FrontendTemplate;
  transactionHash: string;
  errorMessage: string;
  isPending: boolean;
  isSuccess: boolean;
  isLoadingContracts: boolean;
  isDeployed: boolean;
  textboxValue: string;
  previousDeployments: DeployedContract[];
  addresses: {
    appAddress: string;
    treasuryAddress: string;
    rumAddress?: string;
  } | null;
  account?: { bech32Address: string };
  
  // Actions
  onContractTypeChange: (type: ContractType) => void;
  onFrontendTemplateChange: (template: FrontendTemplate) => void;
  onLaunch: () => void;
  onErrorClose: () => void;
}

export function LauncherView({
  pageTitle,
  pageDescription,
  contractType,
  frontendTemplate,
  transactionHash,
  errorMessage,
  isPending,
  isSuccess,
  isLoadingContracts,
  isDeployed,
  textboxValue,
  previousDeployments,
  addresses,
  account,
  onContractTypeChange,
  onFrontendTemplateChange,
  onLaunch,
  onErrorClose,
}: LauncherViewProps) {
  return (
    <div className="flex flex-col w-full max-w-screen-md mx-auto">
      <header className="mb-4">
        <PageTitle>{pageTitle}</PageTitle>
        <MutedText>{pageDescription}</MutedText>
      </header>

      <ContractSelectionSection
        contractType={contractType}
        onContractTypeChange={onContractTypeChange}
        disabled={isPending}
      />

      <DeployedContractsSection
        contractType={contractType}
        deployedContracts={previousDeployments}
      />

      <LaunchSection
        onLaunch={onLaunch}
        isPending={isPending || isLoadingContracts}
        isSuccess={isSuccess}
        transactionHash={transactionHash}
        errorMessage={errorMessage}
        onErrorClose={onErrorClose}
        contractType={contractType}
        isDeployed={isDeployed}
      />

      {addresses && (
        <>
          <FrameworkSelectionSection
            frontendTemplate={frontendTemplate}
            onTemplateChange={onFrontendTemplateChange}
          />

          <InstallationSection
            frontendTemplate={frontendTemplate}
            textboxValue={textboxValue}
            account={account}
          />
        </>
      )}
    </div>
  );
}