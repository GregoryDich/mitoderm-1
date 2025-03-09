import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { promises as fs } from 'fs';
import clientPromise from '@/lib/mongodb/mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/options';

// Получение списка изображений До/После из базы данных и файловой системы
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('mitoderm');
    
    // Попробуем получить данные из MongoDB
    try {
      const galleryItems = await db.collection('gallery')
        .find({})
        .sort({ order: 1 })
        .toArray();
      
      if (galleryItems && galleryItems.length > 0) {
        return NextResponse.json({
          success: true,
          data: galleryItems.map(item => ({
            id: item._id.toString(),
            beforeImage: item.beforeImage,
            afterImage: item.afterImage,
            order: item.order
          }))
        });
      }
    } catch (dbError) {
      console.error('Error fetching from MongoDB:', dbError);
      // Продолжаем выполнение, чтобы попробовать получить данные из файловой системы
    }
    
    // Если в базе данных нет записей, попробуем получить из файловой системы
    const imageDirectory = path.join(
      process.cwd(),
      '/public/images/beforeAfterExamples'
    );
    
    // Проверяем, существует ли директория
    try {
      await fs.access(imageDirectory);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Gallery directory not found' },
        { status: 404 }
      );
    }
    
    // Получаем список файлов
    const imageFilenames = await fs.readdir(imageDirectory);
    
    // Группируем файлы по парам (До/После)
    const galleryItems = [];
    const extractNumber = (item: string): number => {
      return parseInt(item.match(/\d+/)?.[0] || '0', 10);
    };
    
    // Сортируем файлы по номеру
    const sortedFiles = [...imageFilenames].sort((a, b) => {
      return extractNumber(a) - extractNumber(b);
    });
    
    // Группируем файлы по парам
    for (let i = 0; i < sortedFiles.length; i += 2) {
      if (i + 1 < sortedFiles.length) {
        const itemNumber = extractNumber(sortedFiles[i]);
        galleryItems.push({
          id: `item${itemNumber}`,
          beforeImage: `/images/beforeAfterExamples/${sortedFiles[i]}`,
          afterImage: `/images/beforeAfterExamples/${sortedFiles[i + 1]}`,
          order: itemNumber
        });
      }
    }
    
    // Сохраняем данные в MongoDB для будущего использования
    if (galleryItems.length > 0) {
      try {
        await db.collection('gallery').insertMany(
          galleryItems.map(item => ({
            beforeImage: item.beforeImage,
            afterImage: item.afterImage,
            order: item.order,
            createdAt: new Date(),
            updatedAt: new Date()
          }))
        );
      } catch (insertError) {
        console.error('Error inserting gallery items to MongoDB:', insertError);
        // Продолжаем выполнение, так как данные уже получены из файловой системы
      }
    }
    
    return NextResponse.json({
      success: true,
      data: galleryItems
    });
  } catch (error) {
    console.error('Error fetching gallery items:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch gallery items' },
      { status: 500 }
    );
  }
}

// Добавление новых изображений До/После
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

    const formData = await request.formData();
    const beforeImage = formData.get('beforeImage') as File;
    const afterImage = formData.get('afterImage') as File;
    const orderStr = formData.get('order') as string;
    const order = parseInt(orderStr) || 0;

    if (!beforeImage || !afterImage) {
      return NextResponse.json(
        { success: false, message: 'Both before and after images are required' },
        { status: 400 }
      );
    }

    // Создаем уникальные имена файлов
    const beforeFileName = `item${Date.now()}_1.${getFileExtension(beforeImage.name)}`;
    const afterFileName = `item${Date.now()}_2.${getFileExtension(afterImage.name)}`;

    // Пути для сохранения файлов
    const beforeImagePath = path.join(process.cwd(), 'public', 'images', 'beforeAfterExamples', beforeFileName);
    const afterImagePath = path.join(process.cwd(), 'public', 'images', 'beforeAfterExamples', afterFileName);

    // Сохраняем файлы
    const beforeBuffer = Buffer.from(await beforeImage.arrayBuffer());
    const afterBuffer = Buffer.from(await afterImage.arrayBuffer());
    await fs.writeFile(beforeImagePath, beforeBuffer);
    await fs.writeFile(afterImagePath, afterBuffer);

    // Сохраняем информацию в базе данных
    const client = await clientPromise;
    const db = client.db('mitoderm');
    
    const result = await db.collection('gallery').insertOne({
      beforeImage: `/images/beforeAfterExamples/${beforeFileName}`,
      afterImage: `/images/beforeAfterExamples/${afterFileName}`,
      order,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return NextResponse.json({
      success: true,
      message: 'Gallery item added successfully',
      data: {
        id: result.insertedId.toString(),
        beforeImage: `/images/beforeAfterExamples/${beforeFileName}`,
        afterImage: `/images/beforeAfterExamples/${afterFileName}`,
        order
      }
    });
  } catch (error) {
    console.error('Error adding gallery item:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to add gallery item' },
      { status: 500 }
    );
  }
}

// Функция для получения расширения файла
function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts[parts.length - 1];
} 