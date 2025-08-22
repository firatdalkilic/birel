"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { mockOffers, mockUserStats } from '@/data/mockData';
import { useAuthStore } from '@/store/authStore';

export default function GorevliDashboard() {
  const router = useRouter();
  const { isAuthenticated, selectedRole } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/giris');
    } else if (selectedRole !== 'gorevli') {
      router.push('/rol-sec');
    }
  }, [isAuthenticated, selectedRole, router]);

  if (!isAuthenticated || selectedRole !== 'gorevli') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Üst Bilgi Kartı */}
      <div className="bg-white shadow-sm">
        <div className="container-custom py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Hoş Geldiniz, Mehmet Bey</h1>
              <div className="mt-1 flex items-center">
                <span className="text-gray-600">Değerlendirme:</span>
                <div className="ml-2 flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`h-5 w-5 ${i < Math.floor(mockUserStats.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">{mockUserStats.rating}</span>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="text-sm font-medium text-gray-600">Tamamlanan Görev</div>
              <div className="mt-2 text-3xl font-bold text-gray-900">{mockUserStats.completedTasks}</div>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="text-sm font-medium text-gray-600">Aktif Başvuru</div>
              <div className="mt-2 text-3xl font-bold text-gray-900">{mockUserStats.activeTasks}</div>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="text-sm font-medium text-gray-600">Toplam Kazanç</div>
              <div className="mt-2 text-3xl font-bold text-gray-900">{mockUserStats.totalEarnings} ₺</div>
            </div>
          </div>
        </div>
      </div>

      {/* Teklif Listesi */}
      <div className="container-custom py-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Teklifleriniz</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockOffers.map((offer) => (
            <div key={offer.id} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{offer.taskTitle}</h3>
                  <p className="mt-1 text-sm text-gray-600">Teklif: {offer.offeredAmount} ₺</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                  ${offer.status === 'accepted' ? 'bg-green-100 text-green-800' : 
                    offer.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                    'bg-yellow-100 text-yellow-800'}`}
                >
                  {offer.status === 'accepted' ? 'Kabul Edildi' :
                    offer.status === 'rejected' ? 'Reddedildi' :
                    'Beklemede'}
                </span>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                {new Date(offer.createdAt).toLocaleDateString('tr-TR')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}