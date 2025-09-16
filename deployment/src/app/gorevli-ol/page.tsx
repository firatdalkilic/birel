"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const TASK_TYPES = [
  "Ev işleri",
  "İlaç alımı",
  "Paket taşıma",
  "Çocuk bakımı",
  "Bahçe işleri",
];

const DAYS = [
  "Pazartesi",
  "Salı",
  "Çarşamba",
  "Perşembe",
  "Cuma",
  "Cumartesi",
  "Pazar",
];

const CITIES = ["İstanbul", "Ankara", "İzmir"]; // Örnek şehirler
const DISTRICTS = {
  İstanbul: ["Kadıköy", "Beşiktaş", "Üsküdar"], // Örnek ilçeler
  Ankara: ["Çankaya", "Keçiören", "Mamak"],
  İzmir: ["Konak", "Karşıyaka", "Bornova"],
};

export default function GorevliKayit() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedCity, setSelectedCity] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    passwordConfirm: "",
    city: "",
    district: "",
    tasks: [] as string[],
    transportation: "",
    availability: [] as string[],
    about: "",
    avatar: "",
    kvkkAccepted: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    if (name === "kvkkAccepted") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: checked
          ? [...(prev[name as "tasks" | "availability"] || []), value]
          : (prev[name as "tasks" | "availability"] || []).filter((item) => item !== value),
      }));
    }
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const city = e.target.value;
    setSelectedCity(city);
    setFormData((prev) => ({ ...prev, city, district: "" }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    console.log('Form validasyonu başladı');

    if (!formData.firstName) newErrors.firstName = "Ad alanı zorunludur";
    if (!formData.lastName) newErrors.lastName = "Soyad alanı zorunludur";
    if (!formData.email) newErrors.email = "E-posta alanı zorunludur";
    if (!formData.phone) newErrors.phone = "Telefon numarası zorunludur";
    if (!formData.password) newErrors.password = "Şifre zorunludur";
    if (formData.password.length < 8) newErrors.password = "Şifre en az 8 karakter olmalıdır";
    if (formData.password !== formData.passwordConfirm) newErrors.passwordConfirm = "Şifreler eşleşmiyor";
    if (!formData.city) newErrors.city = "Şehir seçimi zorunludur";
    if (!formData.district) newErrors.district = "İlçe seçimi zorunludur";
    if (!formData.tasks.length) newErrors.tasks = "En az bir görev türü seçmelisiniz";
    if (!formData.transportation) newErrors.transportation = "Ulaşım durumu seçimi zorunludur";
    if (!formData.availability.length) newErrors.availability = "En az bir gün seçmelisiniz";
    if (!formData.kvkkAccepted) newErrors.kvkkAccepted = "KVKK metnini onaylamalısınız";

    console.log('Validasyon hataları:', newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submit başladı');
    
    if (!validateForm()) {
      console.log('Form validasyonu başarısız');
      return;
    }

    setLoading(true);
    try {
      console.log('Form gönderiliyor:', formData);
      const res = await fetch("/api/register-gorevli", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          city: formData.city,
          district: formData.district,
          tasks: formData.tasks,
          transportation: formData.transportation,
          availability: formData.availability,
          about: formData.about,
          kvkkAccepted: formData.kvkkAccepted
        }),
      });

      const data = await res.json();
      console.log('API yanıtı:', data);

      if (!res.ok) {
        console.error('API hatası:', data.error);
        throw new Error(data.error || 'Bir hata oluştu');
      }

      // Token'ı localStorage'a kaydet
      localStorage.setItem("token", data.token);
      
      // Başarılı kayıt sonrası yönlendirme
      router.push("/");
    } catch (error: any) {
      console.error('Kayıt hatası:', error);
      setErrors((prev) => ({ ...prev, submit: error.message }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-12">
      <div className="container-custom">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="text-2xl font-bold text-[#FFBE3F]">
            Bir El
          </Link>
        </div>

        {/* Form Container */}
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-8">
          <h1 className="text-3xl font-bold text-[#333] mb-8 text-center">
            Görevli olarak kayıt ol
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Kişisel Bilgiler */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                  Ad
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFBE3F] focus:border-transparent"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                  Soyad
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFBE3F] focus:border-transparent"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* İletişim Bilgileri */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                  E-posta
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFBE3F] focus:border-transparent"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                  Telefon Numarası
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+90"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFBE3F] focus:border-transparent"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>
            </div>

            {/* Şifre */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                  Şifre
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFBE3F] focus:border-transparent"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                  Şifre Tekrar
                </label>
                <input
                  type="password"
                  name="passwordConfirm"
                  value={formData.passwordConfirm}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFBE3F] focus:border-transparent"
                />
                {errors.passwordConfirm && (
                  <p className="text-red-500 text-sm mt-1">{errors.passwordConfirm}</p>
                )}
              </div>
            </div>

            {/* Lokasyon */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                  Şehir
                </label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleCityChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFBE3F] focus:border-transparent"
                >
                  <option value="">Seçiniz</option>
                  {CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                  İlçe
                </label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  disabled={!selectedCity}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFBE3F] focus:border-transparent"
                >
                  <option value="">Seçiniz</option>
                  {selectedCity &&
                    DISTRICTS[selectedCity as keyof typeof DISTRICTS].map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                </select>
                {errors.district && (
                  <p className="text-red-500 text-sm mt-1">{errors.district}</p>
                )}
              </div>
            </div>

            {/* Görev Türleri */}
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                Yapabileceğin Görevler
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {TASK_TYPES.map((task) => (
                  <label key={task} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="tasks"
                      value={task}
                      checked={formData.tasks.includes(task)}
                      onChange={handleCheckboxChange}
                      className="rounded border-gray-300 text-[#FFBE3F] focus:ring-[#FFBE3F]"
                    />
                    <span className="text-sm text-[#4A4A4A]">{task}</span>
                  </label>
                ))}
              </div>
              {errors.tasks && (
                <p className="text-red-500 text-sm mt-1">{errors.tasks}</p>
              )}
            </div>

            {/* Ulaşım */}
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                Ulaşım Durumu
              </label>
              <div className="space-x-6">
                {["Kendi aracı var", "Yaya"].map((type) => (
                  <label key={type} className="inline-flex items-center">
                    <input
                      type="radio"
                      name="transportation"
                      value={type}
                      checked={formData.transportation === type}
                      onChange={handleInputChange}
                      className="text-[#FFBE3F] focus:ring-[#FFBE3F]"
                    />
                    <span className="ml-2 text-sm text-[#4A4A4A]">{type}</span>
                  </label>
                ))}
              </div>
              {errors.transportation && (
                <p className="text-red-500 text-sm mt-1">{errors.transportation}</p>
              )}
            </div>

            {/* Müsait Günler */}
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                Müsait Günler
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {DAYS.map((day) => (
                  <label key={day} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="availability"
                      value={day}
                      checked={formData.availability.includes(day)}
                      onChange={handleCheckboxChange}
                      className="rounded border-gray-300 text-[#FFBE3F] focus:ring-[#FFBE3F]"
                    />
                    <span className="text-sm text-[#4A4A4A]">{day}</span>
                  </label>
                ))}
              </div>
              {errors.availability && (
                <p className="text-red-500 text-sm mt-1">{errors.availability}</p>
              )}
            </div>

            {/* Açıklama */}
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                Kısa Açıklama
              </label>
              <textarea
                name="about"
                value={formData.about}
                onChange={handleInputChange}
                maxLength={300}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFBE3F] focus:border-transparent"
                placeholder="Kendinizi kısaca tanıtın..."
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.about.length}/300 karakter
              </p>
            </div>

            {/* KVKK */}
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                name="kvkkAccepted"
                checked={formData.kvkkAccepted}
                onChange={handleCheckboxChange}
                className="mt-1 rounded border-gray-300 text-[#FFBE3F] focus:ring-[#FFBE3F]"
              />
              <label className="text-sm text-[#4A4A4A]">
                <Link href="/kvkk" className="text-[#FFBE3F] hover:underline">
                  KVKK metnini
                </Link>{" "}
                okudum ve onaylıyorum
              </label>
            </div>
            {errors.kvkkAccepted && (
              <p className="text-red-500 text-sm">{errors.kvkkAccepted}</p>
            )}

            {/* Genel Hata */}
            {errors.submit && (
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-red-500 text-sm">{errors.submit}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              onClick={(e) => {
                e.preventDefault();
                console.log('Button clicked');
                handleSubmit(e);
              }}
              className="w-full bg-[#1A1A1A] text-white py-3 rounded-lg hover:bg-[#333] transition-colors disabled:opacity-50"
            >
              {loading ? "Kaydediliyor..." : "Kayıt Ol"}
            </button>

            {/* Login Link */}
            <p className="text-center text-sm text-[#4A4A4A]">
              Zaten üye misin?{" "}
              <Link href="/giris" className="text-[#FFBE3F] hover:underline">
                Giriş yap
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
} 