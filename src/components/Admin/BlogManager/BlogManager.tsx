'use client';
import { FC, useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import styles from './BlogManager.module.scss';
import ErrorMessage from '@/components/Shared/ErrorMessage/ErrorMessage';
import BlogPostList from './BlogPostList';
import BlogPostEditor from './BlogPostEditor';

interface BlogPost {
  _id: string;
  title: Record<string, string>;
  slug: Record<string, string>;
  content: Record<string, string>;
  excerpt: Record<string, string>;
  featuredImage: string;
  status: 'draft' | 'published';
  publishedAt?: string;
  views: number;
}

const BlogManager: FC = () => {
  const t = useTranslations('admin');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [messageType, setMessageType] = useState<'error' | 'success' | 'info'>('info');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  // Загрузка списка статей при монтировании компонента и изменении страницы
  useEffect(() => {
    fetchPosts();
  }, [currentPage]);
  
  // Функция для загрузки списка статей
  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/blog?page=${currentPage}&limit=10`);
      const data = await response.json();
      
      if (data.success) {
        setPosts(data.data.posts);
        setTotalPages(data.data.pagination.totalPages);
      } else {
        throw new Error(data.message || 'Failed to fetch blog posts');
      }
      
      setErrorMessage('');
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      setMessageType('error');
      setErrorMessage(t('errorFetchingBlogPosts'));
    } finally {
      setIsLoading(false);
    }
  };
  
  // Создание новой статьи
  const handleCreatePost = () => {
    setSelectedPost(null);
    setIsCreating(true);
  };
  
  // Редактирование статьи
  const handleEditPost = (post: BlogPost) => {
    setSelectedPost(post);
    setIsCreating(false);
  };
  
  // Удаление статьи
  const handleDeletePost = async (postId: string) => {
    if (window.confirm(t('confirmDeleteBlogPost'))) {
      try {
        const response = await fetch(`/api/blog/${postId}`, {
          method: 'DELETE',
        });
        
        const data = await response.json();
        
        if (data.success) {
          // Обновляем список статей
          setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
          
          setMessageType('success');
          setErrorMessage(t('blogPostDeleted'));
          
          // Сбрасываем выбранную статью, если она была удалена
          if (selectedPost && selectedPost._id === postId) {
            setSelectedPost(null);
            setIsCreating(false);
          }
        } else {
          throw new Error(data.message || 'Failed to delete blog post');
        }
      } catch (error) {
        console.error('Error deleting blog post:', error);
        setMessageType('error');
        setErrorMessage(t('errorDeletingBlogPost'));
      }
    }
  };
  
  // Обработка сохранения статьи (создание или обновление)
  const handleSavePost = async (postData: any) => {
    try {
      let response;
      
      if (isCreating) {
        // Создание новой статьи
        response = await fetch('/api/blog', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData),
        });
      } else if (selectedPost) {
        // Обновление существующей статьи
        response = await fetch(`/api/blog/${selectedPost._id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData),
        });
      } else {
        throw new Error('Invalid operation');
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Обновляем список статей
        fetchPosts();
        
        // Сбрасываем выбранную статью
        setSelectedPost(null);
        setIsCreating(false);
        
        setMessageType('success');
        setErrorMessage(isCreating ? t('blogPostCreated') : t('blogPostUpdated'));
      } else {
        throw new Error(data.message || 'Failed to save blog post');
      }
    } catch (error) {
      console.error('Error saving blog post:', error);
      setMessageType('error');
      setErrorMessage(t('errorSavingBlogPost'));
    }
  };
  
  // Отмена редактирования
  const handleCancel = () => {
    setSelectedPost(null);
    setIsCreating(false);
  };
  
  // Изменение страницы
  const handleChangePage = (page: number) => {
    setCurrentPage(page);
  };
  
  return (
    <div className={styles.container}>
      <h2 className={styles.sectionTitle}>{t('manageBlog')}</h2>
      
      {errorMessage && (
        <ErrorMessage message={errorMessage} type={messageType} />
      )}
      
      {/* Если не редактируем и не создаем статью, показываем список */}
      {!selectedPost && !isCreating ? (
        <>
          <div className={styles.actionButtons}>
            <button 
              onClick={handleCreatePost}
              className={styles.createButton}
            >
              {t('createNewBlogPost')}
            </button>
          </div>
          
          <BlogPostList 
            posts={posts}
            isLoading={isLoading}
            onEdit={handleEditPost}
            onDelete={handleDeletePost}
            currentPage={currentPage}
            totalPages={totalPages}
            onChangePage={handleChangePage}
          />
        </>
      ) : (
        /* Если редактируем или создаем статью, показываем редактор */
        <BlogPostEditor 
          post={selectedPost}
          isCreating={isCreating}
          onSave={handleSavePost}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default BlogManager; 