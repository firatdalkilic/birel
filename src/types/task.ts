export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'gorevveren' | 'gorevli' | null;
  rating: {
    average: number;
    total: number;
    count: number;
  };
  stats: {
    totalTasks: number;
    activeTasks: number;
    completedTasks: number;
    totalEarnings?: number; // Görev alan için
    totalSpent?: number;    // Görev veren için
  };
}

export interface Review {
  id: string;
  taskId: string;
  reviewerId: string; // Görev veren ID
  reviewerName: string;
  targetId: string;  // Görev alan ID
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  budget?: number;
  createdAt: string;
  deadline?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  createdBy: {
    id: string;
    name: string;
  };
  assignedTo?: {
    id: string;
    name: string;
  };
  offers: TaskOffer[];
  review?: Review;
  location?: string;
  urgency?: 'low' | 'medium' | 'high';
  tags?: string[];
}

export interface TaskOffer {
  id: string;
  taskId: string;
  taskTitle: string;
  offeredBy: {
    id: string;
    name: string;
    rating: number;
  };
  offeredAmount: number;
  status: 'pending' | 'accepted' | 'rejected';
  message?: string;
  createdAt: string;
}

export interface UserStats {
  totalTasks: number;
  activeTasks: number;
  completedTasks: number;
  totalEarnings?: number;
  totalSpent?: number;
  rating: number;
  responseRate?: number;
  completionRate?: number;
  onTimeRate?: number;
  reviewCount: number;
}