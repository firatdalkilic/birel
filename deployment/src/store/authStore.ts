import { create } from 'zustand';

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
  logout: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  isAuthenticated: false,
  selectedRole: null,
  user: null,
  
  setAuth: (isAuth) => set({ isAuthenticated: isAuth }),
  setRole: (role) => set({ selectedRole: role }),
  setUser: (user) => set({ user }),
  
  logout: () => {
    // Tüm localStorage'ı temizle
    localStorage.clear();
    
    // State'i temizle
    set({
      isAuthenticated: false,
      selectedRole: null,
      user: null
    });
  }
}));