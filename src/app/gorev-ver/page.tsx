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
    <main className="flex-1 flex flex-col items-center justify-center py-8 px-4 bg-background">
      <section className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-6 md:p-10">
        <h2 className="text-2xl font-bold text-primary mb-4 text-center">Görev Ver</h2>
        <form className="space-y-4" onSubmit={handleSubmit} autoComplete="off">
          <div>
            <label className="block font-medium mb-1" htmlFor="adSoyad">Ad Soyad *</label>
            <input
              type="text"
              id="adSoyad"
              name="adSoyad"
              value={form.adSoyad}
              onChange={handleChange}
              required
              className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block font-medium mb-1" htmlFor="telefon">Telefon Numarası *</label>
            <input
              type="tel"
              id="telefon"
              name="telefon"
              value={form.telefon}
              onChange={handleChange}
              required
              className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block font-medium mb-1" htmlFor="sehirIlce">Şehir / İlçe *</label>
            <input
              type="text"
              id="sehirIlce"
              name="sehirIlce"
              value={form.sehirIlce}
              onChange={handleChange}
              required
              className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block font-medium mb-1" htmlFor="baslik">Görev Başlığı</label>
            <input
              type="text"
              id="baslik"
              name="baslik"
              value={form.baslik}
              onChange={handleChange}
              placeholder="Örn: Annemin ilacını eczaneden alabilir misin?"
              className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block font-medium mb-1" htmlFor="aciklama">Görev Açıklaması</label>
            <textarea
              id="aciklama"
              name="aciklama"
              value={form.aciklama}
              onChange={handleChange}
              rows={3}
              className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block font-medium mb-1" htmlFor="aciliyet">Aciliyet *</label>
            <select
              id="aciliyet"
              name="aciliyet"
              value={form.aciliyet}
              onChange={handleChange}
              required
              className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {ACILIYET.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1" htmlFor="butce">Tahmini Bütçe</label>
            <input
              type="text"
              id="butce"
              name="butce"
              value={form.butce}
              onChange={handleChange}
              placeholder="Opsiyonel"
              className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
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
              className="accent-primary w-5 h-5"
            />
            <label htmlFor="gizlilikOnayi" className="text-sm">Gizlilik ve sorumluluk koşullarını kabul ediyorum. *</label>
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">Görev başarıyla iletildi!</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-yellow-500 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition text-lg disabled:opacity-60"
          >
            {loading ? "Gönderiliyor..." : "Görevi İlet"}
          </button>
        </form>
      </section>
    </main>
  );
} 