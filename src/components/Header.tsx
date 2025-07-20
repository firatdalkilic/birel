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
      <nav className="container mx-auto flex items-center justify-between py-3 px-4 md:px-0">
        <Link href="/" className="text-2xl font-bold text-primary tracking-tight select-none">
          Bir El
        </Link>
        <ul className="hidden md:flex gap-6 text-text font-medium">
          {menu.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="hover:text-primary transition-colors">
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