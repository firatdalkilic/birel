"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

export default function RoleSelectionPage() {
  const router = useRouter();
  const { isAuthenticated, hasSelectedInitialRole, setRole, setHasSelectedInitialRole } = useAuthStore();

  useEffect(() => {
    // Cookie kontrolü
    const token = document.cookie.includes('token=');
    if (!token) {
      window.location.href = '/giris';
      return;
    }

    // Daha önce rol seçimi yapılmışsa dashboard'a yönlendir
    const hasSelectedRole = document.cookie.includes('hasSelectedInitialRole=true');
    if (hasSelectedRole) {
      const selectedRoleCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('selectedRole='));
      const selectedRole = selectedRoleCookie ? selectedRoleCookie.split('=')[1] : null;
      
      if (selectedRole) {
        window.location.href = `/dashboard/${selectedRole}`;
      }
    }
  }, []);

  const handleRoleSelect = (role: 'gorevveren' | 'gorevli') => {
    // Cookie'leri ayarla
    const maxAge = 7 * 24 * 60 * 60; // 7 gün
    document.cookie = `selectedRole=${role}; path=/; max-age=${maxAge}`;
    document.cookie = `hasSelectedInitialRole=true; path=/; max-age=${maxAge}`;
    
    // Store'u güncelle
    setRole(role);
    setHasSelectedInitialRole(true);
    
    // Yönlendir
    window.location.href = `/dashboard/${role}`;
  };

  // Token yoksa veya rol seçilmişse sayfa gösterme
  const token = document.cookie.includes('token=');
  const hasSelectedRole = document.cookie.includes('hasSelectedInitialRole=true');
  
  if (!token || hasSelectedRole) {
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