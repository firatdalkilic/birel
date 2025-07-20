"use client";
import { useState } from "react";

const GOREV_TURLERI = [
  "Dış görev (kargo, teslimat)",
  "Eczane / sağlık",
  "Evrak / resmi işler",
  "Dijital işler",
];

export default function GorevliOl() {
  const [form, setForm] = useState({
    adSoyad: "",
    telefon: "",
    sehirIlce: "",
    gorevTurleri: [] as string[],
    uygunSaat: "",
    referans: "",
    kvkkOnayi: false,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox" && name === "gorevTurleri") {
      const val = value;
      setForm((prev) => ({
        ...prev,
        gorevTurleri: prev.gorevTurleri.includes(val)
          ? prev.gorevTurleri.filter((v) => v !== val)
          : [...prev.gorevTurleri, val],
      }));
    } else if (type === "checkbox") {
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
    if (!form.adSoyad || !form.telefon || !form.sehirIlce || form.gorevTurleri.length === 0 || !form.uygunSaat || !form.kvkkOnayi) {
      setError("Lütfen tüm zorunlu alanları doldurun ve KVKK onayını kabul edin.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/gorevli-ekle", {
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
          gorevTurleri: [],
          uygunSaat: "",
          referans: "",
          kvkkOnayi: false,
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
        <h2 className="text-2xl font-bold text-primary mb-4 text-center">Görevli Ol</h2>
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
            <label className="block font-medium mb-1" htmlFor="telefon">Telefon *</label>
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
            <span className="block font-medium mb-1">Yapabileceği Görev Türleri *</span>
            <div className="flex flex-col gap-2">
              {GOREV_TURLERI.map((tur) => (
                <label key={tur} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="gorevTurleri"
                    value={tur}
                    checked={form.gorevTurleri.includes(tur)}
                    onChange={handleChange}
                    className="accent-primary w-5 h-5"
                  />
                  <span className="text-sm">{tur}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block font-medium mb-1" htmlFor="uygunSaat">Uygun Saat Bilgisi *</label>
            <input
              type="text"
              id="uygunSaat"
              name="uygunSaat"
              value={form.uygunSaat}
              onChange={handleChange}
              required
              placeholder="Örn: Hafta içi 18:00 sonrası"
              className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block font-medium mb-1" htmlFor="referans">Referans (isteğe bağlı)</label>
            <input
              type="text"
              id="referans"
              name="referans"
              value={form.referans}
              onChange={handleChange}
              placeholder="Varsa belirtiniz"
              className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="kvkkOnayi"
              name="kvkkOnayi"
              checked={form.kvkkOnayi}
              onChange={handleChange}
              required
              className="accent-primary w-5 h-5"
            />
            <label htmlFor="kvkkOnayi" className="text-sm">KVKK onayını kabul ediyorum. *</label>
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">Başvurunuz başarıyla iletildi!</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-yellow-500 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition text-lg disabled:opacity-60"
          >
            {loading ? "Gönderiliyor..." : "Başvuruyu İlet"}
          </button>
        </form>
      </section>
    </main>
  );
} 