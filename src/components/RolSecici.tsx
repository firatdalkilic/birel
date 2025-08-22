"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { FaExchangeAlt } from 'react-icons/fa';

export default function RolSecici() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { selectedRole, setRole, setHasSelectedInitialRole } = useAuthStore();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRoleChange = (newRole: 'gorevveren' | 'gorevli') => {
    // Store'u güncelle
    setRole(newRole);
    setHasSelectedInitialRole(true);
    localStorage.setItem('selectedRole', newRole);
    localStorage.setItem('hasSelectedInitialRole', 'true');
    
    // Dropdown'ı kapat
    setIsOpen(false);
    
    // Bildirim göster
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);

    // Yönlendirme yap
    router.push(`/dashboard/${newRole}`);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Rol Seçici Dropdown */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFC107] rounded-lg"
      >
        <FaExchangeAlt className="w-4 h-4" />
        <span className="hidden sm:block">
          {selectedRole ? `${selectedRole === 'gorevveren' ? 'Görev Veren' : 'Görev Alan'}` : 'Rol Seç'}
        </span>
        <svg className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Dropdown Menü */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1" role="menu">
            <button
              onClick={() => handleRoleChange('gorevveren')}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2
                ${selectedRole === 'gorevveren' ? 'text-[#FFC107] font-medium' : 'text-gray-700'}`}
              role="menuitem"
            >
              <span>👋</span>
              <span>Görev Veren</span>
              {selectedRole === 'gorevveren' && (
                <svg className="ml-auto h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
            <button
              onClick={() => handleRoleChange('gorevli')}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2
                ${selectedRole === 'gorevli' ? 'text-[#FFC107] font-medium' : 'text-gray-700'}`}
              role="menuitem"
            >
              <span>🤝</span>
              <span>Görev Alan</span>
              {selectedRole === 'gorevli' && (
                <svg className="ml-auto h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Bildirim */}
      <div
        className={`fixed bottom-4 right-4 bg-[#FFC107] text-[#0A2540] px-6 py-3 rounded-lg shadow-lg transform transition-transform duration-300 flex items-center gap-2
          ${showNotification ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
      >
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        <span className="font-medium">Rol değiştirildi</span>
      </div>
    </div>
  );
}