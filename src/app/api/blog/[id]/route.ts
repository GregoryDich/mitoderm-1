import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import BlogPost from '@/models/BlogPost';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/options';
import { createSlug } from '@/utils/helpers';
import { PageView } from '@/models/Analytics';

// Получение отдельной статьи блога
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Проверяем, является ли id ObjectId или slug
    let post;
    
    if (ObjectId.isValid(id)) {
      post = await BlogPost.findById(id);
    } else {
      // Ищем по slug в любом из языков
      post = await BlogPost.findOne({
        $or: [
          { 'slug.en': id },
          { 'slug.ru': id },
          { 'slug.he': id }
        ]
      });
    }
    
    if (!post) {
      return NextResponse.json(
        { success: false, message: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    // Проверяем, может ли пользователь просматривать черновики
    if (post.status === 'draft') {
      const session = await getServerSession(authOptions);
      if (!session || session.user.role !== 'admin') {
        return NextResponse.json(
          { success: false, message: 'Unauthorized to view draft' },
          { status: 403 }
        );
      }
    }
    
    // Увеличиваем счетчик просмотров
    if (post.status === 'published') {
      post.views += 1;
      await post.save();
      
      // Записываем просмотр в аналитику
      try {
        const requestHeaders = new Headers(request.headers);
        
        await PageView.create({
          path: request.url,
          referer: requestHeaders.get('referer') || '',
          userAgent: requestHeaders.get('user-agent') || '',
          ip: requestHeaders.get('x-forwarded-for') || request.ip || '',
          language: requestHeaders.get('accept-language')?.split(',')[0] || 'en',
          timestamp: new Date()
        });
      } catch (analyticsError) {
        console.error('Error saving analytics:', analyticsError);
        // Продолжаем выполнение даже при ошибке аналитики
      }
    }
    
    return NextResponse.json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}

// Обновление статьи блога
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Проверка авторизации
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { id } = params;
    const data = await request.json();
    
    // Проверяем, существует ли пост
    const post = await BlogPost.findById(id);
    
    if (!post) {
      return NextResponse.json(
        { success: false, message: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    // Обновляем поля, если они предоставлены
    if (data.title) {
      post.title = data.title;
      
      // Обновляем slug, если не предоставлен явно
      if (!data.slug) {
        Object.entries(data.title).forEach(([locale, title]) => {
          post.slug[locale] = createSlug(title as string);
        });
      }
    }
    
    if (data.slug) {
      post.slug = data.slug;
    }
    
    if (data.content) {
      post.content = data.content;
    }
    
    if (data.excerpt) {
      post.excerpt = data.excerpt;
    }
    
    if (data.featuredImage) {
      post.featuredImage = data.featuredImage;
    }
    
    if (data.images) {
      post.images = data.images;
    }
    
    if (data.tags) {
      post.tags = data.tags;
    }
    
    if (data.categories) {
      post.categories = data.categories;
    }
    
    if (data.seo) {
      post.seo = { ...post.seo, ...data.seo };
    }
    
    // Если статус изменяется с черновика на опубликовано, устанавливаем дату публикации
    if (data.status && data.status === 'published' && post.status === 'draft') {
      post.publishedAt = new Date();
    }
    
    if (data.status) {
      post.status = data.status;
    }
    
    // Сохраняем обновленный пост
    await post.save();
    
    return NextResponse.json({
      success: true,
      message: 'Blog post updated successfully',
      data: {
        id: post._id.toString(),
        title: post.title,
        slug: post.slug,
        status: post.status
      }
    });
  } catch (error) {
    console.error('Error updating blog post:', error);
    
    // Проверяем тип ошибки
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: 'Slug already exists. Please use a different title or provide a custom slug.' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: 'Failed to update blog post' },
      { status: 500 }
    );
  }
}

// Удаление статьи блога
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Проверка авторизации
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { id } = params;
    
    // Проверяем, существует ли пост
    const post = await BlogPost.findById(id);
    
    if (!post) {
      return NextResponse.json(
        { success: false, message: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    // Удаляем пост
    await BlogPost.findByIdAndDelete(id);
    
    return NextResponse.json({
      success: true,
      message: 'Blog post deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
} 