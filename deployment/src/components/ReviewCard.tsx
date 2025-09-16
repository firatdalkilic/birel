"use client";

import { Review } from '@/types/task';
import StarRating from './StarRating';

interface ReviewCardProps {
  review: Review;
  variant?: 'compact' | 'full';
}

export default function ReviewCard({ review, variant = 'full' }: ReviewCardProps) {
  const formattedDate = new Date(review.createdAt).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  if (variant === 'compact') {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-medium text-gray-900">{review.reviewerName}</p>
            <StarRating rating={review.rating} size="sm" />
          </div>
          <span className="text-sm text-gray-500">{formattedDate}</span>
        </div>
        {review.comment && (
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">{review.comment}</p>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-lg font-medium text-gray-600">
                {review.reviewerName.charAt(0)}
              </span>
            </div>
            <div className="ml-4">
              <p className="font-medium text-gray-900">{review.reviewerName}</p>
              <div className="mt-1">
                <StarRating rating={review.rating} />
              </div>
            </div>
          </div>
        </div>
        <span className="text-sm text-gray-500">{formattedDate}</span>
      </div>
      {review.comment && (
        <p className="mt-4 text-gray-600">{review.comment}</p>
      )}
    </div>
  );
}
