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
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold text-center mb-4">
        Senin yerine, <span className="text-primary">bir el uzanır.</span>
      </h1>
      <p className="text-xl text-gray-600 text-center max-w-2xl">
        Gündelik, karmaşık veya seni zorlayan görevler için artık yanındayız.
        Görev ver, sistem senin yerine halletsin.
      </p>
    </main>
  );
}
