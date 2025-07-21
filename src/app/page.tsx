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
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-background pt-16 pb-32">
        <div className="container mx-auto px-4">
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
                <Link 
                  href="/gorev-ver" 
                  className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition duration-200"
                >
                  Görev Ver
                </Link>
                <Link 
                  href="/gorevli-ol"
                  className="w-full sm:w-auto border-2 border-primary hover:bg-primary/10 text-primary font-semibold py-3 px-6 rounded-xl shadow-md transition duration-200"
                >
                  Görevli Ol
                </Link>
              </div>
            </div>

            {/* Illustration */}
            <div className="lg:flex-1">
              <div className="relative w-full max-w-lg mx-auto">
                <svg
                  className="w-full h-auto"
                  viewBox="0 0 400 300"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Helper Character */}
                  <circle cx="200" cy="150" r="120" fill="#FFF5D6" />
                  <circle cx="200" cy="120" r="40" fill="#FFE082" />
                  <rect x="170" y="160" width="60" height="80" rx="20" fill="#F7B500" />
                  <circle cx="200" cy="110" r="15" fill="#F7B500" />

                  {/* Shopping Bag */}
                  <path
                    d="M280 160H320V220C320 231.046 311.046 240 300 240H300C288.954 240 280 231.046 280 220V160Z"
                    fill="#FFE082"
                  />
                  <path d="M280 160H320" stroke="#F7B500" strokeWidth="8" strokeLinecap="round" />
                  <path
                    d="M290 150C290 130 300 120 300 120C300 120 310 130 310 150"
                    stroke="#F7B500"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />

                  {/* Medicine Box */}
                  <rect x="80" y="180" width="40" height="40" rx="4" fill="#FFE082" />
                  <path
                    d="M90 200H110M100 190V210"
                    stroke="#F7B500"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STATS.map((stat, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-6 bg-white rounded-2xl shadow-md border border-gray-100"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-2xl">
                  {stat.icon}
                </div>
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
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Hızlı Çözüm</h3>
              <p className="text-gray-600">Görevleriniz için hızlı ve güvenilir destek bulun.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Güvenli Platform</h3>
              <p className="text-gray-600">Tüm görevliler kontrol edilir ve onaylanır.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
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
