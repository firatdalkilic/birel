"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    // İlk yüklemede auth durumunu kontrol et
    checkAuth();
  }, [checkAuth]);

  return (
    <html lang="tr">
      <body className={inter.className}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
