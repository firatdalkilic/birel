"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { mockUser, mockUserStats, mockReviews, mockOffers } from '@/data/mockData';
import { useAuthStore } from '@/store/authStore';
import StarRating from '@/components/StarRating';
import ReviewCard from '@/components/ReviewCard';

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
              <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Tamamlanma: %{mockUserStats.completionRate}</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Zamanında: %{mockUserStats.onTimeRate}</span>
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
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="text-sm font-medium text-gray-600">Değerlendirme</div>
              <div className="mt-2 flex items-center">
                <StarRating rating={mockUserStats.rating} showScore={false} />
                <span className="ml-2 text-2xl font-bold text-gray-900">{mockUserStats.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Teklif Listesi */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Teklifleriniz</h2>
              <div className="flex gap-2">
                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                  Filtrele
                </button>
                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                  Sırala
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
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
                  {offer.message && (
                    <p className="mt-4 text-sm text-gray-600">{offer.message}</p>
                  )}
                  <div className="mt-4 text-sm text-gray-600">
                    {new Date(offer.createdAt).toLocaleDateString('tr-TR')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Değerlendirmeler */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Son Değerlendirmeler</h2>
            <div className="space-y-4">
              {mockReviews.map((review) => (
                <ReviewCard key={review.id} review={review} variant="compact" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}