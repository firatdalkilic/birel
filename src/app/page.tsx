import Image from "next/image";
import Link from "next/link";

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
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 bg-[#FCF6E6]">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#0A2540] mb-6">
                Zamana mı<br />
                ihtiyacın var?<br />
                Biz halledelim.
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Bir El, gündelik işleri senin için kolaylaştırır.<br />
                Güvenli ve hızlı yardımlaşma platformu.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/gorev-ver" 
                  className="bg-[#FFC107] text-[#0A2540] px-6 py-3 rounded-lg font-medium hover:bg-[#FFC107]/90 transition-colors"
                >
                  Görev Ver
                </Link>
                <Link 
                  href="/gorevli-ol"
                  className="bg-white text-[#0A2540] px-6 py-3 rounded-lg font-medium border-2 border-[#0A2540] hover:bg-gray-50 transition-colors"
                >
                  Görevli Ol
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] md:h-[500px] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-[#FCF6E6] via-[#FCF6E6]/50 to-transparent z-10" />
              <Image
                src="https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=2070&auto=format&fit=crop"
                alt="Bir El - Yardımlaşma Platformu"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORIES.map((category) => (
              <div key={category.title} className="bg-white p-6 rounded-xl">
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
