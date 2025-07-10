import { useEffect, useState } from "react";

interface NFTViewProps {
  tokenUri: string;
}

interface NFTJson {
  image: string;
  name?: string;
  description?: string;
}

export function NFTView({ tokenUri }: NFTViewProps) {
  const [nftData, setNftData] = useState<NFTJson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setNftData(null);
    fetch(tokenUri)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch NFT metadata");
        return res.json();
      })
      .then((json) => {
        if (!cancelled) setNftData(json);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [tokenUri]);

  if (loading) return <div className="text-sm text-gray-400">Loading NFT...</div>;
  if (error) return <div className="text-sm text-red-500">Error: {error}</div>;
  if (!nftData) return null;

  return (
    <div className="flex flex-col items-center gap-2">
      {nftData.image && (
        <img
          src={nftData.image}
          alt={nftData.name || "NFT image"}
          className="w-80 h-80 object-cover rounded-lg border border-gray-700"
        />
      )}
      {nftData.name && <div className="font-semibold text-base">{nftData.name}</div>}
      {nftData.description && <div className="text-xs text-gray-400 text-center max-w-xs">{nftData.description}</div>}
    </div>
  );
} 