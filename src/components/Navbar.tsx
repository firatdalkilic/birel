"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaExchangeAlt } from "react-icons/fa";

interface User {
  firstName: string;
  lastName: string;
  lastSelectedRole?: 'gorevli' | 'gorevveren' | null;
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userStr = document.cookie
      .split('; ')
      .find(row => row.startsWith('user='));
    if (userStr) {
      try {
        const userJson = decodeURIComponent(userStr.split('=')[1]);
        setUser(JSON.parse(userJson));
      } catch (error) {
        console.error('User cookie parse error:', error);
      }
    }
  }, []);

  const handleLogout = () => {
    // Cookie'leri temizle
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'selectedRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'hasSelectedInitialRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    
    // State'i temizle
    setUser(null);
    setIsMenuOpen(false);
    
    // Ana sayfaya yönlendir
    window.location.href = '/';
  };

  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a
      href={href}
      className={`text-gray-700 hover:text-[#FFC107] transition-colors ${
        pathname === href ? 'text-[#FFC107] font-medium' : ''
      }`}
      onClick={() => setIsMenuOpen(false)}
    >
      {children}
    </a>
  );

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="/" className="flex items-center">
            <span className="text-2xl font-bold text-[#FFC107]">Bir El</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink href="/">Ana Sayfa</NavLink>
            
            {user ? (
              <>
                <NavLink href="/dashboard">Görevlerim</NavLink>
                <NavLink href="/profil">Profilim</NavLink>
                <NavLink href="/rol-sec">
                  <div className="flex items-center gap-2">
                    <FaExchangeAlt className="w-4 h-4" />
                    <span>Rol Değiştir</span>
                  </div>
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-gray-700 hover:text-red-500 transition-colors"
                >
                  <FaSignOutAlt className="w-4 h-4" />
                  <span>Çıkış Yap</span>
                </button>
              </>
            ) : (
              <>
                <NavLink href="/giris">Giriş Yap</NavLink>
                <a
                  href="/kayit"
                  className="bg-[#FFC107] text-[#0A2540] px-4 py-2 rounded-lg hover:bg-[#FFB000] transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Kayıt Ol
                </a>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <FaTimes className="w-6 h-6" />
            ) : (
              <FaBars className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-white">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100">
                <span className="text-2xl font-bold text-[#FFC107]">Bir El</span>
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2"
                  aria-label="Close menu"
                >
                  <FaTimes className="w-6 h-6" />
                </button>
              </div>
              <div className="flex-1 px-4 py-8">
                <div className="flex flex-col space-y-6">
                  <NavLink href="/">Ana Sayfa</NavLink>
                  
                  {user ? (
                    <>
                      <NavLink href="/dashboard">Görevlerim</NavLink>
                      <NavLink href="/profil">Profilim</NavLink>
                      <NavLink href="/rol-sec">
                        <div className="flex items-center gap-2">
                          <FaExchangeAlt className="w-4 h-4" />
                          <span>Rol Değiştir</span>
                        </div>
                      </NavLink>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-gray-700 hover:text-red-500 transition-colors"
                      >
                        <FaSignOutAlt className="w-4 h-4" />
                        <span>Çıkış Yap</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <NavLink href="/giris">Giriş Yap</NavLink>
                      <a
                        href="/kayit"
                        className="bg-[#FFC107] text-[#0A2540] px-4 py-2 rounded-lg hover:bg-[#FFB000] transition-colors text-center"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Kayıt Ol
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}