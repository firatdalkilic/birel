import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Kullanıcı tipi
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  lastSelectedRole: 'gorevli' | 'gorevveren' | null;
  roles: ('gorevli' | 'gorevveren')[];
  gorevliProfile?: {
    tasks: string[];
    transportation: string;
    availability: string[];
    about: string;
    rating: number;
    completedTasks: number;
  };
  gorevverenProfile?: {
    postedTasks: number;
    rating: number;
  };
}

// Auth store
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      login: (user, token) => set({ 
        user, 
        token, 
        isAuthenticated: true,
        isLoading: false 
      }),
      logout: () => set({ 
        user: null, 
        token: null, 
        isAuthenticated: false,
        isLoading: false 
      }),
      setLoading: (loading) => set({ isLoading: loading }),
      updateUser: (user) => set({ user })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      })
    }
  )
);

// Görev tipi
export interface Task {
  _id: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  location: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  createdBy: {
    id: string;
    name: string;
  };
  assignedTo?: {
    id: string;
    name: string;
  };
  offers: Array<{
    id: string;
    userId: string;
    userName: string;
    amount: number;
    message: string;
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: Date;
  }>;
  urgency: 'low' | 'medium' | 'high';
  createdAt: Date;
  deadline?: Date;
}

// Görev store
interface TaskState {
  tasks: Task[];
  currentTask: Task | null;
  isLoading: boolean;
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  setCurrentTask: (task: Task | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  currentTask: null,
  isLoading: false,
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ 
    tasks: [task, ...state.tasks] 
  })),
  updateTask: (taskId, updates) => set((state) => ({
    tasks: state.tasks.map(task => 
      task._id === taskId ? { ...task, ...updates } : task
    ),
    currentTask: state.currentTask?._id === taskId 
      ? { ...state.currentTask, ...updates } 
      : state.currentTask
  })),
  setCurrentTask: (task) => set({ currentTask: task }),
  setLoading: (loading) => set({ isLoading: loading })
}));

// UI store
interface UIState {
  sidebarOpen: boolean;
  modalOpen: boolean;
  modalType: string | null;
  toggleSidebar: () => void;
  openModal: (type: string) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  modalOpen: false,
  modalType: null,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  openModal: (type) => set({ modalOpen: true, modalType: type }),
  closeModal: () => set({ modalOpen: false, modalType: null })
}));
