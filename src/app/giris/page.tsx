"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/components/ToastProvider";

export default function LoginPage() {
  const router = useRouter();
  const { setAuth, setUser } = useAuthStore();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      console.log('Giriş denemesi:', { email: formData.email });
      
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include', // Cookie'leri almak için önemli
      });

      const data = await response.json();
      console.log('Giriş yanıtı:', { success: response.ok, status: response.status });

      if (!response.ok) {
        throw new Error(data.error || 'Giriş sırasında bir hata oluştu');
      }
      
      // Token'ı kaydet
      localStorage.setItem('token', data.token);
      
      // Kullanıcı bilgilerini kaydet
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Auth state'i güncelle
      setAuth(true);
      setUser(data.user);
      
      // Başarı toast'ı
      showToast(`Hoş geldiniz, ${data.user.firstName}!`, 'success');
      
      // Rol seçimine yönlendir
      router.push('/rol-sec');

    } catch (error: any) {
      console.error('Giriş hatası:', error);
      const errorMessage = error.message || 'Giriş yapılırken bir hata oluştu';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-sm">
          <h1 className="text-2xl font-bold text-center mb-8">Giriş Yap</h1>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
              {error}
            </div>
          )}

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
              disabled={isLoading}
              className={`w-full flex justify-center py-3 rounded-lg font-medium transition-colors
                ${isLoading 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#FFC107] text-[#0A2540] hover:bg-[#FFB000]'
                }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#0A2540]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Giriş yapılıyor...
                </>
              ) : 'Giriş Yap'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Hesabınız yok mu?
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link 
                href="/kayit"
                className="font-medium text-[#FFC107] hover:text-[#FFB000]"
              >
                Hemen ücretsiz hesap oluşturun
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}