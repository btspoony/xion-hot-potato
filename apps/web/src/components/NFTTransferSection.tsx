import { useState } from "react";
import { BaseButton } from "./ui/BaseButton";
import { useAbstraxionSigningClient } from "@burnt-labs/abstraxion";
import { useTransferPotatoNFTTransaction } from "../hooks/useTransferPotatoNFTTransaction";

interface NFTTransferSectionProps {
  userAddress: string;
  contractAddress: string;
  disabled?: boolean;
  onSuccess: (txHash: string) => void;
  onError: (err: Error) => void;
}

export function NFTTransferSection({
  userAddress,
  contractAddress,
  disabled,
  onSuccess,
  onError,
}: NFTTransferSectionProps) {
  const [recipient, setRecipient] = useState("");
  const { client } = useAbstraxionSigningClient();
  const transferMutation = useTransferPotatoNFTTransaction({
    onSuccess: (tx) => {
      onSuccess(tx.transactionHash);
    },
    onError,
  });

  const handleTransfer = () => {
    if (!client || !userAddress || !recipient) return;
    transferMutation.mutate({
      senderAddress: userAddress,
      contractAddress,
      recipient,
      client,
    });
  };

  return (
    <div className="w-full flex flex-col gap-2 items-center">
      <input
        type="text"
        className="w-full rounded border border-gray-600 bg-black/30 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
        placeholder="Recipient address"
        value={recipient}
        onChange={e => setRecipient(e.target.value)}
        disabled={transferMutation.isPending || disabled}
      />
      <BaseButton
        onClick={handleTransfer}
        disabled={transferMutation.isPending || !recipient || disabled}
        className="w-full"
      >
        {transferMutation.isPending ? "Transferring..." : "Transfer NFT"}
      </BaseButton>
    </div>
  );
} 