import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shëngjin Stay",
  description: "Premium coastal apartments in Shëngjin, Albania",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
