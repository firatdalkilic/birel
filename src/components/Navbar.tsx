"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
    // Token'dan kullanıcı bilgilerini al
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({
          firstName: payload.firstName,
          lastName: payload.lastName,
          lastSelectedRole: payload.role,
        });
      } catch (error) {
        console.error('Token çözümleme hatası:', error);
        // Token hatalıysa temizle
        handleLogout();
      }
    }
  }, []);

  const handleLogout = () => {
    // State'i temizle
    setUser(null);
    
    // Local storage'ı temizle
    localStorage.removeItem('token');
    localStorage.removeItem('selectedRole');
    
    // Menüyü kapat (eğer açıksa)
    setIsMenuOpen(false);
    
    // Ana sayfaya yönlendir
    window.location.href = '/';
  };

  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    window.location.href = path;
  };

  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link
      href={href}
      className={`text-gray-700 hover:text-[#FFC107] transition-colors ${
        pathname === href ? 'text-[#FFC107] font-medium' : ''
      }`}
      onClick={(e) => handleNavigation(e, href)}
    >
      {children}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center"
            onClick={(e) => handleNavigation(e, '/')}
          >
            <span className="text-2xl font-bold text-[#FFC107]">Bir El</span>
          </Link>

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
                <Link
                  href="/kayit"
                  className="bg-[#FFC107] text-[#0A2540] px-4 py-2 rounded-lg hover:bg-[#FFB000] transition-colors"
                  onClick={(e) => handleNavigation(e, '/kayit')}
                >
                  Kayıt Ol
                </Link>
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
                      <Link
                        href="/kayit"
                        className="bg-[#FFC107] text-[#0A2540] px-4 py-2 rounded-lg hover:bg-[#FFB000] transition-colors text-center"
                        onClick={(e) => handleNavigation(e, '/kayit')}
                      >
                        Kayıt Ol
                      </Link>
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