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

const HOW_IT_WORKS = [
  {
    icon: "📝",
    title: "Görevini yaz",
    description: "İhtiyacını detaylı bir şekilde paylaş",
  },
  {
    icon: "🤝",
    title: '"Bir El" seni eşleştirir',
    description: "Güvenilir görevlilerle hızlıca eşleş",
  },
  {
    icon: "✅",
    title: "Yardım tamamlanır",
    description: "Görevin güvenle yerine getirilir",
  },
];

const TESTIMONIALS = [
  {
    name: "Ayşe K.",
    avatar: "A",
    text: "Anneme ilaç aldım, 15 dk içinde görevli geldi.",
  },
  {
    name: "Mehmet D.",
    avatar: "M",
    text: "Başta tereddüt ettim ama inanılmaz güvenliydi.",
  },
];

export default function Home() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background pt-16 pb-32">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
            {/* Content */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text mb-6">
                Senin yerine,{" "}
                <span className="text-primary">bir el uzanır.</span>
              </h1>
              <p className="text-lg md:text-xl text-text-secondary mb-12 max-w-2xl mx-auto lg:mx-0">
                Gündelik, karmaşık veya seni zorlayan görevler için artık yanındayız.
                Görev ver, sistem senin yerine halletsin.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <Link 
                  href="/gorev-ver" 
                  className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-text font-semibold py-3 px-6 rounded-xl shadow-md transition duration-200"
                >
                  Görev Ver
                </Link>
                <Link 
                  href="/gorevli-ol"
                  className="w-full sm:w-auto border-2 border-primary hover:bg-primary/10 text-text font-semibold py-3 px-6 rounded-xl shadow-md transition duration-200"
                >
                  Görevli Ol
                </Link>
              </div>
            </div>

            {/* Hero Image */}
            <div className="lg:flex-1">
              <div className="relative w-full aspect-[4/3] max-w-lg mx-auto">
                <Image
                  src="https://images.unsplash.com/photo-1592009309600-c5a7c004fba3"
                  alt="Bir El yardımlaşma platformu"
                  fill
                  className="object-cover rounded-2xl shadow-xl"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background-alt">
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
                  <div className="text-text-secondary">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-text text-center mb-12">
            Nasıl Çalışır?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((step, index) => (
              <div
                key={index}
                className="bg-[#FFFDF6] p-8 rounded-2xl shadow-lg text-center relative"
              >
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold text-text mb-3">{step.title}</h3>
                <p className="text-text-secondary">{step.description}</p>
                {index < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 text-4xl text-primary/30">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-background-alt">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-text text-center mb-12">
            Gerçek kullanıcılarımızdan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {TESTIMONIALS.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-lg"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-lg font-semibold text-text">
                    {testimonial.avatar}
                  </div>
                  <div className="font-semibold text-text">{testimonial.name}</div>
                </div>
                <p className="text-text-secondary italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
