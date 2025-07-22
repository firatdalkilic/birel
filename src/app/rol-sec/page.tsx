"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaHandHolding, FaTasks } from 'react-icons/fa';

export default function RoleSelection() {
  const router = useRouter();

  useEffect(() => {
    // Token kontrolü
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/giris');
      return;
    }
  }, [router]);

  const handleRoleSelect = async (role: 'gorevli' | 'gorevveren') => {
    try {
      const res = await fetch('/api/select-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ role }),
      });

      if (!res.ok) {
        throw new Error('Rol seçimi başarısız oldu');
      }

      // Rolü localStorage'a kaydet
      localStorage.setItem('selectedRole', role);
      
      // Kullanıcıyı yönlendir
      router.push(role === 'gorevli' ? '/dashboard/gorevli' : '/dashboard/gorevveren');
    } catch (error) {
      console.error('Rol seçim hatası:', error);
      alert('Rol seçimi sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-4">
            Ne yapmak istersiniz?
          </h1>
          <p className="text-gray-600">
            Bir rol seçin ve başlayın. Bu seçimi daha sonra değiştirebilirsiniz.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => handleRoleSelect('gorevli')}
            className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col items-center gap-4 group"
          >
            <FaHandHolding className="w-16 h-16 text-[#FFC107] group-hover:scale-110 transition-transform" />
            <div className="text-center">
              <h2 className="text-xl font-semibold text-[#0F172A] mb-2">
                Görev Almak İstiyorum
              </h2>
              <p className="text-gray-600">
                Yardıma ihtiyacı olanlara destek olun
              </p>
            </div>
          </button>

          <button
            onClick={() => handleRoleSelect('gorevveren')}
            className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col items-center gap-4 group"
          >
            <FaTasks className="w-16 h-16 text-[#FFC107] group-hover:scale-110 transition-transform" />
            <div className="text-center">
              <h2 className="text-xl font-semibold text-[#0F172A] mb-2">
                Görev Vermek İstiyorum
              </h2>
              <p className="text-gray-600">
                Yardım almak için görev oluşturun
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
} 