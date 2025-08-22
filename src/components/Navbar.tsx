"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { FaBars, FaTimes, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useAuthStore } from "@/store/authStore";
import RolSecici from "./RolSecici";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    if (isAuthenticated) {
      e.preventDefault();
    }
  };

  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link
      href={href}
      className={`text-gray-700 hover:text-[#FFC107] transition-colors ${
        pathname === href ? 'text-[#FFC107] font-medium' : ''
      }`}
      onClick={() => setIsMenuOpen(false)}
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
            className="flex items-center cursor-pointer"
            onClick={handleLogoClick}
          >
            <span className="text-2xl font-bold text-[#FFC107]">Bir El</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {!isAuthenticated && <NavLink href="/">Ana Sayfa</NavLink>}
            
            {isAuthenticated ? (
              <>
                <NavLink href="/profil" className="flex items-center gap-2">
                  <FaUserCircle className="text-lg" />
                  <span>Profilim</span>
                </NavLink>
                <RolSecici />
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
                  onClick={() => setIsMenuOpen(false)}
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
                  {!isAuthenticated && <NavLink href="/">Ana Sayfa</NavLink>}
                  
                  {isAuthenticated ? (
                    <>
                      <NavLink href="/profil" className="flex items-center gap-2">
                        <FaUserCircle className="text-lg" />
                        <span>Profilim</span>
                      </NavLink>
                      <RolSecici />
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
                        onClick={() => setIsMenuOpen(false)}
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