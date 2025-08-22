import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string | null;
}

interface AuthState {
  isAuthenticated: boolean;
  selectedRole: string | null;
  hasSelectedInitialRole: boolean;
  user: User | null;
  setAuth: (isAuth: boolean) => void;
  setRole: (role: string | null) => void;
  setUser: (user: User | null) => void;
  setHasSelectedInitialRole: (value: boolean) => void;
  checkAuth: () => void;
  logout: () => void;
}

// Cookie yardımcı fonksiyonları
const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

const deleteCookie = (name: string) => {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      selectedRole: null,
      hasSelectedInitialRole: false,
      user: null,
      
      setAuth: (isAuth) => set({ isAuthenticated: isAuth }),
      setRole: (role) => {
        if (typeof document !== 'undefined') {
          document.cookie = `selectedRole=${role}; path=/; max-age=${7 * 24 * 60 * 60}`;
        }
        set({ selectedRole: role });
      },
      setUser: (user) => {
        if (user && typeof document !== 'undefined') {
          document.cookie = `user=${JSON.stringify(user)}; path=/; max-age=${7 * 24 * 60 * 60}`;
        }
        set({ user });
      },
      setHasSelectedInitialRole: (value) => {
        if (typeof document !== 'undefined') {
          document.cookie = `hasSelectedInitialRole=${value}; path=/; max-age=${7 * 24 * 60 * 60}`;
        }
        set({ hasSelectedInitialRole: value });
      },
      
      checkAuth: () => {
        if (typeof document === 'undefined') return;
        
        const token = getCookie('token');
        const userStr = getCookie('user');
        const selectedRole = getCookie('selectedRole');
        const hasSelectedRole = getCookie('hasSelectedInitialRole');
        
        set({
          isAuthenticated: !!token,
          selectedRole: selectedRole,
          user: userStr ? JSON.parse(userStr) : null,
          hasSelectedInitialRole: hasSelectedRole === 'true'
        });
      },

      logout: () => {
        if (typeof document === 'undefined') return;
        
        // Cookie'leri temizle
        deleteCookie('token');
        deleteCookie('user');
        deleteCookie('selectedRole');
        deleteCookie('hasSelectedInitialRole');
        
        // State'i temizle
        set({
          isAuthenticated: false,
          selectedRole: null,
          user: null,
          hasSelectedInitialRole: false
        });

        // Sayfayı yenile
        window.location.href = '/';
      }
    }),
    {
      name: 'auth-storage',
      skipHydration: true
    }
  )
);