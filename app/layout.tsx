import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Web3Provider } from "./provider";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import AppShell from "../components/app-shell";
export const metadata: Metadata = {
  title: "XtraCarbon",
  description: "Created with XtraFusion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ClerkProvider>
        <Web3Provider>
          <body
            className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}
          >
            <AppShell>{children}</AppShell>
            <Analytics />
          </body>
        </Web3Provider>
      </ClerkProvider>
    </html>
  );
}
