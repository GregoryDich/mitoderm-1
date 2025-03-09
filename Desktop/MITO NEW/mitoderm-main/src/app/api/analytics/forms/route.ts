import { NextRequest, NextResponse } from 'next/server';
import { FormSubmission } from '@/models/Analytics';

// Запись события отправки формы
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    if (!data.formType || !data.data) {
      return NextResponse.json(
        { success: false, message: 'Form type and data are required' },
        { status: 400 }
      );
    }
    
    const requestHeaders = new Headers(request.headers);
    
    // Создаем запись об отправке формы
    await FormSubmission.create({
      formType: data.formType,
      data: data.data,
      successful: data.successful !== false, // По умолчанию true
      ip: requestHeaders.get('x-forwarded-for') || request.ip || data.ip || '',
      userAgent: requestHeaders.get('user-agent') || data.userAgent || '',
      language: data.language || requestHeaders.get('accept-language')?.split(',')[0] || 'en',
      timestamp: new Date()
    });
    
    return NextResponse.json({
      success: true,
      message: 'Form submission recorded successfully'
    });
  } catch (error) {
    console.error('Error recording form submission:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to record form submission' },
      { status: 500 }
    );
  }
}

// Получение подробных данных по формам (только для администраторов)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Параметры для фильтрации и пагинации
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const formType = searchParams.get('formType');
    const successful = searchParams.get('successful');
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');
    
    // Создаем фильтр
    const filter: any = {};
    
    // Фильтр по типу формы
    if (formType) {
      filter.formType = formType;
    }
    
    // Фильтр по успешности
    if (successful !== null && successful !== undefined) {
      filter.successful = successful === 'true';
    }
    
    // Фильтр по дате
    if (startDateParam || endDateParam) {
      filter.timestamp = {};
      
      if (startDateParam) {
        filter.timestamp.$gte = new Date(startDateParam);
      }
      
      if (endDateParam) {
        filter.timestamp.$lte = new Date(endDateParam);
      }
    }
    
    // Вычисляем пропуск для пагинации
    const skip = (page - 1) * limit;
    
    // Получаем общее количество записей с заданными фильтрами
    const total = await FormSubmission.countDocuments(filter);
    
    // Получаем записи с пагинацией и сортировкой по дате
    const submissions = await FormSubmission.find(filter)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);
    
    // Формируем информацию о пагинации
    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;
    
    // Возвращаем результат
    return NextResponse.json({
      success: true,
      data: {
        submissions,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasMore
        }
      }
    });
  } catch (error) {
    console.error('Error fetching form submissions:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch form submissions' },
      { status: 500 }
    );
  }
} 