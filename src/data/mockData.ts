import { Task, TaskOffer, UserStats } from '@/types/task';

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Yaşlı amcaya market alışverişi',
    description: 'Haftalık market alışverişi yapılacak',
    createdAt: '2024-02-20T10:00:00Z',
    status: 'pending',
    offers: 3,
    category: 'Market Alışverişi'
  },
  {
    id: '2',
    title: 'İlaç alımı ve teslimat',
    description: 'Eczaneden ilaç alınıp eve teslim edilecek',
    createdAt: '2024-02-19T15:30:00Z',
    status: 'completed',
    offers: 2,
    category: 'İlaç Alımı'
  },
  {
    id: '3',
    title: 'Kargo paketi taşıma',
    description: 'Kargo şubesinden paket alınıp eve getirilecek',
    createdAt: '2024-02-18T09:15:00Z',
    status: 'in_progress',
    offers: 4,
    category: 'Paket Taşıma'
  }
];

export const mockOffers: TaskOffer[] = [
  {
    id: '1',
    taskId: '1',
    taskTitle: 'Yaşlı amcaya market alışverişi',
    offeredAmount: 100,
    status: 'pending',
    createdAt: '2024-02-20T10:30:00Z'
  },
  {
    id: '2',
    taskId: '2',
    taskTitle: 'İlaç alımı ve teslimat',
    offeredAmount: 50,
    status: 'accepted',
    createdAt: '2024-02-19T16:00:00Z'
  },
  {
    id: '3',
    taskId: '3',
    taskTitle: 'Kargo paketi taşıma',
    offeredAmount: 75,
    status: 'rejected',
    createdAt: '2024-02-18T09:45:00Z'
  }
];

export const mockUserStats: UserStats = {
  totalTasks: 15,
  activeTasks: 3,
  completedTasks: 12,
  totalEarnings: 1250,
  rating: 4.8
};
