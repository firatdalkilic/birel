"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import StarRating from '@/components/StarRating';
import ReviewsList from '@/components/ReviewsList';

interface UserStats {
  totalTasks: number;
  activeTasks: number;
  completedTasks: number;
  totalEarnings: number;
  rating: {
    average: number;
    count: number;
  };
}

export default function GorevliDashboard() {
  const router = useRouter();
  const { isAuthenticated, selectedRole, user } = useAuthStore();
  const [stats, setStats] = useState<UserStats>({
    totalTasks: 0,
    activeTasks: 0,
    completedTasks: 0,
    totalEarnings: 0,
    rating: {
      average: 5.0,
      count: 0
    }
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/giris');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    // TODO: Backend'den kullanıcı istatistiklerini al
    const fetchStats = async () => {
      try {
        // Şimdilik boş bırakıyoruz, backend hazır olduğunda burayı dolduracağız
        // const response = await fetch('/api/user/stats');
        // const data = await response.json();
        // setStats(data);
      } catch (error) {
        console.error('İstatistikler alınamadı:', error);
      }
    };

    if (isAuthenticated && user) {
      fetchStats();
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated || selectedRole !== 'gorevli' || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Üst Bilgi Kartı */}
      <div className="bg-white shadow-sm">
        <div className="container-custom py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Hoş Geldiniz, {user.firstName} {user.lastName}
              </h1>
              <div className="mt-1 flex items-center">
                <span className="text-gray-600">Değerlendirmeniz:</span>
                <div className="ml-2">
                  <StarRating rating={stats.rating.average} />
                </div>
                <span className="ml-2 text-sm text-gray-500">
                  ({stats.rating.count} değerlendirme)
                </span>
              </div>
              <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Tamamlanan: {stats.completedTasks} görev</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Aktif: {stats.activeTasks} görev</span>
                </div>
              </div>
            </div>
            <Link
              href="/gorevler"
              className="inline-flex items-center px-6 py-3 bg-[#FFC107] text-[#0A2540] font-medium rounded-lg hover:bg-[#FFB000] transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Görevleri Keşfet
            </Link>
          </div>

          {/* İstatistikler */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="text-sm font-medium text-gray-600">Tamamlanan Görev</div>
              <div className="mt-2 text-3xl font-bold text-gray-900">{stats.completedTasks}</div>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="text-sm font-medium text-gray-600">Aktif Başvuru</div>
              <div className="mt-2 text-3xl font-bold text-gray-900">{stats.activeTasks}</div>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="text-sm font-medium text-gray-600">Toplam Kazanç</div>
              <div className="mt-2 text-3xl font-bold text-gray-900">{stats.totalEarnings} ₺</div>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="text-sm font-medium text-gray-600">Değerlendirme</div>
              <div className="mt-2 flex items-center">
                <StarRating rating={stats.rating.average} showScore={false} />
                <span className="ml-2 text-2xl font-bold text-gray-900">{stats.rating.average.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Aktif Başvurular */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Aktif Başvurularınız</h2>
              <div className="flex gap-2">
                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                  Filtrele
                </button>
                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                  Sırala
                </button>
              </div>
            </div>

            {/* Başvuru listesi buraya gelecek */}
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Henüz başvuru yok</h3>
              <p className="mt-1 text-sm text-gray-500">Yeni görevlere başvurarak başlayın.</p>
              <div className="mt-6">
                <Link
                  href="/gorevler"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-[#0A2540] bg-[#FFC107] hover:bg-[#FFB000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFC107]"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Görevleri Keşfet
                </Link>
              </div>
            </div>
          </div>

          {/* Değerlendirmeler */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Aldığım Değerlendirmeler</h2>
            {user && <ReviewsList userId={user.id} />}
          </div>
        </div>
      </div>
    </div>
  );
}