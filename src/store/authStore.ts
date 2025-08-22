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
  user: User | null;
  setAuth: (isAuth: boolean) => void;
  setRole: (role: string | null) => void;
  setUser: (user: User | null) => void;
  checkAuth: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      selectedRole: null,
      user: null,
      
      setAuth: (isAuth) => set({ isAuthenticated: isAuth }),
      setRole: (role) => set({ selectedRole: role }),
      setUser: (user) => set({ user }),
      
      checkAuth: () => {
        if (typeof window === 'undefined') return;
        
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('selectedRole');
        const userStr = localStorage.getItem('user');
        
        set({
          isAuthenticated: !!token,
          selectedRole: role,
          user: userStr ? JSON.parse(userStr) : null
        });
      },

      logout: () => {
        if (typeof window === 'undefined') return;
        
        localStorage.removeItem('token');
        localStorage.removeItem('selectedRole');
        localStorage.removeItem('user');
        
        set({
          isAuthenticated: false,
          selectedRole: null,
          user: null
        });
      }
    }),
    {
      name: 'auth-storage',
      skipHydration: true
    }
  )
);