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
  // Transfer NFT
  transferSuccess?: boolean;
  transferError?: string;
  transferTxHash?: string;
  onTransferStatusClose?: () => void;
  // Actions
  onLaunch: () => void;
  onErrorClose: () => void;
  onMintPotatoNFT?: () => void;
  onTransferSuccess?: (txHash: string) => void;
  onTransferError?: (err: Error) => void;
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
  transferSuccess,
  transferError,
  transferTxHash,
  onTransferStatusClose,
  onLaunch,
  onErrorClose,
  onMintPotatoNFT,
  onTransferSuccess,
  onTransferError,
}: LauncherViewProps) {
  // Potato NFT status
  const { data: potatoStatus, isLoading: isPotatoLoading } = usePotatoNFTOwner(userAddress);

  // Provide default no-op handlers if not passed
  const handleTransferSuccess = onTransferSuccess || (() => {});
  const handleTransferError = onTransferError || (() => {});
  const handleTransferStatusClose = onTransferStatusClose || (() => {});

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
          userAddress={userAddress}
          onTransferSuccess={handleTransferSuccess}
          onTransferError={handleTransferError}
        />
      )}

      {/* Fixed position for success and error messages */}
      <section className="fixed bottom-0 left-0 right-0 p-4 z-100">
        {/* Success: priority transfer > mint > deploy */}
        {transferSuccess && transferTxHash ? (
          <SuccessMessage transactionHash={transferTxHash} onClose={handleTransferStatusClose} />
        ) : isSuccess && transactionHash ? (
          <SuccessMessage transactionHash={transactionHash} onClose={onErrorClose} />
        ) : null}
        {/* Error: priority transfer > mint/deploy */}
        {transferError ? (
          <ErrorMessage errorMessage={transferError} onClose={handleTransferStatusClose} />
        ) : errorMessage ? (
          <ErrorMessage errorMessage={errorMessage} onClose={onErrorClose} />
        ) : null}
      </section>
    </div>
  );
}