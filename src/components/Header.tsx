"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

export default function Header() {
  const { isAuthenticated, selectedRole, checkAuth, logout } = useAuthStore();

  useEffect(() => {
    // Client-side'da auth durumunu kontrol et
    if (typeof window !== 'undefined') {
      checkAuth();
    }
  }, [checkAuth]);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  // Server-side rendering sırasında auth durumunu gösterme
  if (typeof window === 'undefined') {
    return null;
  }

  return (
    <header className="py-4 bg-white shadow-sm">
      <div className="container-custom">
        <nav className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-[#0A2540]">
            Bir El
          </Link>

          <div className="flex items-center gap-6">
            {!isAuthenticated ? (
              // Giriş yapmamış kullanıcılar için
              <>
                <Link href="/" className="text-gray-600 hover:text-gray-900">
                  Ana Sayfa
                </Link>
                <Link href="/giris" className="text-gray-600 hover:text-gray-900">
                  Giriş Yap
                </Link>
                <Link
                  href="/kayit"
                  className="bg-[#FFC107] text-[#0A2540] px-4 py-2 rounded-lg font-medium hover:bg-[#FFB000] transition-colors"
                >
                  Kayıt Ol
                </Link>
              </>
            ) : (
              // Giriş yapmış kullanıcılar için
              <>
                <Link 
                  href={selectedRole === 'gorevveren' ? '/dashboard/gorevveren' : '/dashboard/gorevli'} 
                  className="text-gray-600 hover:text-gray-900"
                >
                  Görevlerim
                </Link>
                <Link href="/profil" className="text-gray-600 hover:text-gray-900">
                  Profilim
                </Link>
                <Link href="/rol-sec" className="text-gray-600 hover:text-gray-900">
                  Rol Değiştir
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700"
                >
                  Çıkış Yap
                </button>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
} 