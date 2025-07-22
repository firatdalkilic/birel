"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  useEffect(() => {
    // Token kontrolü
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      const role = localStorage.getItem('selectedRole');
      setSelectedRole(role);
    }
  }, []);

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
                  Dashboard
                </Link>
                <Link href="/profil" className="text-gray-600 hover:text-gray-900">
                  Profil
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('selectedRole');
                    window.location.href = '/';
                  }}
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