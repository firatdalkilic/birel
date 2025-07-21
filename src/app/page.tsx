import Image from "next/image";
import Link from "next/link";

const STATS = [
  {
    icon: "✅",
    value: "100+",
    label: "görev başarıyla tamamlandı",
  },
  {
    icon: "👥",
    value: "40+",
    label: "aktif görevli",
  },
  {
    icon: "🔒",
    label: "KVKK uyumlu, %100 güvenli",
  },
];

export default function Home() {
  return (
    <main className="flex-1 bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-background pt-16 pb-32">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
            {/* Content */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text mb-6">
                Senin yerine,{" "}
                <span className="text-primary">bir el uzanır.</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto lg:mx-0">
                Gündelik, karmaşık veya seni zorlayan görevler için artık yanındayız.
                Görev ver, sistem senin yerine halletsin.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <Link href="/gorev-ver" className="btn-primary w-full sm:w-auto">
                  Görev Ver
                </Link>
                <Link href="/gorevli-ol" className="btn-outline w-full sm:w-auto">
                  Görevli Ol
                </Link>
              </div>
            </div>

            {/* Hero Image */}
            <div className="lg:flex-1">
              <div className="relative w-full max-w-lg mx-auto aspect-[4/3]">
                <Image
                  src="https://images.unsplash.com/photo-1592009309600-c5a7c004fba3"
                  alt="Yardımlaşma"
                  fill
                  className="object-cover rounded-2xl shadow-xl"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Wave Shape */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            className="w-full h-auto"
            viewBox="0 0 1440 74"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1440 74V24.6666C1360 44.6666 1200 74 1080 74C920 74 840 24.6666 720 24.6666C600 24.6666 520 74 360 74C240 74 80 44.6666 0 24.6666V74H1440Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STATS.map((stat, index) => (
              <div
                key={index}
                className="stats-card"
              >
                <div className="stats-icon text-2xl">{stat.icon}</div>
                <div>
                  {stat.value && (
                    <div className="text-3xl font-bold text-text mb-1">{stat.value}</div>
                  )}
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card text-center hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Hızlı Çözüm</h3>
              <p className="text-gray-600">Görevleriniz için hızlı ve güvenilir destek bulun.</p>
            </div>

            {/* Feature 2 */}
            <div className="card text-center hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Güvenli Platform</h3>
              <p className="text-gray-600">Tüm görevliler kontrol edilir ve onaylanır.</p>
            </div>

            {/* Feature 3 */}
            <div className="card text-center hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Gönüllü Ağı</h3>
              <p className="text-gray-600">Geniş gönüllü ağımızla her göreve çözüm.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
