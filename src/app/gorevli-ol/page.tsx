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
  const [showTooltip, setShowTooltip] = useState(false);

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
    <main className="flex-1 flex flex-col items-center justify-center py-8 px-2 bg-[#FAFAFA]">
      <div className="w-full max-w-5xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Form Section */}
        <section className="w-full lg:w-3/5 bg-white shadow-lg p-8 rounded-2xl">
          <h2 className="text-3xl font-bold text-yellow-500 mb-3 font-sans tracking-wide text-center lg:text-left">Görevli Ol</h2>
          <p className="text-gray-600 mb-6 text-lg text-center lg:text-left">Yardım etmeye hazır mısın? Hemen başvurunu yap.</p>
          
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
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-50 transition duration-200"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="telefon">Telefon *</label>
              <input
                type="tel"
                id="telefon"
                name="telefon"
                value={form.telefon}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-50 transition duration-200"
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
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-50 transition duration-200"
              />
            </div>
            <div>
              <span className="block text-gray-700 font-medium mb-3">Yapabileceği Görev Türleri *</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-gray-50 p-4 rounded-xl">
                {GOREV_TURLERI.map((tur) => (
                  <label key={tur} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <input
                      type="checkbox"
                      name="gorevTurleri"
                      value={tur}
                      checked={form.gorevTurleri.includes(tur)}
                      onChange={handleChange}
                      className="accent-yellow-400 w-5 h-5 cursor-pointer"
                    />
                    <span className="text-gray-700">{tur}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="uygunSaat">Uygun Saat Bilgisi *</label>
              <input
                type="text"
                id="uygunSaat"
                name="uygunSaat"
                value={form.uygunSaat}
                onChange={handleChange}
                required
                placeholder="Örn: Hafta içi 18:00 sonrası"
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-50 transition duration-200"
              />
            </div>
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <label className="block text-gray-700 font-medium" htmlFor="referans">Referans (isteğe bağlı)</label>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-600"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                {showTooltip && (
                  <div className="absolute top-0 left-40 bg-gray-800 text-white text-sm py-1 px-2 rounded shadow-lg z-10">
                    Varsa, daha hızlı değerlendirmeniz için yardımcı olabilir.
                  </div>
                )}
              </div>
              <input
                type="text"
                id="referans"
                name="referans"
                value={form.referans}
                onChange={handleChange}
                placeholder="Varsa belirtiniz"
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-50 transition duration-200"
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
                className="accent-yellow-400 w-5 h-5 cursor-pointer"
              />
              <label htmlFor="kvkkOnayi" className="text-sm text-gray-600">KVKK onayını kabul ediyorum. *</label>
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            {success && <div className="text-green-600 text-sm">Başvurunuz başarıyla iletildi!</div>}
            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-[48px] bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 px-6 rounded-xl shadow-md transition duration-200 text-lg cursor-pointer hover:scale-105 hover:shadow-lg disabled:opacity-60"
            >
              {loading ? "Gönderiliyor..." : "Başvuruyu İlet"}
            </button>
          </form>
        </section>

        {/* Illustration Section */}
        <div className="hidden lg:flex lg:w-2/5 justify-center items-start">
          <svg className="w-96 h-96" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Placeholder Delivery Character SVG */}
            <circle cx="100" cy="60" r="40" fill="#FFC700" />
            <rect x="70" y="100" width="60" height="80" fill="#FFE066" />
            <path d="M60 140L140 140" stroke="#FFCC00" strokeWidth="4" strokeLinecap="round" />
            <rect x="85" y="110" width="30" height="20" fill="#FFD700" />
            <path d="M70 180L130 180" stroke="#FFCC00" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </main>
  );
} 