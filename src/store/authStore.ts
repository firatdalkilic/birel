import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  selectedRole: string | null;
  setAuth: (isAuth: boolean) => void;
  setRole: (role: string | null) => void;
  checkAuth: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      selectedRole: null,
      
      setAuth: (isAuth) => set({ isAuthenticated: isAuth }),
      setRole: (role) => set({ selectedRole: role }),
      
      checkAuth: () => {
        if (typeof window === 'undefined') return;
        
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('selectedRole');
        
        set({
          isAuthenticated: !!token,
          selectedRole: role
        });
      },

      logout: () => {
        if (typeof window === 'undefined') return;
        
        localStorage.removeItem('token');
        localStorage.removeItem('selectedRole');
        
        set({
          isAuthenticated: false,
          selectedRole: null
        });
      }
    }),
    {
      name: 'auth-storage',
      skipHydration: true
    }
  )
); 