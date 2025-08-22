export interface Task {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  status: 'pending' | 'completed' | 'in_progress';
  offers: number;
  category: string;
  budget?: number;
}

export interface TaskOffer {
  id: string;
  taskId: string;
  taskTitle: string;
  offeredAmount: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface UserStats {
  totalTasks: number;
  activeTasks: number;
  completedTasks: number;
  totalEarnings: number;
  rating: number;
}
