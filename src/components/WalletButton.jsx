import { useEffect, useRef, useState } from "react";
import { StellarWalletsKit } from "@creit-tech/stellar-wallets-kit/sdk";
import {
  SwkAppDarkTheme,
  KitEventType,
} from "@creit-tech/stellar-wallets-kit/types";
import { defaultModules } from "@creit-tech/stellar-wallets-kit/modules/utils";
import { ButtonMode } from "@creit-tech/stellar-wallets-kit/components";
import { useStellarWallet } from "@/hooks/useStellarWallet";

export default function WalletButton() {
  const { address, isReady, getAddress, wrapperRef } = useStellarWallet();
  // const wrapperRef = useRef(null);
  // const [address, setAddress] = useState(null);

  // useEffect(() => {
  //   StellarWalletsKit.init({
  //     theme: SwkAppDarkTheme,
  //     modules: defaultModules(),
  //   });

  //   if (wrapperRef.current) {
  //     StellarWalletsKit.createButton(wrapperRef.current, {
  //       mode: ButtonMode.free,
  //       classes: "custom-wallet-btn",
  //     });
  //   }

  //   const sub1 = StellarWalletsKit.on(KitEventType.STATE_UPDATED, (event) => {
  //     console.log({ event });
  //     setAddress(event?.payload?.address || null);
  //   });

  //   const sub2 = StellarWalletsKit.on(KitEventType.DISCONNECT, (event) => {
  //     console.log({ event });
  //     setAddress(null);
  //   });

  //   return () => {
  //     sub1();
  //     sub2();
  //   };
  // }, []);

  return (
    <div>
      <div ref={wrapperRef} />
      {/* {address && (
        <p className="mt-2 text-sm text-gray-500">
          Connected: {address.slice(0, 4)}...{address.slice(-4)}
        </p>
      )} */}
    </div>
  );
}
