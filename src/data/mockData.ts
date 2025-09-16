import { Task, TaskOffer, UserStats, Review, User } from '@/types/task';

export const mockUser: User = {
  id: '1',
  firstName: 'Ahmet',
  lastName: 'Yılmaz',
  email: 'ahmet@example.com',
  phone: '+905551234567',
  role: 'gorevveren',
  rating: {
    average: 4.8,
    total: 24,
    count: 5
  },
  stats: {
    totalTasks: 15,
    activeTasks: 3,
    completedTasks: 12,
    totalSpent: 1500
  }
};

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Yaşlı amcaya market alışverişi',
    description: 'Haftalık market alışverişi yapılacak',
    category: 'Market Alışverişi',
    budget: 100,
    createdAt: '2024-02-20T10:00:00Z',
    deadline: '2024-02-21T10:00:00Z',
    status: 'pending',
    createdBy: {
      id: '1',
      name: 'Ahmet Yılmaz'
    },
    offers: [
      {
        id: '1',
        taskId: '1',
        taskTitle: 'Yaşlı amcaya market alışverişi',
        offeredBy: {
          id: '2',
          name: 'Mehmet Demir',
          rating: 4.7
        },
        offeredAmount: 90,
        status: 'pending',
        message: 'Yardımcı olmaktan mutluluk duyarım',
        createdAt: '2024-02-20T10:30:00Z'
      }
    ],
    location: 'Kadıköy, İstanbul',
    urgency: 'medium',
    tags: ['market', 'alışveriş', 'yaşlı yardım']
  },
  {
    id: '2',
    title: 'İlaç alımı ve teslimat',
    description: 'Eczaneden ilaç alınıp eve teslim edilecek',
    category: 'İlaç Alımı',
    budget: 50,
    createdAt: '2024-02-19T15:30:00Z',
    status: 'completed',
    createdBy: {
      id: '1',
      name: 'Ahmet Yılmaz'
    },
    assignedTo: {
      id: '3',
      name: 'Ayşe Kaya'
    },
    offers: [],
    review: {
      id: '1',
      taskId: '2',
      reviewerId: '1',
      reviewerName: 'Ahmet Yılmaz',
      targetId: '3',
      rating: 5,
      comment: 'Çok hızlı ve güvenilir teslimat, teşekkürler!',
      createdAt: '2024-02-19T18:30:00Z'
    },
    location: 'Beşiktaş, İstanbul',
    urgency: 'high',
    tags: ['ilaç', 'teslimat', 'acil']
  }
];

export const mockOffers: TaskOffer[] = [
  {
    id: '1',
    taskId: '1',
    taskTitle: 'Yaşlı amcaya market alışverişi',
    offeredBy: {
      id: '2',
      name: 'Mehmet Demir',
      rating: 4.7
    },
    offeredAmount: 90,
    status: 'pending',
    message: 'Yardımcı olmaktan mutluluk duyarım',
    createdAt: '2024-02-20T10:30:00Z'
  },
  {
    id: '2',
    taskId: '2',
    taskTitle: 'İlaç alımı ve teslimat',
    offeredBy: {
      id: '3',
      name: 'Ayşe Kaya',
      rating: 4.9
    },
    offeredAmount: 50,
    status: 'accepted',
    message: 'Hemen yola çıkabilirim',
    createdAt: '2024-02-19T16:00:00Z'
  }
];

export const mockReviews: Review[] = [
  {
    id: '1',
    taskId: '2',
    reviewerId: '1',
    reviewerName: 'Ahmet Yılmaz',
    targetId: '3',
    rating: 5,
    comment: 'Çok hızlı ve güvenilir teslimat, teşekkürler!',
    createdAt: '2024-02-19T18:30:00Z'
  },
  {
    id: '2',
    taskId: '3',
    reviewerId: '4',
    reviewerName: 'Zeynep Demir',
    targetId: '3',
    rating: 4.5,
    comment: 'Zamanında ve özenli teslimat',
    createdAt: '2024-02-18T14:00:00Z'
  }
];

export const mockUserStats: UserStats = {
  totalTasks: 15,
  activeTasks: 3,
  completedTasks: 12,
  totalEarnings: 1250,
  totalSpent: 1500,
  rating: 4.8,
  responseRate: 95,
  completionRate: 98,
  onTimeRate: 100,
  reviewCount: 5
};