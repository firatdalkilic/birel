"use client";
import { useState } from "react";

const SSS = [
  {
    icon: "❓",
    q: "Görevi kim yapıyor?",
    a: "Başvurduğumuz görevli havuzundan bir kişi yönlendirilir.",
  },
  {
    icon: "🔒",
    q: "Güvenli mi?",
    a: "Tüm görevler kontrol edilir, kişisel bilgi paylaşımı yapılmaz.",
  },
  {
    icon: "💰",
    q: "Ücret nasıl belirleniyor?",
    a: "İlk etapta teklif usulü, ileride sabit fiyatlar olabilir.",
  },
  {
    icon: "⏱️",
    q: "Ne kadar sürede dönüş alırım?",
    a: "Genelde aynı gün içinde dönüş yapılır.",
  },
];

export default function SssPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <main className="flex-1 flex flex-col items-center justify-center py-8 px-2 bg-[#FAFAFA]">
      <section className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-yellow-500 mb-3 font-sans tracking-wide">Sık Sorulan Sorular</h2>
          <p className="text-gray-600 text-lg">Aklındaki soruların çoğu burada cevaplandı.</p>
        </div>
        
        <div className="space-y-4">
          {SSS.map((item, i) => (
            <div 
              key={i} 
              className={`border border-gray-200 bg-white rounded-xl overflow-hidden transition-all duration-300 ease-in-out ${open === i ? 'shadow-md' : ''}`}
            >
              <button
                type="button"
                className="w-full flex items-center gap-3 p-4 text-left font-semibold text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                aria-controls={`panel-${i}`}
              >
                <span className="text-2xl" role="img" aria-label="icon">
                  {item.icon}
                </span>
                <span className="text-lg font-medium flex-1">{item.q}</span>
                <svg
                  className={`w-5 h-5 text-yellow-500 transform transition-transform duration-300 ${open === i ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                id={`panel-${i}`}
                className={`overflow-hidden transition-all duration-300 ease-in-out ${open === i ? 'max-h-40' : 'max-h-0'}`}
              >
                <div className="p-4 pt-0 text-gray-600 text-base leading-relaxed bg-gray-50">
                  {item.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
} 