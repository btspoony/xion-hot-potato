import { PageTitle, MutedText } from "./ui/Typography";
import { LaunchSection } from "./LaunchSection";
import { usePotatoNFTOwner } from "../hooks/useExistingContracts";
import { NFTSection } from "./NFTSection";
import { SuccessMessage } from "./SuccessMessage";
import { ErrorMessage } from "./ErrorMessage";

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
  contractAddress?: string;
  userAddress?: string;
  isMintPending?: boolean;
  
  // Actions
  onLaunch: () => void;
  onErrorClose: () => void;
  onMintPotatoNFT?: () => void;
}

export function LauncherView({
  pageTitle,
  pageDescription,
  transactionHash,
  errorMessage,
  isPending,
  isSuccess,
  isDeployed, 
  contractAddress,
  userAddress,
  isMintPending,
  onLaunch,
  onErrorClose,
  onMintPotatoNFT,
}: LauncherViewProps) {
  // Potato NFT status
  const { data: potatoStatus, isLoading: isPotatoLoading } = usePotatoNFTOwner(userAddress);

  return (
    <div className="flex flex-col w-full max-w-screen-md mx-auto">
      <header className="mb-4">
        <PageTitle>{pageTitle}</PageTitle>
        <MutedText>{pageDescription}</MutedText>
      </header>

      <LaunchSection
        onLaunch={onLaunch}
        isPending={isPending}
        contractAddress={contractAddress}
        isDeployed={isDeployed}
      />

      {isDeployed && (
        <NFTSection
          isMintPending={isMintPending}
          onMint={onMintPotatoNFT}
          potatoStatus={potatoStatus}
          isPotatoLoading={isPotatoLoading}
        />
      )}

      {/* Fixed position for success and error messages */}
      <section className="fixed bottom-0 left-0 right-0 p-4">
        {isSuccess && <SuccessMessage transactionHash={transactionHash} />}
        {errorMessage && (
          <ErrorMessage errorMessage={errorMessage} onClose={onErrorClose} />
        )}
      </section>
    </div>
  );
}