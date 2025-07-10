import { BaseButton } from "./ui/BaseButton";
import { ArticleTitle, MutedText } from "./ui/Typography";
import launcherContent from "../content/launcher.json";

interface LaunchSectionProps {
  onLaunch: () => void;
  isPending: boolean;
  isDeployed: boolean;
  contractAddress?: string;
}

export function LaunchSection({
  onLaunch,
  isPending,
  isDeployed,
  contractAddress,
}: LaunchSectionProps) {
  const title = "Launch Contract";
  const description = "Deploy your NFT contract to the blockchain";

  return (
    <article className="w-full mx-auto">
      <header className="mb-4">
        <ArticleTitle>{title}</ArticleTitle>
        <MutedText>{description}</MutedText>
      </header>
      <section className="flex flex-col gap-4 bg-white/5 rounded-lg p-8 mb-8">
        {contractAddress && (
          <div className="flex flex-col gap-2">
            <span>Contract Address</span>
            <MutedText>{contractAddress}</MutedText>
          </div>
        )}
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
    </article>
  );
}
