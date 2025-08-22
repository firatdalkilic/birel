"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { FaUserCircle } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import RolSecici from "./RolSecici";

export default function Header() {
  const router = useRouter();
  const { isAuthenticated, checkAuth, logout } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="py-4 bg-white shadow-sm">
      <div className="container-custom">
        <nav className="flex items-center justify-between">
          <a href="/" className="text-2xl font-bold text-[#0A2540]">
            Bir El
          </a>

          <div className="flex items-center gap-6">
            {!isAuthenticated ? (
              <>
                <a href="/" className="text-gray-600 hover:text-gray-900">
                  Ana Sayfa
                </a>
                <a href="/giris" className="text-gray-600 hover:text-gray-900">
                  Giriş Yap
                </a>
                <a
                  href="/kayit"
                  className="bg-[#FFC107] text-[#0A2540] px-4 py-2 rounded-lg font-medium hover:bg-[#FFB000] transition-colors"
                >
                  Kayıt Ol
                </a>
              </>
            ) : (
              <>
                <a 
                  href="/profil" 
                  className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
                >
                  <FaUserCircle className="text-lg" />
                  <span className="hidden sm:inline">Profilim</span>
                </a>
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