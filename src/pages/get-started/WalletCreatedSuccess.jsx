import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/useWallet";
import { useState } from "react";
import { PiCopyFill } from "react-icons/pi";

function WalletCreatedSuccess() {
  const navigate = useNavigate();
  const { publicKey } = useWallet();
  const [copied, setCopied] = useState(false);

  const formatPublicKey = (key) => {
    if (!key || key.length <= 16) return key;
    return `${key.slice(0, 15)}...${key.slice(-15)}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(publicKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div className="mb-8 space-y-[8px]">
        <h2 className="text-[24px] font-bold text-[#09032A] md:text-[28px]">
          Your Wallet is Ready!
        </h2>
        <p className="text-base font-light text-[#525866] md:text-[18px]">
          Your wallet ID has been created
        </p>
      </div>

      <div className="space-y-[32px]">
        <div className="rounded-lg bg-[#F7F9FD] p-4">
          <p className="mb-2 text-sm font-medium text-[#525866]">
            Wallet Account ID
          </p>
          <div className="flex items-center justify-between rounded-lg border border-[#E5E7EB] bg-white p-3">
            <p className="text-sm font-medium text-[#09032A]">
              {formatPublicKey(publicKey)}
            </p>
            <button
              onClick={handleCopy}
              className="ml-2 flex-shrink-0 text-[#525866] transition-colors hover:text-[#09032A]"
            >
              {copied ? (
                <span className="text-sm font-medium text-green-600">
                  Copied!
                </span>
              ) : (
                <PiCopyFill className="h-5 w-5 text-[#2F0FD1]" />
              )}
            </button>
          </div>
        </div>

        <Button
          className="w-full"
          variant="secondary"
          size="lg"
          onClick={() => navigate("/get-started/account-configuration")}
        >
          Proceed
        </Button>
      </div>
    </div>
  );
}

export default WalletCreatedSuccess;
