"use client";
import { useState } from "react";

const ACILIYET = [
  { label: "Hemen", value: "Hemen" },
  { label: "Bugün içinde", value: "Bugün içinde" },
  { label: "Haftaiçinde", value: "Haftaiçinde" },
];

export default function GorevVer() {
  const [form, setForm] = useState({
    adSoyad: "",
    telefon: "",
    sehirIlce: "",
    baslik: "",
    aciklama: "",
    aciliyet: "Hemen",
    butce: "",
    gizlilikOnayi: false,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setForm((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    if (!form.adSoyad || !form.telefon || !form.sehirIlce || !form.aciliyet || !form.gizlilikOnayi) {
      setError("Lütfen tüm zorunlu alanları doldurun ve gizlilik onayını kabul edin.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/gorev-ekle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setForm({
          adSoyad: "",
          telefon: "",
          sehirIlce: "",
          baslik: "",
          aciklama: "",
          aciliyet: "Hemen",
          butce: "",
          gizlilikOnayi: false,
        });
      } else {
        setError(data.error || "Bir hata oluştu.");
      }
    } catch {
      setError("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-center py-8 px-2 bg-gray-50">
      <section className="w-full max-w-xl bg-white shadow-lg p-8 rounded-xl mx-auto">
        <h2 className="text-3xl font-bold text-yellow-500 mb-6 text-center font-sans">Görev Ver</h2>
        <form className="space-y-5" onSubmit={handleSubmit} autoComplete="off">
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="adSoyad">Ad Soyad *</label>
            <input
              type="text"
              id="adSoyad"
              name="adSoyad"
              value={form.adSoyad}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="telefon">Telefon Numarası *</label>
            <input
              type="tel"
              id="telefon"
              name="telefon"
              value={form.telefon}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="sehirIlce">Şehir / İlçe *</label>
            <input
              type="text"
              id="sehirIlce"
              name="sehirIlce"
              value={form.sehirIlce}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="baslik">Görev Başlığı</label>
            <input
              type="text"
              id="baslik"
              name="baslik"
              value={form.baslik}
              onChange={handleChange}
              placeholder="Örn: Annemin ilacını eczaneden alabilir misin?"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="aciklama">Görev Açıklaması</label>
            <textarea
              id="aciklama"
              name="aciklama"
              value={form.aciklama}
              onChange={handleChange}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="aciliyet">Aciliyet *</label>
            <select
              id="aciliyet"
              name="aciliyet"
              value={form.aciliyet}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-50"
            >
              {ACILIYET.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="butce">Tahmini Bütçe</label>
            <input
              type="text"
              id="butce"
              name="butce"
              value={form.butce}
              onChange={handleChange}
              placeholder="Opsiyonel"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-50"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="gizlilikOnayi"
              name="gizlilikOnayi"
              checked={form.gizlilikOnayi}
              onChange={handleChange}
              required
              className="accent-yellow-400 w-5 h-5"
            />
            <label htmlFor="gizlilikOnayi" className="text-sm text-gray-600">Gizlilik ve sorumluluk koşullarını kabul ediyorum. *</label>
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">Görev başarıyla iletildi!</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full min-h-[48px] bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 px-6 rounded-xl shadow-md transition duration-200 text-lg disabled:opacity-60"
          >
            {loading ? "Gönderiliyor..." : "Görevi İlet"}
          </button>
        </form>
      </section>
    </main>
  );
} 