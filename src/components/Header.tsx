"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { FaTasks, FaUserCircle } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import RolSecici from "./RolSecici";

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

  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    window.location.href = path;
  };

  // Server-side rendering sırasında auth durumunu gösterme
  if (typeof window === 'undefined') {
    return null;
  }

  return (
    <header className="py-4 bg-white shadow-sm">
      <div className="container-custom">
        <nav className="flex items-center justify-between">
          <Link 
            href="/" 
            className="text-2xl font-bold text-[#0A2540]"
            onClick={(e) => handleNavigation(e, '/')}
          >
            Bir El
          </Link>

          <div className="flex items-center gap-6">
            {!isAuthenticated ? (
              // Giriş yapmamış kullanıcılar için
              <>
                <Link 
                  href="/" 
                  className="text-gray-600 hover:text-gray-900"
                  onClick={(e) => handleNavigation(e, '/')}
                >
                  Ana Sayfa
                </Link>
                <Link 
                  href="/giris" 
                  className="text-gray-600 hover:text-gray-900"
                  onClick={(e) => handleNavigation(e, '/giris')}
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/kayit"
                  className="bg-[#FFC107] text-[#0A2540] px-4 py-2 rounded-lg font-medium hover:bg-[#FFB000] transition-colors"
                  onClick={(e) => handleNavigation(e, '/kayit')}
                >
                  Kayıt Ol
                </Link>
              </>
            ) : (
              // Giriş yapmış kullanıcılar için
              <>
                <Link 
                  href={selectedRole === 'gorevveren' ? '/dashboard/gorevveren' : '/dashboard/gorevli'} 
                  className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
                  onClick={(e) => handleNavigation(e, selectedRole === 'gorevveren' ? '/dashboard/gorevveren' : '/dashboard/gorevli')}
                >
                  <FaTasks className="text-lg" />
                  <span className="hidden sm:inline">Görevlerim</span>
                </Link>
                <Link 
                  href="/profil" 
                  className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
                  onClick={(e) => handleNavigation(e, '/profil')}
                >
                  <FaUserCircle className="text-lg" />
                  <span className="hidden sm:inline">Profilim</span>
                </Link>
                <RolSecici />
                <button
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 flex items-center gap-2"
                >
                  <IoLogOutOutline className="text-lg" />
                  <span className="hidden sm:inline">Çıkış Yap</span>
                </button>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}