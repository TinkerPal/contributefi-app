import { useContext, useEffect } from "react";
import Modal from "./Modal";
import { toast } from "react-toastify";
import { useConnect, useConnectors } from "wagmi";
import { avalancheFuji } from "viem/chains";
import ConnectIcon from "../assets/svg/connect.svg";
import { WalletContext } from "@/contexts/WalletContext";
import { ArrowRight } from "lucide-react";

function WalletsOptions({ isOpen, onClose }) {
  const { connect, error, isLoading, pendingConnector } = useConnect();
  const connectors = useConnectors();

  const { handleConnectStellarKit, selectedSourceChain } =
    useContext(WalletContext);

  useEffect(() => {
    if (error && error.message) {
      toast.error(error.message);
    }
  }, [error]);

  return (
    <Modal open={isOpen} onClose={onClose} heading="Connect to a wallet">
      <div className="space-y-3">
        <button
          onClick={handleConnectStellarKit}
          className="bg-dark-300 hover:bg-opacity-60 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-lg"
        >
          <img
            className="h-12 w-12 rounded-full"
            src="/cryptoIcons/12000000.svg"
            alt=""
          />
          Stellar Wallet Kit
          <ArrowRight size="20" className="ml-auto" />
        </button>
        {connectors.map((connector) => (
          <button
            key={connector.id}
            onClick={() => {
              connect({
                chainId: selectedSourceChain?.id || avalancheFuji.id,
                connector,
              });
            }}
            className="bg-dark-300 hover:bg-opacity-60 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-lg"
          >
            {connector.name === "WalletConnect" ? (
              <ConnectIcon className="h-12 w-12" />
            ) : (
              <img
                className="h-12 w-12 border-2 rounded-full"
                src={connector.icon}
                alt=""
              />
            )}
            {connector.name}

            {isLoading &&
              connector.id === pendingConnector?.id &&
              " (connecting)"}

            <ArrowRight size="20" className="ml-auto" />
          </button>
        ))}
      </div>
    </Modal>
  );
}

export default WalletsOptions;
