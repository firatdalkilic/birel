"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { mockTasks, mockUser, mockUserStats } from '@/data/mockData';
import { useAuthStore } from '@/store/authStore';
import StarRating from '@/components/StarRating';

export default function GorevVerenDashboard() {
  const router = useRouter();
  const { isAuthenticated, selectedRole } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/giris');
    } else if (selectedRole !== 'gorevveren') {
      router.push('/rol-sec');
    }
  }, [isAuthenticated, selectedRole, router]);

  if (!isAuthenticated || selectedRole !== 'gorevveren') {
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
                Hoş Geldiniz, {mockUser.firstName} {mockUser.lastName}
              </h1>
              <div className="mt-1 flex items-center">
                <span className="text-gray-600">Değerlendirmeniz:</span>
                <div className="ml-2">
                  <StarRating rating={mockUser.rating.average} />
                </div>
                <span className="ml-2 text-sm text-gray-500">
                  ({mockUser.rating.count} değerlendirme)
                </span>
              </div>
            </div>
            <Link
              href="/gorev-ver"
              className="inline-flex items-center px-6 py-3 bg-[#FFC107] text-[#0A2540] font-medium rounded-lg hover:bg-[#FFB000] transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Yeni Görev Ver
            </Link>
          </div>

          {/* İstatistikler */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="text-sm font-medium text-gray-600">Toplam Görev</div>
              <div className="mt-2 text-3xl font-bold text-gray-900">{mockUserStats.totalTasks}</div>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="text-sm font-medium text-gray-600">Aktif Görev</div>
              <div className="mt-2 text-3xl font-bold text-gray-900">{mockUserStats.activeTasks}</div>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="text-sm font-medium text-gray-600">Tamamlanan</div>
              <div className="mt-2 text-3xl font-bold text-gray-900">{mockUserStats.completedTasks}</div>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="text-sm font-medium text-gray-600">Toplam Harcama</div>
              <div className="mt-2 text-3xl font-bold text-gray-900">{mockUserStats.totalSpent} ₺</div>
            </div>
          </div>
        </div>
      </div>

      {/* Görev Listesi */}
      <div className="container-custom py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Görevleriniz</h2>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              Filtrele
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              Sırala
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockTasks.map((task) => (
            <div key={task.id} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{task.title}</h3>
                  <p className="mt-1 text-sm text-gray-600 line-clamp-2">{task.description}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                  ${task.status === 'completed' ? 'bg-green-100 text-green-800' : 
                    task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 
                    'bg-yellow-100 text-yellow-800'}`}
                >
                  {task.status === 'completed' ? 'Tamamlandı' :
                    task.status === 'in_progress' ? 'Devam Ediyor' :
                    'Teklif Bekleniyor'}
                </span>
              </div>

              <div className="mt-4 flex items-center text-sm text-gray-500">
                <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(task.createdAt).toLocaleDateString('tr-TR')}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center text-sm">
                  <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="font-medium text-[#FFC107]">{task.budget} ₺</span>
                </div>
                <div className="flex items-center text-sm text-[#FFC107] font-medium">
                  <svg className="flex-shrink-0 mr-1.5 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                  {task.offers.length} Teklif
                </div>
              </div>

              {task.status === 'completed' && task.review && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center">
                    <StarRating rating={task.review.rating} size="sm" />
                    <span className="ml-2 text-sm text-gray-600 line-clamp-1">{task.review.comment}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}