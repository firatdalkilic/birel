"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

export default function RoleSelectionPage() {
  const router = useRouter();
  const { isAuthenticated, hasSelectedInitialRole, setRole, setHasSelectedInitialRole } = useAuthStore();

  useEffect(() => {
    // Giriş yapmamış kullanıcıları yönlendir
    if (!isAuthenticated) {
      router.push('/giris');
      return;
    }

    // Daha önce rol seçimi yapılmışsa dashboard'a yönlendir
    if (hasSelectedInitialRole) {
      const selectedRole = localStorage.getItem('selectedRole');
      if (selectedRole) {
        router.push(`/dashboard/${selectedRole}`);
      }
    }
  }, [isAuthenticated, hasSelectedInitialRole, router]);

  const handleRoleSelect = async (role: 'gorevveren' | 'gorevli') => {
    try {
      // Cookie'leri ayarla
      document.cookie = `selectedRole=${role}; path=/; max-age=${7 * 24 * 60 * 60}`;
      document.cookie = `hasSelectedInitialRole=true; path=/; max-age=${7 * 24 * 60 * 60}`;
      
      // Store'u güncelle
      setRole(role);
      setHasSelectedInitialRole(true);
      
      // Yönlendir
      router.push(`/dashboard/${role}`);
    } catch (error) {
      console.error('Rol seçimi hatası:', error);
    }
  };

  if (!isAuthenticated || hasSelectedInitialRole) {
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