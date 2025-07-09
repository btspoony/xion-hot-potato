import { BaseButton } from "./ui/BaseButton";
import { ArticleTitle, MutedText } from "./ui/Typography";
import { SuccessMessage } from "./SuccessMessage";
import { ErrorMessage } from "./ErrorMessage";
import launcherContent from "../content/launcher.json";

interface LaunchSectionProps {
  onLaunch: () => void;
  isPending: boolean;
  isSuccess: boolean;
  transactionHash: string;
  errorMessage: string;
  onErrorClose: () => void;
  isDeployed: boolean;
}

export function LaunchSection({
  onLaunch,
  isPending,
  isSuccess,
  transactionHash,
  errorMessage,
  onErrorClose,
  isDeployed,
}: LaunchSectionProps) {
  const stepTitle = "Launch Contract";
  const stepDescription = "Deploy your NFT contract to the blockchain";

  return (
    <article className="w-full mx-auto">
      <header className="mb-4">
        <ArticleTitle>{stepTitle}</ArticleTitle>
        <MutedText>{stepDescription}</MutedText>
      </header>
      <section className="flex flex-col gap-4 bg-white/5 rounded-lg p-8 mb-8">
        <BaseButton
          className="w-full"
          onClick={onLaunch}
          disabled={isPending || isDeployed}
        >
          {isPending
            ? launcherContent.launch_button_text.launching
            : isDeployed
            ? launcherContent.launch_button_text.launched
            : "Launch NFT Contract"}
        </BaseButton>
      </section>
      <section>
        {isSuccess && <SuccessMessage transactionHash={transactionHash} />}
        {errorMessage && (
          <ErrorMessage errorMessage={errorMessage} onClose={onErrorClose} />
        )}
      </section>
    </article>
  );
}
