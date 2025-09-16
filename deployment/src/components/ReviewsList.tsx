"use client";

import { useEffect, useState } from 'react';
import StarRating from './StarRating';

interface Review {
  taskId: string;
  taskTitle: string;
  rating: number;
  comment: string;
  createdAt: string;
  reviewerId: string;
}

interface ReviewsListProps {
  userId: string;
}

export default function ReviewsList({ userId }: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/reviews?userId=${userId}`);
        if (!response.ok) {
          throw new Error('Değerlendirmeler alınamadı');
        }
        const data = await response.json();
        setReviews(data.reviews);
      } catch (error) {
        console.error('Değerlendirmeler yüklenirken hata:', error);
        setError('Değerlendirmeler yüklenirken bir hata oluştu');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <svg className="animate-spin h-8 w-8 text-[#FFC107]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">Henüz değerlendirme yok</h3>
        <p className="mt-1 text-sm text-gray-500">İlk değerlendirmenizi görev tamamlandıktan sonra alacaksınız.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.taskId} className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium text-gray-900">{review.taskTitle}</h3>
              <div className="mt-1">
                <StarRating rating={review.rating} size="sm" />
              </div>
            </div>
            <span className="text-sm text-gray-500">
              {new Date(review.createdAt).toLocaleDateString('tr-TR')}
            </span>
          </div>
          {review.comment && (
            <p className="mt-4 text-gray-600">{review.comment}</p>
          )}
        </div>
      ))}
    </div>
  );
}
