"use client"

import { useAccount, useConnect, useDisconnect } from "wagmi"
import { Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ConnectKitButton } from "connectkit"

export default function WalletConnectPage() {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()

  // Log the connected address
  if (isConnected && address) {
    console.log("Connected wallet address:", address)
  }

  return (
    <main className="min-h-dvh" style={{ backgroundColor: "#F3F4F6", color: "#111827" }}>
      <section className="mx-auto max-w-4xl px-4 py-10">
        <Card style={{ backgroundColor: "#F3F4F6", border: "1px solid rgba(17,24,39,0.15)" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-[#059669]" />
              <ConnectKitButton/>
              Blockchain Wallet Connection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {isConnected ? (
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-[#059669]">
                  ✅ Connected
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  Wallet Address: <span className="font-mono">{address}</span>
                </p>
                <Button onClick={() => disconnect()} className="mt-4 bg-red-500 hover:bg-red-600 text-white">
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button
                // onClick={() => connect()}
                className="rounded-xl bg-[#FACC15] hover:bg-[#eab308] text-[#111827] font-medium shadow"
              >
                Connect MetaMask
              </Button>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
