import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "HomeOfferDirect — Make a Home Offer Without a Realtor",
  description:
    "Create a professional, state-compliant home purchase offer in minutes. AI-guided, plain English, no agent needed. Save thousands in commissions.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
