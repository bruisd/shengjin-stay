import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shëngjin Stay",
  description: "Premium coastal apartments in Shëngjin, Albania",
  icons: {
    icon: "/shengjinLogo_golden.png",
    apple: "/shengjinLogo_golden.png",
  },
  verification: {
    google: "-ymB-nTfnXFSxTgVC2AkEV6xHVQ9K_cZS6YcwxfNStk",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
