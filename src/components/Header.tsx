import Link from 'next/link';

const menu = [
  { name: 'Anasayfa', href: '/' },
  { name: 'Görev Ver', href: '/gorev-ver' },
  { name: 'Görevli Ol', href: '/gorevli-ol' },
  { name: 'SSS', href: '/sss' },
  { name: 'İletişim', href: '/iletisim' },
];

export default function Header() {
  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-30">
      <nav className="max-w-6xl mx-auto flex items-center justify-between py-4 px-4">
        <Link href="/" className="text-3xl font-bold text-yellow-400 tracking-tight select-none font-sans">
          Bir El
        </Link>
        <ul className="hidden md:flex gap-6 text-gray-700 font-medium">
          {menu.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="hover:text-yellow-500 transition-colors px-2 py-1 rounded-md">
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
        {/* Mobil menü için hamburger ikonunu buraya ekleyebilirsiniz */}
      </nav>
    </header>
  );
} 