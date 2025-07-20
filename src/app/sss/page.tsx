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
    <main className="flex-1 flex flex-col items-center justify-center py-8 px-4 bg-background">
      <section className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6 md:p-10">
        <h2 className="text-2xl font-bold text-primary mb-6 text-center">Sık Sorulan Sorular</h2>
        <div className="space-y-4">
          {SSS.map((item, i) => (
            <div key={i} className="border rounded-xl overflow-hidden">
              <button
                type="button"
                className="w-full flex justify-between items-center px-4 py-3 text-left font-semibold text-text focus:outline-none focus:ring-2 focus:ring-primary transition"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                aria-controls={`panel-${i}`}
              >
                <span>{item.q}</span>
                <span className={`ml-2 transition-transform ${open === i ? 'rotate-180' : ''}`}>▼</span>
              </button>
              <div
                id={`panel-${i}`}
                className={`px-4 pb-3 text-text/80 text-sm transition-all duration-300 ${open === i ? 'block' : 'hidden'}`}
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