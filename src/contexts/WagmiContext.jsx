import { createContext } from "react";
import { useConnect, useConnection, useConnectors, useDisconnect } from "wagmi";
import { toast } from "react-toastify";

const WagmiContext = createContext();

const WagmiContextProvider = ({ children }) => {
  const { address, isConnected } = useConnection();

  const {
    connect,
    error: connectError,
    isLoading: connectLoading,
    pendingConnector: connectPending,
  } = useConnect({
    onSuccess() {
      toast.success("Connected.");
    },
  });

  const connectors = useConnectors({});

  const { disconnect } = useDisconnect({
    onSuccess(data) {
      toast.success("Disconnected.", data);
    },
  });

  console.log({ address, isConnected });

  return (
    <WagmiContext.Provider
      value={{
        address,
        isConnected,
        connect,
        connectors,
        connectError,
        connectLoading,
        connectPending,
        disconnect,
      }}
    >
      {children}
    </WagmiContext.Provider>
  );
};

export { WagmiContext, WagmiContextProvider };
