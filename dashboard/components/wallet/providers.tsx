"use client";

import { useMemo } from "react";
import { AppProvider } from "@solana/connector/react";
import { getDefaultConfig, getDefaultMobileConfig } from "@solana/connector/headless";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  const connectorConfig = useMemo(() => {
    return getDefaultConfig({
      appName: "CruPay",
      appUrl: "https://solpay.local",
      autoConnect: true,
      enableMobile: true,
      clusters: [
        {
          id: "solana:devnet" as const,
          label: "Devnet",
          url: "https://api.devnet.solana.com",
        },
        {
          id: "solana:mainnet" as const,
          label: "Mainnet",
          url: "https://api.mainnet-beta.solana.com",
        },
      ],
    });
  }, []);

  const mobile = useMemo(
    () =>
      getDefaultMobileConfig({
        appName: "CruPay",
        appUrl: "https://solpay.local",
      }),
    []
  );

  return (
    <AppProvider connectorConfig={connectorConfig} mobile={mobile}>
      {children}
      <Toaster position="top-right" />
    </AppProvider>
  );
}
