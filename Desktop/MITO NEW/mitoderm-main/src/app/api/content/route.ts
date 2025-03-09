import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/options';
import { SiteContent } from '@/models/SiteContent';

// Получение контента сайта
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Параметры для фильтрации
    const section = searchParams.get('section');
    const key = searchParams.get('key');
    
    // Создаем фильтр
    const filter: any = {};
    
    if (section) {
      filter.section = section;
    }
    
    if (key) {
      filter.key = key;
    }
    
    // Выполняем запрос к базе данных
    let contentItems;
    
    if (key && !section) {
      // Если указан только ключ, ищем один элемент
      contentItems = await SiteContent.findOne({ key });
    } else {
      // Иначе ищем все элементы, соответствующие фильтру
      contentItems = await SiteContent.find(filter).sort({ section: 1, key: 1 });
    }
    
    return NextResponse.json({
      success: true,
      data: contentItems
    });
  } catch (error) {
    console.error('Error fetching site content:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch site content' },
      { status: 500 }
    );
  }
}

// Создание или обновление контента сайта
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
    
    const data = await request.json();
    
    // Проверяем обязательные поля
    if (!data.key || !data.section || !data.content) {
      return NextResponse.json(
        { success: false, message: 'Key, section and content are required' },
        { status: 400 }
      );
    }
    
    // Проверяем, существует ли контент с указанным ключом
    const existingContent = await SiteContent.findOne({ key: data.key });
    
    if (existingContent) {
      // Обновляем существующий контент
      existingContent.section = data.section;
      existingContent.content = data.content;
      
      if (data.description !== undefined) {
        existingContent.description = data.description;
      }
      
      if (data.isHTML !== undefined) {
        existingContent.isHTML = data.isHTML;
      }
      
      await existingContent.save();
      
      return NextResponse.json({
        success: true,
        message: 'Content updated successfully',
        data: existingContent
      });
    } else {
      // Создаем новый контент
      const newContent = new SiteContent({
        key: data.key,
        section: data.section,
        content: data.content,
        description: data.description || '',
        isHTML: data.isHTML || false
      });
      
      await newContent.save();
      
      return NextResponse.json({
        success: true,
        message: 'Content created successfully',
        data: newContent
      });
    }
  } catch (error) {
    console.error('Error saving site content:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to save site content' },
      { status: 500 }
    );
  }
}

// Удаление контента сайта
export async function DELETE(request: NextRequest) {
  try {
    // Проверка авторизации
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    
    if (!key) {
      return NextResponse.json(
        { success: false, message: 'Key is required' },
        { status: 400 }
      );
    }
    
    // Удаляем контент с указанным ключом
    const result = await SiteContent.deleteOne({ key });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Content not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Content deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting site content:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete site content' },
      { status: 500 }
    );
  }
} 