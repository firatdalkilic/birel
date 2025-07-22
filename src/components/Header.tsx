"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

// Auth durumunu global olarak dinlemek için custom event
const AUTH_CHANGE_EVENT = 'authStateChanged';

// Auth durumunu güncellemek için global fonksiyon
export const updateAuthState = () => {
  console.log('🔄 updateAuthState çağrıldı');
  const event = new CustomEvent(AUTH_CHANGE_EVENT);
  window.dispatchEvent(event);
};

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const pathname = usePathname();

  const checkAuthState = () => {
    console.log('🔍 checkAuthState çağrıldı');
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('selectedRole');
    console.log('📊 Mevcut durum:', { token, role });

    if (token) {
      console.log('✅ Token bulundu, auth true yapılıyor');
      setIsAuthenticated(true);
      setSelectedRole(role);
    } else {
      console.log('❌ Token bulunamadı, auth false yapılıyor');
      setIsAuthenticated(false);
      setSelectedRole(null);
    }
  };

  useEffect(() => {
    console.log('🎬 Header useEffect çalıştı');
    
    // İlk yüklemede kontrol et
    checkAuthState();

    // Auth değişikliklerini dinle
    const handleAuthChange = () => {
      console.log('👂 Auth change event alındı');
      checkAuthState();
    };

    window.addEventListener(AUTH_CHANGE_EVENT, handleAuthChange);

    return () => {
      console.log('🔚 Header cleanup çalıştı');
      window.removeEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
    };
  }, []);

  console.log('🎨 Header render:', { isAuthenticated, selectedRole });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('selectedRole');
    updateAuthState();
    window.location.href = '/';
  };

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