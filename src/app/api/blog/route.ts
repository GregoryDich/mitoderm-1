import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import BlogPost, { IBlogPost } from '@/models/BlogPost';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/options';
import { createSlug } from '@/utils/helpers';

// Получение списка статей блога
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Параметры для фильтрации и пагинации
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') || 'published';
    const tag = searchParams.get('tag');
    const category = searchParams.get('category');
    const locale = searchParams.get('locale') || 'en';
    
    // Создаем объект для фильтрации
    const filter: any = {};
    
    // Фильтр по статусу
    if (status) {
      // Если пользователь не админ, то показываем только опубликованные статьи
      const session = await getServerSession(authOptions);
      if (!session || session.user.role !== 'admin') {
        filter.status = 'published';
      } else if (status !== 'all') {
        filter.status = status;
      }
    }
    
    // Фильтр по тегу
    if (tag) {
      filter.tags = tag;
    }
    
    // Фильтр по категории
    if (category) {
      filter.categories = category;
    }
    
    // Вычисляем пропуск для пагинации
    const skip = (page - 1) * limit;
    
    // Получаем общее количество постов с заданными фильтрами
    const total = await BlogPost.countDocuments(filter);
    
    // Получаем посты с пагинацией и сортировкой по дате публикации
    const posts = await BlogPost.find(filter)
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select(`title content excerpt featuredImage slug status tags categories author publishedAt createdAt views seo`);
    
    // Формируем информацию о пагинации
    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;
    
    // Возвращаем результат
    return NextResponse.json({
      success: true,
      data: {
        posts,
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
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

// Создание новой статьи блога
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
    
    // Получаем данные из запроса
    const data = await request.json();
    
    // Проверяем обязательные поля
    if (!data.title || !data.content || !data.excerpt || !data.featuredImage) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Генерируем slug для каждого языка, если он не указан
    const slugs: Record<string, string> = {};
    Object.entries(data.title).forEach(([locale, title]) => {
      slugs[locale] = data.slug?.[locale] || createSlug(title as string);
    });
    
    // Создаем новый пост блога
    const newPost = new BlogPost({
      ...data,
      slug: slugs,
      author: data.author || session.user.name || 'Admin',
      publishedAt: data.status === 'published' ? new Date() : null
    });
    
    // Сохраняем пост в базу данных
    await newPost.save();
    
    return NextResponse.json({
      success: true,
      message: 'Blog post created successfully',
      data: {
        id: newPost._id.toString(),
        title: newPost.title,
        slug: newPost.slug
      }
    });
  } catch (error) {
    console.error('Error creating blog post:', error);
    
    // Проверяем тип ошибки
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: 'Slug already exists. Please use a different title or provide a custom slug.' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: 'Failed to create blog post' },
      { status: 500 }
    );
  }
} 