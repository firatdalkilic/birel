"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateAuthState } from "@/components/Header";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      console.log('📝 Giriş formu gönderiliyor');
      
      // API çağrısı simülasyonu
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('🔑 Token kaydediliyor');
      localStorage.setItem('token', 'dummy-token');
      
      console.log('🔄 Auth state güncelleniyor');
      updateAuthState();
      
      console.log('🚀 Rol seçimine yönlendiriliyor');
      router.push('/rol-sec');

    } catch (error) {
      console.error('❌ Giriş hatası:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-sm">
          <h1 className="text-2xl font-bold text-center mb-8">Giriş Yap</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                E-posta
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFC107] focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Şifre
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFC107] focus:border-transparent"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#FFC107] text-[#0A2540] py-3 rounded-lg font-medium hover:bg-[#FFB000] transition-colors"
            >
              Giriş Yap
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 