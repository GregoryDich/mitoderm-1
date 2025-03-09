import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { reviews as initialReviews } from '@/constants';
import { ReviewType } from '@/types';
import clientPromise from '@/lib/mongodb/mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/options';

// Получение списка отзывов
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('mitoderm');
    
    // Попробуем получить данные из MongoDB
    try {
      const reviews = await db.collection('reviews')
        .find({})
        .sort({ createdAt: -1 })
        .toArray();
      
      if (reviews && reviews.length > 0) {
        return NextResponse.json({
          success: true,
          data: reviews.map(review => ({
            id: review._id.toString(),
            name: review.name,
            rating: review.rating,
            text: review.text,
            isTranslationKey: review.isTranslationKey || false
          }))
        });
      }
    } catch (dbError) {
      console.error('Error fetching reviews from MongoDB:', dbError);
      // Продолжаем выполнение, чтобы попробовать получить данные из констант
    }
    
    // Если в базе данных нет записей, используем данные из констант
    // и сохраняем их в базу данных для будущего использования
    if (initialReviews && initialReviews.length > 0) {
      try {
        // Преобразуем отзывы, чтобы пометить их как ключи перевода
        const reviewsToInsert = initialReviews.map(review => ({
          name: review.name,
          rating: review.rating,
          text: review.text,
          isTranslationKey: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }));
        
        await db.collection('reviews').insertMany(reviewsToInsert);
        
        return NextResponse.json({
          success: true,
          data: initialReviews.map((review, index) => ({
            id: index.toString(),
            name: review.name,
            rating: review.rating,
            text: review.text,
            isTranslationKey: true
          }))
        });
      } catch (insertError) {
        console.error('Error inserting reviews to MongoDB:', insertError);
        
        // В случае ошибки при сохранении в базу данных, просто возвращаем данные из констант
        return NextResponse.json({
          success: true,
          data: initialReviews.map((review, index) => ({
            id: index.toString(),
            name: review.name,
            rating: review.rating,
            text: review.text,
            isTranslationKey: true
          }))
        });
      }
    }
    
    // Если нет данных ни в базе данных, ни в константах
    return NextResponse.json({
      success: true,
      data: []
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// Добавление нового отзыва
export async function POST(request: NextRequest) {
  try {
    // Проверка аутентификации
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const data = await request.json();
    
    // Проверка наличия обязательных полей
    if (!data.name || !data.text) {
      return NextResponse.json(
        { success: false, message: 'Name and text are required' },
        { status: 400 }
      );
    }
    
    // Создание нового отзыва
    const newReview = {
      name: data.name,
      rating: data.rating || 5,
      text: data.text,
      isTranslationKey: data.isTranslationKey || false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Сохранение в базу данных
    const client = await clientPromise;
    const db = client.db('mitoderm');
    
    const result = await db.collection('reviews').insertOne(newReview);
    
    return NextResponse.json({
      success: true,
      message: 'Review added successfully',
      data: {
        id: result.insertedId.toString(),
        ...newReview
      }
    });
  } catch (error) {
    console.error('Error adding review:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to add review' },
      { status: 500 }
    );
  }
} 