"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    // Token kontrolü
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/giris');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-12">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <h1 className="text-3xl font-bold text-[#333] mb-4">
              Hoş Geldiniz!
            </h1>
            <p className="text-gray-600">
              Bir El platformuna başarıyla kayıt oldunuz. Artık görevleri görüntüleyebilir ve başvurabilirsiniz.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link 
              href="/gorevler"
              className="bg-white rounded-xl shadow-sm p-8 hover:shadow-md transition-shadow"
            >
              <h2 className="text-xl font-semibold text-[#333] mb-2">
                Görevleri Görüntüle
              </h2>
              <p className="text-gray-600">
                Mevcut görevleri inceleyin ve size uygun olanlara başvurun.
              </p>
            </Link>

            <Link 
              href="/profilim"
              className="bg-white rounded-xl shadow-sm p-8 hover:shadow-md transition-shadow"
            >
              <h2 className="text-xl font-semibold text-[#333] mb-2">
                Profilim
              </h2>
              <p className="text-gray-600">
                Profil bilgilerinizi güncelleyin ve başvurularınızı takip edin.
              </p>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <div className="text-3xl font-bold text-[#333] mb-2">0</div>
              <div className="text-gray-600">Başvurduğunuz Görev</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <div className="text-3xl font-bold text-[#333] mb-2">0</div>
              <div className="text-gray-600">Tamamlanan Görev</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <div className="text-3xl font-bold text-[#333] mb-2">0</div>
              <div className="text-gray-600">Bekleyen Başvuru</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <div className="text-3xl font-bold text-[#333] mb-2">0</div>
              <div className="text-gray-600">Toplam Puan</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 