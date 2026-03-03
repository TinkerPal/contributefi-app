import { useEffect, useState, useCallback, useRef } from "react";
import { StellarWalletsKit } from "@creit-tech/stellar-wallets-kit/sdk";
import { defaultModules } from "@creit-tech/stellar-wallets-kit/modules/utils";
import {
  KitEventType,
  SwkAppDarkTheme,
} from "@creit-tech/stellar-wallets-kit/types";
import { ButtonMode } from "@creit-tech/stellar-wallets-kit/components";

export const useStellarWallet = () => {
  const wrapperRef = useRef(null);
  const [address, setAddress] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    StellarWalletsKit.init({
      theme: SwkAppDarkTheme,
      modules: defaultModules(),
    });

    if (wrapperRef.current) {
      StellarWalletsKit.createButton(wrapperRef.current, {
        mode: ButtonMode.free,
        classes: "custom-wallet-btn",
      });
    }

    const sub1 = StellarWalletsKit.on(KitEventType.STATE_UPDATED, (event) => {
      console.log({ event });
      setAddress(event?.payload?.address || null);
    });

    const sub2 = StellarWalletsKit.on(KitEventType.DISCONNECT, (event) => {
      console.log({ event });
      setAddress(null);
    });

    return () => {
      sub1();
      sub2();
    };
  }, []);

  // useEffect(() => {
  //   StellarWalletsKit.init({
  //     modules: defaultModules(),
  //   });
  //   setIsReady(true);

  //   const sub1 = StellarWalletsKit.on(KitEventType.STATE_UPDATED, (event) => {
  //     setAddress(event?.payload?.address || null);
  //   });

  //   const sub2 = StellarWalletsKit.on(KitEventType.DISCONNECT, () => {
  //     setAddress(null);
  //   });

  //   return () => {
  //     sub1();
  //     sub2();
  //   };
  // }, []);

  const connectWallet = useCallback(async () => {
    if (!wrapperRef.current) return null;

    // simulate click on the created wallet button
    const button = wrapperRef.current.querySelector("button");
    button?.click();

    // wait for connection event
    return new Promise((resolve) => {
      const unsub = StellarWalletsKit.on(
        KitEventType.STATE_UPDATED,
        (event) => {
          const addr = event?.payload?.address;
          if (addr) {
            setAddress(addr);
            unsub();
            resolve(addr);
          }
        },
      );
    });
  }, []);

  const getAddress = useCallback(async () => {
    const { address } = await StellarWalletsKit.getAddress();
    setAddress(address);
    return address;
  }, []);

  return { address, isReady, getAddress, wrapperRef, connectWallet };
};
