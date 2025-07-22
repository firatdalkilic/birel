"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Token kontrolü
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      
      // Role göre yönlendirme
      const lastSelectedRole = localStorage.getItem('selectedRole');
      if (!lastSelectedRole) {
        router.push('/rol-sec');
      } else if (lastSelectedRole === 'gorevveren') {
        router.push('/dashboard/gorevveren');
      } else if (lastSelectedRole === 'gorevli') {
        router.push('/dashboard/gorevli');
      }
    }
  }, [router]);

  // Eğer kullanıcı giriş yapmışsa ve yönlendirme bekleniyorsa boş sayfa göster
  if (isAuthenticated) {
    return null;
  }

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
                <Link 
                  href="/kayit" 
                  className="bg-[#FFC107] text-[#0A2540] px-8 py-4 rounded-lg font-medium hover:bg-[#FFC107]/90 transition-colors text-lg"
                >
                  Kayıt Ol
                </Link>
                <Link 
                  href="/giris"
                  className="bg-white text-[#0A2540] px-8 py-4 rounded-lg font-medium border-2 border-[#0A2540] hover:bg-gray-50 transition-colors text-lg"
                >
                  Giriş Yap
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container-custom">
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
    </>
  );
}
