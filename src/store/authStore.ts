import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  selectedRole: string | null;
  setAuth: (isAuth: boolean) => void;
  setRole: (role: string | null) => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  selectedRole: null,
  
  setAuth: (isAuth) => set({ isAuthenticated: isAuth }),
  setRole: (role) => set({ selectedRole: role }),
  
  checkAuth: () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('selectedRole');
    
    set({
      isAuthenticated: !!token,
      selectedRole: role
    });
  }
})); 