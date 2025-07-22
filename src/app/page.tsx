import Image from "next/image";
import Link from "next/link";

const CATEGORIES = [
  {
    title: "Ev İşleri",
    icon: "🏠",
    description: "Temizlik, yemek, ütü gibi ev işlerinde yardım",
  },
  {
    title: "İlaç Alımı",
    icon: "💊",
    description: "İlaç alımı ve teslimatı konusunda destek",
  },
  {
    title: "Paket Taşıma",
    icon: "📦",
    description: "Ağır eşya ve paketlerin taşınmasında yardım",
  },
  {
    title: "Teknik Destek",
    icon: "💻",
    description: "Bilgisayar ve telefon konularında teknik destek",
  },
  {
    title: "Market Alışverişi",
    icon: "🛒",
    description: "Market alışverişi ve teslimatı",
  },
  {
    title: "Evcil Hayvan Bakımı",
    icon: "🐾",
    description: "Evcil hayvanların bakımı ve gezdirilmesi",
  },
];

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-text-heading mb-6">
                İhtiyacı olana yardım eli uzatın
              </h1>
              <p className="text-lg text-text-body mb-8">
                Bir El, yardıma ihtiyacı olanlarla gönüllüleri buluşturan bir platformdur.
                Siz de katılın, birlikte daha güzel bir dünya inşa edelim.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/gorev-ver" className="btn-primary">
                  Görev Ver
                </Link>
                <Link href="/gorevli-ol" className="btn-primary">
                  Görevli Ol
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] md:h-[500px]">
              <Image
                src="/hero-image.jpg"
                alt="Bir El - Yardımlaşma Platformu"
                fill
                className="object-cover rounded-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 md:py-20 bg-background-light">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text-heading mb-4">
              Hangi konuda destek arıyorsun?
            </h2>
            <p className="text-lg text-text-body">
              İhtiyacınıza göre uygun kategoriyi seçin, size yardımcı olalım.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES.map((category) => (
              <div key={category.title} className="category-card">
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="text-xl font-semibold text-text-heading mb-2">
                  {category.title}
                </h3>
                <p className="text-text-body">{category.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
