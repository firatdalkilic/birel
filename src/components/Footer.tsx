import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between py-4 px-4 md:px-0 gap-2">
        <span className="font-bold text-primary text-lg">Bir El</span>
        <nav className="flex gap-4 text-text text-sm">
          <Link href="/gizlilik">Gizlilik Politikası</Link>
          <Link href="/kvkk">KVKK</Link>
          <Link href="/iletisim">İletişim</Link>
        </nav>
        <span className="text-text">
          <span className="inline-block w-6 h-6 bg-gray-300 rounded-full text-center align-middle">IG</span>
        </span>
      </div>
    </footer>
  );
} 