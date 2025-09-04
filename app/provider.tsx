"use client"
import { WagmiProvider, createConfig, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";

// Custom Ganache chain
const ganache = {
  id: 5777, // or 5777 depending on your Ganache
  name: "Ganache Local",
  network: "ganache",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["http://127.0.0.1:7545"] },
    public: { http: ["http://127.0.0.1:7545"] },
  },
};

const config = createConfig(
  getDefaultConfig({
    chains: [ganache],
    transports: {
      [ganache.id]: http("http://127.0.0.1:7545"),
    },
    walletConnectProjectId: "demo", // can be any string for local
    appName: "Carbon Tracker Local",
    appDescription: "Prototype on Ganache",
    appUrl: "http://localhost:3000",
    appIcon: "/favicon.ico",
  })
);

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: any) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
