import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb/mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/options';

// Удаление изображений До/После
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
        { success: false, message: 'Gallery item ID is required' },
        { status: 400 }
      );
    }
    
    // Подключаемся к базе данных
    const client = await clientPromise;
    const db = client.db('mitoderm');
    
    // Проверяем, существует ли элемент в базе данных
    let galleryItem;
    try {
      galleryItem = await db.collection('gallery').findOne({ _id: new ObjectId(id) });
    } catch (error) {
      // Если ID не является валидным ObjectId для MongoDB
      galleryItem = await db.collection('gallery').findOne({ id });
    }
    
    if (!galleryItem) {
      return NextResponse.json(
        { success: false, message: 'Gallery item not found' },
        { status: 404 }
      );
    }
    
    // Удаляем файлы из файловой системы
    try {
      const beforeImagePath = path.join(process.cwd(), 'public', galleryItem.beforeImage);
      const afterImagePath = path.join(process.cwd(), 'public', galleryItem.afterImage);
      
      await fs.unlink(beforeImagePath);
      await fs.unlink(afterImagePath);
    } catch (fileError) {
      console.error('Error deleting image files:', fileError);
      // Продолжаем выполнение, так как файлы могут быть уже удалены или находиться в другом месте
    }
    
    // Удаляем запись из базы данных
    try {
      if (ObjectId.isValid(id)) {
        await db.collection('gallery').deleteOne({ _id: new ObjectId(id) });
      } else {
        await db.collection('gallery').deleteOne({ id });
      }
    } catch (dbError) {
      console.error('Error deleting from database:', dbError);
      return NextResponse.json(
        { success: false, message: 'Failed to delete gallery item from database' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Gallery item deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete gallery item' },
      { status: 500 }
    );
  }
} 