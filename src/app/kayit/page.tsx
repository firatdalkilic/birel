"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";

interface FormError {
  field: string;
  message: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormError[]>([]);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    // Token kontrolü
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/rol-sec');
    }
  }, [router]);

  const validateForm = (): boolean => {
    const newErrors: FormError[] = [];

    // Ad kontrolü
    if (formData.firstName.trim().length < 2) {
      newErrors.push({
        field: 'firstName',
        message: 'Ad en az 2 karakter olmalıdır'
      });
    }

    // Soyad kontrolü
    if (formData.lastName.trim().length < 2) {
      newErrors.push({
        field: 'lastName',
        message: 'Soyad en az 2 karakter olmalıdır'
      });
    }

    // E-posta kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.push({
        field: 'email',
        message: 'Geçerli bir e-posta adresi giriniz'
      });
    }

    // Şifre kontrolü
    if (formData.password.length < 6) {
      newErrors.push({
        field: 'password',
        message: 'Şifreniz en az 6 karakter olmalıdır'
      });
    }

    // Şifre tekrar kontrolü
    if (formData.password !== formData.confirmPassword) {
      newErrors.push({
        field: 'confirmPassword',
        message: 'Şifreler eşleşmiyor'
      });
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === 'Bu e-posta adresi zaten kullanımda') {
          setErrors([{ field: 'email', message: data.error }]);
        } else {
          setErrors([{ field: 'general', message: data.error || 'Bir hata oluştu' }]);
        }
        return;
      }

      // Başarılı kayıt
      localStorage.setItem('token', data.token);
      setAuth(true);
      router.push('/rol-sec');
      
    } catch (error) {
      setErrors([{ field: 'general', message: 'Bir hata oluştu. Lütfen tekrar deneyin.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const getFieldError = (fieldName: string): string => {
    const error = errors.find(e => e.field === fieldName);
    return error ? error.message : '';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Hesap Oluştur
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Bir El'e hoş geldiniz! Hemen ücretsiz hesap oluşturun.
          </p>
        </div>

        <div className="bg-white py-8 px-4 shadow-sm rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Genel Hata Mesajı */}
            {getFieldError('general') && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{getFieldError('general')}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Ad Soyad */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  Ad
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 
                      focus:outline-none focus:ring-[#FFC107] focus:border-[#FFC107] sm:text-sm
                      ${getFieldError('firstName') ? 'border-red-300' : 'border-gray-300'}`}
                  />
                  {getFieldError('firstName') && (
                    <p className="mt-1 text-xs text-red-600">{getFieldError('firstName')}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Soyad
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 
                      focus:outline-none focus:ring-[#FFC107] focus:border-[#FFC107] sm:text-sm
                      ${getFieldError('lastName') ? 'border-red-300' : 'border-gray-300'}`}
                  />
                  {getFieldError('lastName') && (
                    <p className="mt-1 text-xs text-red-600">{getFieldError('lastName')}</p>
                  )}
                </div>
              </div>
            </div>

            {/* E-posta */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                E-posta
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 
                    focus:outline-none focus:ring-[#FFC107] focus:border-[#FFC107] sm:text-sm
                    ${getFieldError('email') ? 'border-red-300' : 'border-gray-300'}`}
                />
                {getFieldError('email') && (
                  <p className="mt-1 text-xs text-red-600">{getFieldError('email')}</p>
                )}
              </div>
            </div>

            {/* Şifre */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Şifre
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 
                    focus:outline-none focus:ring-[#FFC107] focus:border-[#FFC107] sm:text-sm
                    ${getFieldError('password') ? 'border-red-300' : 'border-gray-300'}`}
                />
                {getFieldError('password') && (
                  <p className="mt-1 text-xs text-red-600">{getFieldError('password')}</p>
                )}
              </div>
            </div>

            {/* Şifre Tekrar */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Şifre Tekrar
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 
                    focus:outline-none focus:ring-[#FFC107] focus:border-[#FFC107] sm:text-sm
                    ${getFieldError('confirmPassword') ? 'border-red-300' : 'border-gray-300'}`}
                />
                {getFieldError('confirmPassword') && (
                  <p className="mt-1 text-xs text-red-600">{getFieldError('confirmPassword')}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-[#0A2540] bg-[#FFC107] 
                  hover:bg-[#FFB000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFC107]
                  ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#0A2540]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : null}
                {isLoading ? 'Kaydediliyor...' : 'Kayıt Ol'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Zaten hesabınız var mı?
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link 
                href="/giris"
                className="font-medium text-[#FFC107] hover:text-[#FFB000]"
              >
                Giriş yapın
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}