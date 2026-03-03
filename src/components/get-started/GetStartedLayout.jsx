import { WalletContext } from "@/contexts/WalletContext";
import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";

import WalletKitModal from "@/utils/wallet-kit/WalletKitModal";
import ScrollToTop from "../ScrollToTop";
import { useAuth } from "@/hooks/useAuth";
import Loader from "../Loader";

function GetStartedLayout() {
  // const { isWalletOptionsOpen, setIsWalletOptionsOpen } =
  //   useContext(WalletContext);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [navigate, isAuthenticated]);

  if (isAuthenticated) return <Loader />;
  return (
    <>
      <ScrollToTop />
      <div className="flex min-h-screen items-center justify-center bg-[#F7F9FD] px-4 text-center">
        <div className="scrollbar-hidden relative mx-auto max-h-[calc(100vh-100px)] w-full max-w-[560px] space-y-[40px] overflow-scroll rounded-[12px] border-2 border-[#F0F4FD] bg-white p-10">
          <h1 className="text-[32px] font-extrabold text-[#2F0FD1]">CF</h1>
          <Outlet />
        </div>

        <WalletKitModal />
      </div>
    </>
  );
}

export default GetStartedLayout;
