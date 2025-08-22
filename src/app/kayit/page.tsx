"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // Token kontrolü
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      router.push('/rol-sec');
    }
  }, [router]);

  // Eğer kullanıcı giriş yapmışsa ve yönlendirme bekleniyorsa boş sayfa göster
  if (isAuthenticated) {
    return null;
  }

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert("Şifreler eşleşmiyor!");
      return;
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          phone: formData.phone.startsWith('+90') ? formData.phone : `+90${formData.phone.replace(/\D/g, '')}`,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        alert('Kayıt başarılı!');
        router.push('/rol-sec');
      } else {
        const error = await response.json();
        alert(error.error || 'Kayıt sırasında bir hata oluştu');
      }
    } catch (error) {
      console.error('Kayıt hatası:', error);
      alert('Bir hata oluştu');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-center text-[#0A2540] mb-8">
            Hesap Oluştur
          </h1>

          <div className="bg-white p-8 rounded-xl shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    Ad *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFC107] focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Soyad *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFC107] focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  E-posta *
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
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Telefon *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-2 text-gray-500">+90</span>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFC107] focus:border-transparent"
                    placeholder="5XX XXX XX XX"
                    required
                    pattern="^\+?90?[0-9]{10}$"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Şifre *
                </label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFC107] focus:border-transparent"
                  required
                  minLength={6}
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Şifre Tekrar *
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFC107] focus:border-transparent"
                  required
                  minLength={6}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#FFC107] text-[#0A2540] py-3 rounded-lg font-medium hover:bg-[#FFB000] transition-colors"
              >
                Kayıt Ol
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Zaten hesabınız var mı?{" "}
                <Link href="/giris" className="text-[#FFC107] hover:underline font-medium">
                  Giriş yapın
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}