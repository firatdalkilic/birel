"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAVIGATION = [
  { name: "Ana Sayfa", href: "/" },
  { name: "Görev Ver", href: "/gorev-ver" },
  { name: "Görevli Ol", href: "/gorevli-ol" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container-custom">
        <nav className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-[#FFC107]">Bir El</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {NAVIGATION.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-900 hover:text-[#FFC107] transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/giris"
              className="bg-[#0A2540] text-white px-6 py-2 rounded-lg hover:bg-[#0A2540]/90 transition-colors"
            >
              Giriş Yap / Üye Ol
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="flex flex-col gap-1.5">
              <span className={`hamburger-top ${isMenuOpen ? "hamburger-active" : ""}`} />
              <span className={`hamburger-middle ${isMenuOpen ? "hamburger-active" : ""}`} />
              <span className={`hamburger-bottom ${isMenuOpen ? "hamburger-active" : ""}`} />
            </div>
          </button>
        </nav>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden fixed inset-0 z-50 bg-white transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100">
              <span className="text-2xl font-bold text-[#FFC107]">Bir El</span>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="p-2"
                aria-label="Close menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <nav className="flex-1 px-4 py-8">
              <ul className="space-y-6">
                {NAVIGATION.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-lg text-gray-900 hover:text-[#FFC107] transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/giris"
                    className="text-lg text-[#0A2540] font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Giriş Yap / Üye Ol
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
} 