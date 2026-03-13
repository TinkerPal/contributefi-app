import { useDispatch, useSelector } from "react-redux";
import {
  setPublicKey,
  setNetwork,
  setStellarWalletKitIsOpen,
  clearWallet,
  setWalletLoading,
} from "@/store/walletSlice";

export const useWallet = () => {
  const dispatch = useDispatch();

  const publicKey = useSelector((state) => state.wallet.publicKey);
  const network = useSelector((state) => state.wallet.network);
  const stellarWalletKitIsOpen = useSelector(
    (state) => state.wallet.stellarWalletKitIsOpen,
  );
  const isLoading = useSelector((state) => state.wallet.isLoading);

  const handleOpenStellarWalletKitModal = () => {
    dispatch(setStellarWalletKitIsOpen(true));
  };

  const handleCloseStellarWalletKitModal = () => {
    dispatch(setStellarWalletKitIsOpen(false));
  };

  return {
    publicKey,
    setPublicKey: (value) => dispatch(setPublicKey(value)),
    network,
    setNetwork: (value) => dispatch(setNetwork(value)),
    stellarWalletKitIsOpen,
    setStellarWalletKitIsOpen: (value) =>
      dispatch(setStellarWalletKitIsOpen(value)),
    isLoading,
    setWalletLoading: (value) => dispatch(setWalletLoading(value)),
    handleOpenStellarWalletKitModal,
    handleCloseStellarWalletKitModal,
    clearWallet: () => dispatch(clearWallet()),
  };
};
