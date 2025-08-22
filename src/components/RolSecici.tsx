"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaExchangeAlt } from 'react-icons/fa';

export default function RolSecici() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleRoleSelect = (role: 'gorevveren' | 'gorevli') => {
    // Local storage'a kaydet
    localStorage.setItem('selectedRole', role);
    localStorage.setItem('hasSelectedInitialRole', 'true');
    
    // Dropdown'ı kapat
    setIsOpen(false);
    
    // Yönlendir
    router.push(`/dashboard/${role}`);
  };

  return (
    <div className="relative">
      {/* Dropdown Butonu */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-[#FFC107] transition-colors"
      >
        <FaExchangeAlt className="w-4 h-4" />
        <span>Rol Seç</span>
      </button>

      {/* Dropdown Menü */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100">
          <button
            onClick={() => handleRoleSelect('gorevveren')}
            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            <span>👋</span>
            <span>Görev Veren</span>
          </button>
          <button
            onClick={() => handleRoleSelect('gorevli')}
            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            <span>🤝</span>
            <span>Görev Alan</span>
          </button>
        </div>
      )}
    </div>
  );
}