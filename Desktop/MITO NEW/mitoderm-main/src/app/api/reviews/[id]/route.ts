import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb/mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/options';

// Удаление отзыва
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Проверка аутентификации
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Review ID is required' },
        { status: 400 }
      );
    }
    
    // Подключаемся к базе данных
    const client = await clientPromise;
    const db = client.db('mitoderm');
    
    // Проверяем, существует ли отзыв в базе данных
    let review;
    try {
      if (ObjectId.isValid(id)) {
        review = await db.collection('reviews').findOne({ _id: new ObjectId(id) });
      } else {
        // Попробуем найти по строковому ID
        review = await db.collection('reviews').findOne({ id });
      }
    } catch (error) {
      console.error('Error finding review:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to find review' },
        { status: 500 }
      );
    }
    
    if (!review) {
      return NextResponse.json(
        { success: false, message: 'Review not found' },
        { status: 404 }
      );
    }
    
    // Удаляем отзыв из базы данных
    try {
      if (ObjectId.isValid(id)) {
        await db.collection('reviews').deleteOne({ _id: new ObjectId(id) });
      } else {
        await db.collection('reviews').deleteOne({ id });
      }
    } catch (dbError) {
      console.error('Error deleting from database:', dbError);
      return NextResponse.json(
        { success: false, message: 'Failed to delete review from database' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Review deleted successfully',
      data: {
        id: id,
        name: review.name,
        rating: review.rating,
        text: review.text
      }
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete review' },
      { status: 500 }
    );
  }
} 