import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
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

  useEffect(() => {
    if (!username) {
      navigate("/get-started/username");
    }
  }, [navigate, username]);

  const { mutate: createWalletMutation, isPending: creatingWallet } =
    useMutation({
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
          navigate("/get-started/account-configuration");
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

  const handleCreateWallet = () => {
    createWalletMutation();
  };

  return (
    <div>
      <div className="mb-8 space-y-[8px]">
        <h2 className="text-[24px] font-bold text-[#09032A] md:text-[28px]">
          Create Wallet
        </h2>
        <p className="text-base font-light text-[#525866] md:text-[18px]">
          Create a Stellar wallet to receive payments
        </p>
      </div>

      <div className="space-y-[32px]">
        <Button
          className="w-full"
          variant="secondary"
          size="lg"
          onClick={handleCreateWallet}
          disabled={creatingWallet}
        >
          {creatingWallet ? "Creating Wallet..." : "Create Wallet"}
        </Button>
      </div>
    </div>
  );
}

export default CreateWallet;
