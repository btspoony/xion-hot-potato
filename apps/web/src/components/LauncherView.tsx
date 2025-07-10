import { PageTitle, MutedText } from "./ui/Typography";
import { LaunchSection } from "./LaunchSection";

interface LauncherViewProps {
  // Content
  pageTitle: string;
  pageDescription: string;
  
  // State
  transactionHash: string;
  errorMessage: string;
  isPending: boolean;
  isSuccess: boolean;
  isDeployed: boolean;
  
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
  isDeployed, 
  onLaunch,
  onErrorClose,
}: LauncherViewProps) {
  return (
    <div className="flex flex-col w-full max-w-screen-md mx-auto">
      <header className="mb-4">
        <PageTitle>{pageTitle}</PageTitle>
        <MutedText>{pageDescription}</MutedText>
      </header>

      <LaunchSection
        onLaunch={onLaunch}
        isPending={isPending}
        isSuccess={isSuccess}
        transactionHash={transactionHash}
        errorMessage={errorMessage}
        onErrorClose={onErrorClose}
        isDeployed={isDeployed}
      />
    </div>
  );
}