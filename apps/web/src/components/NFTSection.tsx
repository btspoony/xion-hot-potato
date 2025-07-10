import { ArticleTitle, MutedText } from "./ui/Typography";
import { BaseButton } from "./ui/BaseButton";
import { NFTView } from "./NFTView";
import { NFT_TOKEN_URI, PRE_DEPLOYED_NFT_CONTRACT_ADDRESS } from "../config/constants";

interface NFTSectionProps {
  isMintPending?: boolean;
  onMint?: () => void;
  potatoStatus?: { minted: boolean; owner?: string; isOwner?: boolean };
  isPotatoLoading?: boolean;
}

export function NFTSection({
  isMintPending,
  onMint,
  potatoStatus,
  isPotatoLoading,
}: NFTSectionProps) {
  const title = "🥔 Hot Potato NFT";
  const description = `This is a pre-deployed NFT contract because we need to ensure permission in Treasury being granted. (Address: ${PRE_DEPLOYED_NFT_CONTRACT_ADDRESS})`;
  return (
    <article className="w-full mx-auto">
      <header className="mb-4">
        <ArticleTitle>{title}</ArticleTitle>
        <MutedText>{description}</MutedText>
      </header>

      <section className="flex flex-col gap-4 bg-white/5 rounded-lg p-8 mb-8">
      <NFTView tokenUri={NFT_TOKEN_URI} />
        {isPotatoLoading ? (
          <MutedText>Loading NFT status...</MutedText>
        ) : potatoStatus?.minted ? (
          <div className="flex w-full justify-center gap-2">
            {potatoStatus && potatoStatus.minted && potatoStatus.isOwner ? (
              <span className="text-green-500 font-semibold">Owned by you</span>
            ) : (
              <span className="text-yellow-500 font-semibold">Owned by others</span>
            )}
          </div>
        ) : (
          <BaseButton
            onClick={onMint}
            disabled={isMintPending}
            className="w-full"
          >
            {isMintPending ? "Minting..." : "Mint Potato NFT"}
          </BaseButton>
        )}
      </section>
    </article>
  );
} 