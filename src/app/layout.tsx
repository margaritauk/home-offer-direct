import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HomeOfferDirect — Create a Professional Home Offer Without a Realtor",
  description:
    "HomeOfferDirect guides you step-by-step through the entire offer process, explains every decision in plain English, and generates professional state-compliant offer documents instantly. Save thousands in commissions.",
  keywords: [
    "home offer without realtor",
    "buy home no agent",
    "real estate offer letter",
    "purchase agreement generator",
    "FSBO offer",
    "home buying without agent",
    "real estate documents",
  ],
  openGraph: {
    title: "HomeOfferDirect — TurboTax for Home Offers",
    description:
      "Create a professional, legally-compliant home purchase offer in minutes — without a realtor.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
