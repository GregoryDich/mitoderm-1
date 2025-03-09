import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/options';
import { SeoSettings } from '@/models/SiteContent';

// Получение SEO-настроек
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Параметры для фильтрации
    const page = searchParams.get('page');
    
    if (page) {
      // Если указана страница, возвращаем настройки для нее
      const seoSettings = await SeoSettings.findOne({ page });
      
      if (!seoSettings) {
        return NextResponse.json(
          { success: false, message: 'SEO settings not found for this page' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        success: true,
        data: seoSettings
      });
    } else {
      // Если страница не указана, возвращаем все настройки
      const allSeoSettings = await SeoSettings.find().sort({ page: 1 });
      
      return NextResponse.json({
        success: true,
        data: allSeoSettings
      });
    }
  } catch (error) {
    console.error('Error fetching SEO settings:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch SEO settings' },
      { status: 500 }
    );
  }
}

// Создание или обновление SEO-настроек
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
    if (!data.page || !data.title || !data.description) {
      return NextResponse.json(
        { success: false, message: 'Page, title and description are required' },
        { status: 400 }
      );
    }
    
    // Проверяем, существуют ли настройки для указанной страницы
    const existingSettings = await SeoSettings.findOne({ page: data.page });
    
    if (existingSettings) {
      // Обновляем существующие настройки
      existingSettings.title = data.title;
      existingSettings.description = data.description;
      
      if (data.keywords) {
        existingSettings.keywords = data.keywords;
      }
      
      if (data.ogImage) {
        existingSettings.ogImage = data.ogImage;
      }
      
      if (data.structuredData) {
        existingSettings.structuredData = data.structuredData;
      }
      
      await existingSettings.save();
      
      return NextResponse.json({
        success: true,
        message: 'SEO settings updated successfully',
        data: existingSettings
      });
    } else {
      // Создаем новые настройки
      const newSettings = new SeoSettings({
        page: data.page,
        title: data.title,
        description: data.description,
        keywords: data.keywords || { en: [], ru: [], he: [] },
        ogImage: data.ogImage,
        structuredData: data.structuredData
      });
      
      await newSettings.save();
      
      return NextResponse.json({
        success: true,
        message: 'SEO settings created successfully',
        data: newSettings
      });
    }
  } catch (error) {
    console.error('Error saving SEO settings:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to save SEO settings' },
      { status: 500 }
    );
  }
}

// Удаление SEO-настроек
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
    const page = searchParams.get('page');
    
    if (!page) {
      return NextResponse.json(
        { success: false, message: 'Page is required' },
        { status: 400 }
      );
    }
    
    // Удаляем настройки для указанной страницы
    const result = await SeoSettings.deleteOne({ page });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'SEO settings not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'SEO settings deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting SEO settings:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete SEO settings' },
      { status: 500 }
    );
  }
} 