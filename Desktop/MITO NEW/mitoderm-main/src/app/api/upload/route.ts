import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { promises as fs } from 'fs';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/options';
import sharp from 'sharp';

// Функция для обработки загрузки изображений
export async function POST(request: NextRequest) {
  try {
    // Проверка авторизации
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'blog'; // По умолчанию загружаем в папку blog
    
    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Проверяем тип файла
    const fileType = file.type;
    if (!fileType.startsWith('image/')) {
      return NextResponse.json(
        { success: false, message: 'Only image files are allowed' },
        { status: 400 }
      );
    }

    // Создаем уникальное имя для файла
    const fileName = `${uuidv4()}.${getFileExtension(file.name)}`;
    
    // Создаем папку, если ее нет
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', folder);
    try {
      await fs.access(uploadsDir);
    } catch (error) {
      await fs.mkdir(uploadsDir, { recursive: true });
    }

    // Путь для сохранения файла
    const filePath = path.join(uploadsDir, fileName);
    
    // Сохраняем файл
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Оптимизируем изображение с помощью sharp
    try {
      // Проверяем размер изображения
      const imageMeta = await sharp(buffer).metadata();
      
      // Если изображение больше 1200px по ширине, ресайзим его
      if (imageMeta.width && imageMeta.width > 1200) {
        const optimizedBuffer = await sharp(buffer)
          .resize(1200) // Ограничиваем ширину до 1200px
          .toBuffer();
        
        await fs.writeFile(filePath, optimizedBuffer);
      } else {
        // Если изображение меньше или равно 1200px, сохраняем как есть
        await fs.writeFile(filePath, buffer);
      }
    } catch (sharpError) {
      console.error('Error optimizing image:', sharpError);
      // Если возникла ошибка при оптимизации, сохраняем оригинал
      await fs.writeFile(filePath, buffer);
    }

    // Формируем URL для доступа к изображению
    const imageUrl = `/uploads/${folder}/${fileName}`;

    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        url: imageUrl,
        fileName,
        size: file.size,
        type: file.type
      }
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

// Функция для получения расширения файла
function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts[parts.length - 1];
} 