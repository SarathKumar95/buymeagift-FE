import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Buy Me A Random Gift",
  description: "You pick the budget. We pick the surprise.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
