import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Bir El | Yardımlaşma Platformu",
  description:
    "Gündelik, karmaşık veya seni zorlayan görevler için artık yanındayız. Görev ver, sistem senin yerine halletsin.",
  keywords: [
    "yardımlaşma",
    "görev",
    "destek",
    "sosyal sorumluluk",
    "topluluk",
    "yardım platformu",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={inter.variable}>
      <body className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 animate-fade-in">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
