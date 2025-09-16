"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    // İlk yüklemede auth durumunu kontrol et
    checkAuth();
  }, [checkAuth]);

  return <>{children}</>;
}
