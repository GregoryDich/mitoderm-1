import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/options';
import { PageView, FormSubmission } from '@/models/Analytics';
import BlogPost from '@/models/BlogPost';

// Получение статистики
export async function GET(request: NextRequest) {
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
    
    // Параметры для фильтрации
    const period = searchParams.get('period') || '7days'; // 7days, 30days, 90days, all
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');
    
    // Определяем диапазон дат
    const endDate = endDateParam ? new Date(endDateParam) : new Date();
    let startDate: Date;
    
    if (startDateParam) {
      startDate = new Date(startDateParam);
    } else {
      startDate = new Date();
      
      if (period === '7days') {
        startDate.setDate(startDate.getDate() - 7);
      } else if (period === '30days') {
        startDate.setDate(startDate.getDate() - 30);
      } else if (period === '90days') {
        startDate.setDate(startDate.getDate() - 90);
      } else {
        // Для 'all' устанавливаем дату на год назад
        startDate.setFullYear(startDate.getFullYear() - 1);
      }
    }
    
    // Формируем фильтр по дате
    const dateFilter = {
      timestamp: {
        $gte: startDate,
        $lte: endDate
      }
    };
    
    // Получаем общее количество просмотров страниц
    const totalPageViews = await PageView.countDocuments(dateFilter);
    
    // Получаем страницы с наибольшим количеством просмотров
    const pageViewsByPath = await PageView.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$path', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    // Получаем статистику по языкам
    const pageViewsByLanguage = await PageView.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$language', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Получаем статистику по дням
    const pageViewsByDay = await PageView.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Получаем общее количество отправленных форм
    const totalFormSubmissions = await FormSubmission.countDocuments(dateFilter);
    
    // Получаем статистику по типам форм
    const formSubmissionsByType = await FormSubmission.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$formType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Получаем статистику успешных и неуспешных отправок форм
    const formSubmissionsByStatus = await FormSubmission.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$successful', count: { $sum: 1 } } }
    ]);
    
    // Получаем статистику по статьям блога
    const blogPostsViews = await BlogPost.find()
      .sort({ views: -1 })
      .limit(10)
      .select('title slug views');
    
    // Формируем и возвращаем результат
    return NextResponse.json({
      success: true,
      data: {
        period,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        pageViews: {
          total: totalPageViews,
          byPath: pageViewsByPath,
          byLanguage: pageViewsByLanguage,
          byDay: pageViewsByDay
        },
        forms: {
          total: totalFormSubmissions,
          byType: formSubmissionsByType,
          byStatus: formSubmissionsByStatus
        },
        blog: {
          topPosts: blogPostsViews
        }
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}

// Запись события просмотра страницы
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    if (!data.path) {
      return NextResponse.json(
        { success: false, message: 'Path is required' },
        { status: 400 }
      );
    }
    
    const requestHeaders = new Headers(request.headers);
    
    // Создаем запись о просмотре страницы
    await PageView.create({
      path: data.path,
      referer: requestHeaders.get('referer') || data.referer || '',
      userAgent: requestHeaders.get('user-agent') || data.userAgent || '',
      ip: requestHeaders.get('x-forwarded-for') || request.ip || data.ip || '',
      language: data.language || requestHeaders.get('accept-language')?.split(',')[0] || 'en',
      timestamp: new Date()
    });
    
    return NextResponse.json({
      success: true,
      message: 'Page view recorded successfully'
    });
  } catch (error) {
    console.error('Error recording page view:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to record page view' },
      { status: 500 }
    );
  }
} 