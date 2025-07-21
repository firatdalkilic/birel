import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bir El | Yardımlaşma Platformu",
  description: "Gündelik görevleriniz için yardım platformu",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={inter.className}>
      <body className="min-h-screen bg-background">
        {children}
      </body>
    </html>
  );
}
