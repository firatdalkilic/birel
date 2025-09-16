import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Task from '@/models/Task';

export async function POST(req: Request) {
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  try {
    await dbConnect();
    
    const body = await req.json();
    const { taskId, rating, comment, reviewerId, workerId } = body;

    // Validasyon
    if (!taskId || !rating || !reviewerId || !workerId) {
      return NextResponse.json(
        { error: 'Eksik bilgi' },
        { status: 400 }
      );
    }

    // Görevi bul ve güncelle
    const task = await Task.findById(taskId);
    if (!task) {
      return NextResponse.json(
        { error: 'Görev bulunamadı' },
        { status: 404 }
      );
    }

    // Görevin tamamlandığından emin ol
    if (task.status !== 'completed') {
      return NextResponse.json(
        { error: 'Görev henüz tamamlanmadı' },
        { status: 400 }
      );
    }

    // Değerlendirmeyi ekle
    task.review = {
      rating,
      comment,
      createdAt: new Date(),
      reviewerId
    };
    await task.save();

    // Görev alan kullanıcının puanını güncelle
    const worker = await User.findById(workerId);
    if (!worker) {
      return NextResponse.json(
        { error: 'Görevli bulunamadı' },
        { status: 404 }
      );
    }

    // Yeni ortalama puanı hesapla
    const totalRating = (worker.rating?.total || 0) + rating;
    const ratingCount = (worker.rating?.count || 0) + 1;
    const averageRating = totalRating / ratingCount;

    // Kullanıcı puanını güncelle
    worker.rating = {
      total: totalRating,
      count: ratingCount,
      average: averageRating
    };
    await worker.save();

    return NextResponse.json({
      message: 'Değerlendirme başarıyla eklendi',
      review: task.review,
      workerRating: worker.rating
    });

  } catch (error: any) {
    console.error('API hatası:', error);
    return NextResponse.json(
      { error: error.message || 'Bir hata oluştu' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'Kullanıcı ID gerekli' },
        { status: 400 }
      );
    }

    // Kullanıcının aldığı değerlendirmeleri bul
    const tasks = await Task.find({
      'assignedTo.id': userId,
      'review': { $exists: true }
    }).sort({ 'review.createdAt': -1 });

    const reviews = tasks.map(task => ({
      taskId: task._id,
      taskTitle: task.title,
      rating: task.review.rating,
      comment: task.review.comment,
      createdAt: task.review.createdAt,
      reviewerId: task.review.reviewerId
    }));

    return NextResponse.json({ reviews });

  } catch (error: any) {
    console.error('API hatası:', error);
    return NextResponse.json(
      { error: error.message || 'Bir hata oluştu' },
      { status: 500 }
    );
  }
}
