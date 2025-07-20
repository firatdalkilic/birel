"use client";
import { useState } from "react";

const SSS = [
  {
    q: "Görevi kim yapıyor?",
    a: "Başvurduğumuz görevli havuzundan bir kişi yönlendirilir.",
  },
  {
    q: "Güvenli mi?",
    a: "Tüm görevler kontrol edilir, kişisel bilgi paylaşımı yapılmaz.",
  },
  {
    q: "Ücret nasıl belirleniyor?",
    a: "İlk etapta teklif usulü, ileride sabit fiyatlar olabilir.",
  },
  {
    q: "Ne kadar sürede dönüş alırım?",
    a: "Genelde aynı gün içinde dönüş yapılır.",
  },
];

export default function SssPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <main className="flex-1 flex flex-col items-center justify-center py-8 px-2 bg-gray-50">
      <section className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 mx-auto">
        <h2 className="text-3xl font-bold text-yellow-500 mb-8 text-center font-sans">Sık Sorulan Sorular</h2>
        <div className="space-y-4">
          {SSS.map((item, i) => (
            <div key={i} className="border border-gray-200 bg-white rounded-md shadow p-4 mb-4">
              <button
                type="button"
                className="w-full flex justify-between items-center text-left font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition py-2"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                aria-controls={`panel-${i}`}
              >
                <span className="text-lg font-medium">{item.q}</span>
                <span className={`ml-2 transition-transform text-yellow-500 ${open === i ? 'rotate-180' : ''}`}>▼</span>
              </button>
              <div
                id={`panel-${i}`}
                className={`text-gray-500 text-base leading-relaxed transition-all duration-300 ${open === i ? 'block mt-2' : 'hidden'}`}
              >
                {item.a}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
} 