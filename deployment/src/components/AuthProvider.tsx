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
    // Cache temizle ve auth kontrolü yapma
    localStorage.clear();
    // checkAuth(); // Devre dışı bırakıldı
  }, []);

  return <>{children}</>;
}
