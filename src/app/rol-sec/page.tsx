"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";

// Cookie yardımcı fonksiyonları
const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

const setCookie = (name: string, value: string, maxAge: number) => {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}`;
};

export default function RoleSelectionPage() {
  const router = useRouter();
  const { isAuthenticated, hasSelectedInitialRole, setRole, setHasSelectedInitialRole } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Token kontrolü
    const token = getCookie('token');
    if (!token) {
      window.location.href = '/giris';
      return;
    }

    // Daha önce rol seçimi yapılmışsa dashboard'a yönlendir
    const hasSelectedRole = getCookie('hasSelectedInitialRole') === 'true';
    if (hasSelectedRole) {
      const selectedRole = getCookie('selectedRole');
      if (selectedRole) {
        window.location.href = `/dashboard/${selectedRole}`;
      }
    }

    setIsLoading(false);
  }, []);

  const handleRoleSelect = (role: 'gorevveren' | 'gorevli') => {
    // Cookie'leri ayarla
    const maxAge = 7 * 24 * 60 * 60; // 7 gün
    setCookie('selectedRole', role, maxAge);
    setCookie('hasSelectedInitialRole', 'true', maxAge);
    
    // Store'u güncelle
    setRole(role);
    setHasSelectedInitialRole(true);
    
    // Yönlendir
    window.location.href = `/dashboard/${role}`;
  };

  // Yükleme durumunda veya token/rol seçimi durumunda boş sayfa göster
  if (isLoading || !getCookie('token') || getCookie('hasSelectedInitialRole') === 'true') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-center text-[#0A2540] mb-8">
            Nasıl devam etmek istersiniz?
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Görev Veren */}
            <button
              onClick={() => handleRoleSelect('gorevveren')}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border-2 border-transparent hover:border-[#FFC107] group"
            >
              <div className="text-4xl mb-4">👋</div>
              <h2 className="text-xl font-semibold text-[#0A2540] mb-2 group-hover:text-[#FFC107]">
                Görev Veren
              </h2>
              <p className="text-gray-600">
                Yardıma ihtiyacınız olan konularda görev oluşturun ve gönüllülerle eşleşin.
              </p>
            </button>

            {/* Görevli */}
            <button
              onClick={() => handleRoleSelect('gorevli')}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border-2 border-transparent hover:border-[#FFC107] group"
            >
              <div className="text-4xl mb-4">🤝</div>
              <h2 className="text-xl font-semibold text-[#0A2540] mb-2 group-hover:text-[#FFC107]">
                Görevli
              </h2>
              <p className="text-gray-600">
                Size uygun görevlere başvurun ve yardıma ihtiyacı olanlara destek olun.
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}