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
        
        // Hem localStorage hem cookie'leri kontrol et
        const localStorageToken = localStorage.getItem('token');
        const localStorageRole = localStorage.getItem('selectedRole');
        const localStorageUser = localStorage.getItem('user');
        const localStorageHasSelectedRole = localStorage.getItem('hasSelectedInitialRole');
        
        // Cookie'leri kontrol et
        const cookieToken = document.cookie.includes('token=');
        const cookieUser = document.cookie
          .split('; ')
          .find(row => row.startsWith('user='));
        const cookieRole = document.cookie
          .split('; ')
          .find(row => row.startsWith('selectedRole='));
        const cookieHasSelectedRole = document.cookie.includes('hasSelectedInitialRole=true');
        
        // Token varsa (localStorage veya cookie'de) auth true yap
        const hasToken = !!localStorageToken || cookieToken;
        
        // Kullanıcı bilgilerini al (localStorage öncelikli)
        let user = null;
        if (localStorageUser) {
          try {
            user = JSON.parse(localStorageUser);
          } catch (error) {
            console.error('localStorage user parse error:', error);
          }
        } else if (cookieUser) {
          try {
            const userJson = decodeURIComponent(cookieUser.split('=')[1]);
            user = JSON.parse(userJson);
          } catch (error) {
            console.error('cookie user parse error:', error);
          }
        }
        
        // Rol bilgilerini al (localStorage öncelikli)
        const role = localStorageRole || (cookieRole ? cookieRole.split('=')[1] : null);
        const hasSelectedRole = localStorageHasSelectedRole === 'true' || cookieHasSelectedRole;
        
        set({
          isAuthenticated: hasToken,
          selectedRole: role,
          user: user,
          hasSelectedInitialRole: hasSelectedRole
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