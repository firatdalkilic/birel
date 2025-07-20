import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-6 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-4">
        <span className="font-bold text-yellow-400 text-xl font-sans">Bir El</span>
        <nav className="flex gap-6 text-sm">
          <Link href="/gizlilik" className="text-gray-600 hover:text-gray-900 transition">Gizlilik Politikası</Link>
          <Link href="/kvkk" className="text-gray-600 hover:text-gray-900 transition">KVKK</Link>
          <Link href="/iletisim" className="text-gray-600 hover:text-gray-900 transition">İletişim</Link>
        </nav>
        <span className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-5 h-5 bg-gray-300 rounded-full text-gray-600">IG</span>
        </span>
      </div>
    </footer>
  );
} 