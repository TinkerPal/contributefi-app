import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  publicKey: "",
  network: "",
  stellarWalletKitIsOpen: false,
  isLoading: false,
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setPublicKey: (state, action) => {
      state.publicKey = action.payload;
    },
    setNetwork: (state, action) => {
      state.network = action.payload;
    },
    setStellarWalletKitIsOpen: (state, action) => {
      state.stellarWalletKitIsOpen = action.payload;
    },
    clearWallet: (state) => {
      state.publicKey = "";
      state.network = "";
    },
    setWalletLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setPublicKey,
  setNetwork,
  setStellarWalletKitIsOpen,
  clearWallet,
  setWalletLoading,
} = walletSlice.actions;

export default walletSlice.reducer;
