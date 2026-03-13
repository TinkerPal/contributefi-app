import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { createWallet } from "@/services";
import { useMutation } from "@tanstack/react-query";
import { useWallet } from "@/hooks/useWallet";

function CreateWallet() {
  const { username } = useAuth();
  const navigate = useNavigate();
  const { setPublicKey, setNetwork } = useWallet();
  const network = "TESTNET";

  const { mutate: createWalletMutation } = useMutation({
    mutationFn: () => createWallet(network),
    onSuccess: async (data) => {
      console.log("Create wallet response:", data);
      if (data.status === 200) {
        const { publicKey } = data.data.content;

        setPublicKey(publicKey);
        setNetwork({
          network,
          networkPassphrase: "Test SDF Network ; September 2015",
        });

        toast.success("Wallet created successfully");
        navigate("/get-started/wallet-created-success");
      } else {
        toast.error("Something went wrong");
      }
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message || "Failed to create wallet";
      console.error("Error:", message);
      toast.error(message);
    },
  });

  useEffect(() => {
    if (username) {
      createWalletMutation();
    }
  }, [username, createWalletMutation]);

  useEffect(() => {
    if (!username) {
      navigate("/get-started/username");
    }
  }, [navigate, username]);

  return (
    <div>
      <div className="mb-8 space-y-[8px]">
        <h2 className="text-[24px] font-bold text-[#09032A] md:text-[28px]">
          Create Wallet
        </h2>
        <p className="text-base font-light text-[#525866] md:text-[18px]">
          Please wait while we generate a wallet for you
        </p>
      </div>

      <div className="space-y-[32px]">
        <div className="flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-[#1082E4]" />
        </div>
      </div>
    </div>
  );
}

export default CreateWallet;
