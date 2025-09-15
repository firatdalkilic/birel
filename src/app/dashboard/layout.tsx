"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, selectedRole } = useAuthStore();

  useEffect(() => {
    // Giriş yapmamış kullanıcıları yönlendir
    if (!isAuthenticated) {
      router.push('/giris');
      return;
    }

    // Rol seçmemiş kullanıcıları yönlendir
    if (!selectedRole) {
      router.push('/rol-sec');
    }
  }, [isAuthenticated, selectedRole, router]);

  return (
    <div>
      <main className="container-custom py-8">
        {children}
      </main>
    </div>
  );
}
