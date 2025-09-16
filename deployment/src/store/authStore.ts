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
  hasSelectedInitialRole: boolean;
  user: User | null;
  setAuth: (isAuth: boolean) => void;
  setRole: (role: string | null) => void;
  setUser: (user: User | null) => void;
  setHasSelectedInitialRole: (value: boolean) => void;
  checkAuth: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
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
    
    // Sadece localStorage'ı kontrol et
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
    
    // Tüm localStorage'ı temizle
    localStorage.clear();
    
    // Zustand persist storage'ı da temizle
    localStorage.removeItem('auth-storage');
    
    // State'i temizle
    set({
      isAuthenticated: false,
      selectedRole: null,
      user: null,
      hasSelectedInitialRole: false
    });
  }
}));