import { MutedText, ArticleTitle } from "./ui/Typography";
import { ExternalLinkIcon } from "./icons/ExternalIcon";

export function SuccessMessage({
  transactionHash,
  onClose,
}: {
  transactionHash: string;
  onClose?: () => void;
}) {
  const explorerUrl = `http://mintscan.io/xion-testnet/tx/${transactionHash}`;
  return (
    <section className="flex flex-col gap-4 bg-white/5 rounded-lg p-8 mb-8 relative">
      {onClose && (
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-white text-xl font-bold"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
      )}
      <ArticleTitle>Success!</ArticleTitle>
      <p>You have successfully completed the transaction.</p>
      <div className="flex justify-end gap-2 w-full">
        <a
          href={explorerUrl}
          className=" hover:border-white/40 hover:border-b"
          target="_blank"
          rel="noopener noreferrer"
        >
          <MutedText className="flex items-center gap-2">
            View transaction on explorer.
            <ExternalLinkIcon className="inline-block" />
          </MutedText>
        </a>
      </div>
    </section>
  );
}
