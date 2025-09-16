"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

const CATEGORIES = [
  {
    title: "Ev İşleri",
    icon: "🏠",
    count: "+425",
    description: "görev tamamlandı",
  },
  {
    title: "İlaç Alımı",
    icon: "💊",
    count: "+200",
    description: "görev tamamlandı",
  },
  {
    title: "Paket Taşıma",
    icon: "📦",
    count: "+390",
    description: "görev tamamlandı",
  },
  {
    title: "Evcil Hayvan Bakımı",
    icon: "🐾",
    count: "+105",
    description: "görev tamamlandı",
  },
];

const FEATURES = [
  {
    title: "Güvenli Platform",
    description: "Tüm kullanıcılarımız kimlik doğrulamasından geçer ve güvenlik önlemlerimizle korunur.",
    icon: "🔒",
  },
  {
    title: "Hızlı Hizmet",
    description: "Görevleriniz en kısa sürede tamamlanır. Ortalama 2 saat içinde çözüm.",
    icon: "⚡",
  },
  {
    title: "Uygun Fiyat",
    description: "Komisyon oranımız sektörün en düşüğü. Sadece %5 komisyon alıyoruz.",
    icon: "💰",
  },
  {
    title: "7/24 Destek",
    description: "Her zaman yanınızdayız. Sorularınız için 7/24 müşteri desteği.",
    icon: "🎧",
  },
];

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Sayfa yüklendiğinde tüm cache'i temizle
    localStorage.clear();
    
    // Sadece loading'i kapat, AuthProvider auth kontrolünü yapacak
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#FFC107]"></div>
      </div>
    );
  }

  // Authenticated kullanıcılar için de anasayfayı göster, sadece yönlendirme yapma

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[80vh] bg-[#FCF6E6] overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=2070&auto=format&fit=crop"
            alt="Bir El - Yardımlaşma Platformu"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FCF6E6] via-[#FCF6E6]/95 to-transparent" />
        </div>
        
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 min-h-[80vh] items-center">
            <div className="py-12 md:py-20 pr-4 md:pr-12">
              <h1 className="text-5xl md:text-6xl font-bold text-[#0A2540] mb-8">
                Zamana mı<br />
                ihtiyacın var?<br />
                Biz halledelim.
              </h1>
              <p className="text-xl text-gray-600 mb-10">
                Bir El, gündelik işleri senin için kolaylaştırır.<br />
                Güvenli ve hızlı yardımlaşma platformu.
              </p>
              <div className="flex flex-wrap gap-4">
                <a 
                  href="/kayit" 
                  className="bg-[#FFC107] text-[#0A2540] px-8 py-4 rounded-lg font-medium hover:bg-[#FFC107]/90 transition-colors text-lg"
                >
                  Kayıt Ol
                </a>
                <a 
                  href="/giris"
                  className="bg-white text-[#0A2540] px-8 py-4 rounded-lg font-medium border-2 border-[#0A2540] hover:bg-gray-50 transition-colors text-lg"
                >
                  Giriş Yap
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0A2540] mb-4">
              Popüler Kategoriler
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              En çok tercih edilen hizmet kategorilerimizi keşfedin
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORIES.map((category) => (
              <div key={category.title} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="text-xl font-semibold text-[#0A2540] mb-2">
                  {category.title}
                </h3>
                <div className="text-3xl font-bold text-[#0A2540] mb-1">
                  {category.count}
                </div>
                <p className="text-gray-600">{category.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0A2540] mb-4">
              Neden Bir El?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Türkiye'nin en güvenilir mikro görev platformu olmamızın nedenleri
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-[#0A2540] mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 bg-[#0A2540] text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Hemen Başla!
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Binlerce kullanıcıya katıl ve gündelik işlerini kolaylaştır
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="/kayit" 
              className="bg-[#FFC107] text-[#0A2540] px-8 py-4 rounded-lg font-medium hover:bg-[#FFC107]/90 transition-colors text-lg"
            >
              Ücretsiz Kayıt Ol
            </a>
            <a 
              href="/giris"
              className="bg-transparent text-white px-8 py-4 rounded-lg font-medium border-2 border-white hover:bg-white hover:text-[#0A2540] transition-colors text-lg"
            >
              Giriş Yap
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-[#FFC107] mb-2">
                1000+
              </div>
              <div className="text-xl text-gray-600">
                Mutlu Kullanıcı
              </div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-[#FFC107] mb-2">
                5000+
              </div>
              <div className="text-xl text-gray-600">
                Tamamlanan Görev
              </div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-[#FFC107] mb-2">
                4.9/5
              </div>
              <div className="text-xl text-gray-600">
                Kullanıcı Puanı
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}