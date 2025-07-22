"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log('Giriş denemesi:', { email: formData.email });
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Giriş başarısız');
      }

      // Token'ı localStorage'a kaydet
      localStorage.setItem("token", data.token);
      
      // Role göre yönlendirme
      if (data.user.role === "gorevli") {
        router.push("/dashboard/gorevli");
      } else if (data.user.role === "gorevveren") {
        router.push("/dashboard/gorevveren");
      } else {
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error('Giriş hatası:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-8">
        {/* Logo ve Başlık */}
        <div className="text-center">
          <Link href="/" className="inline-block">
            <span className="text-3xl font-bold text-[#FFC107]">Bir El</span>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-[#0F172A]">
            Giriş Yap
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6 bg-white p-8 rounded-xl shadow-sm">
          <div className="space-y-4">
            {/* E-posta */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                E-posta
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFC107] focus:border-transparent"
              />
            </div>

            {/* Şifre */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Şifre
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                minLength={8}
                value={formData.password}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFC107] focus:border-transparent"
              />
            </div>

            {/* Beni Hatırla & Şifremi Unuttum */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-[#FFC107] focus:ring-[#FFC107] border-gray-300 rounded"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                  Beni hatırla
                </label>
              </div>

              <div className="text-sm">
                <Link href="/sifremi-unuttum" className="font-medium text-[#FFC107] hover:text-[#FFB000]">
                  Şifremi unuttum
                </Link>
              </div>
            </div>

            {/* Hata Mesajı */}
            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Giriş Butonu */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#0F172A] hover:bg-[#1E293B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0F172A] disabled:opacity-50"
            >
              {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </button>
          </div>
        </form>

        {/* Kayıt Ol Bağlantısı */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Hesabınız yok mu?{" "}
            <Link href="/gorevli-ol" className="font-medium text-[#FFC107] hover:text-[#FFB000]">
              Kayıt Ol
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 