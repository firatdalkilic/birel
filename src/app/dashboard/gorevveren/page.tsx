"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { mockTasks, mockUserStats } from '@/data/mockData';
import { useAuthStore } from '@/store/authStore';

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
              <h1 className="text-2xl font-bold text-gray-900">Hoş Geldiniz, Ahmet Bey</h1>
              <p className="mt-1 text-gray-600">Görevlerinizi buradan yönetebilirsiniz</p>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="text-sm font-medium text-gray-600">Toplam Görev</div>
              <div className="mt-2 text-3xl font-bold text-gray-900">{mockUserStats.totalTasks}</div>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="text-sm font-medium text-gray-600">Aktif Görev</div>
              <div className="mt-2 text-3xl font-bold text-gray-900">{mockUserStats.activeTasks}</div>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="text-sm font-medium text-gray-600">Tamamlanan Görev</div>
              <div className="mt-2 text-3xl font-bold text-gray-900">{mockUserStats.completedTasks}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Görev Listesi */}
      <div className="container-custom py-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Görevleriniz</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockTasks.map((task) => (
            <div key={task.id} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{task.title}</h3>
                  <p className="mt-1 text-sm text-gray-600">{task.description}</p>
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
              <div className="mt-4 flex items-center justify-between text-sm">
                <div className="text-gray-600">
                  {new Date(task.createdAt).toLocaleDateString('tr-TR')}
                </div>
                <div className="text-[#FFC107] font-medium">
                  {task.offers} Teklif
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
