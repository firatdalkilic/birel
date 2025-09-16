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

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      selectedRole: null,
      hasSelectedInitialRole: false,
      user: null,
      
      setAuth: (isAuth) => set({ isAuthenticated: isAuth }),
      setRole: (role) => set({ selectedRole: role }),
      setUser: (user) => set({ user }),
      setHasSelectedInitialRole: (value) => set({ hasSelectedInitialRole: value }),
      
      checkAuth: () => {
        if (typeof window === 'undefined') return;
        
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('selectedRole');
        const userStr = localStorage.getItem('user');
        const hasSelectedRole = localStorage.getItem('hasSelectedInitialRole');
        
        set({
          isAuthenticated: !!token,
          selectedRole: role,
          user: userStr ? JSON.parse(userStr) : null,
          hasSelectedInitialRole: hasSelectedRole === 'true'
        });
      },

      logout: () => {
        if (typeof window === 'undefined') return;
        
        // LocalStorage'ı temizle
        localStorage.removeItem('token');
        localStorage.removeItem('selectedRole');
        localStorage.removeItem('user');
        localStorage.removeItem('hasSelectedInitialRole');
        
        // Cookie'leri temizle
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'selectedRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'hasSelectedInitialRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        
        // State'i temizle
        set({
          isAuthenticated: false,
          selectedRole: null,
          user: null,
          hasSelectedInitialRole: false
        });
      }
    }),
    {
      name: 'auth-storage',
      skipHydration: true
    }
  )
);