'use client';
import { FC } from 'react';
import { useTranslations } from 'next-intl';
import styles from './BlogManager.module.scss';

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

interface BlogPostListProps {
  posts: BlogPost[];
  isLoading: boolean;
  onEdit: (post: BlogPost) => void;
  onDelete: (postId: string) => void;
  currentPage: number;
  totalPages: number;
  onChangePage: (page: number) => void;
}

const BlogPostList: FC<BlogPostListProps> = ({
  posts,
  isLoading,
  onEdit,
  onDelete,
  currentPage,
  totalPages,
  onChangePage
}) => {
  const t = useTranslations('admin');
  
  // Если загрузка, показываем индикатор загрузки
  if (isLoading) {
    return <div className={styles.loading}>{t('loadingBlogPosts')}</div>;
  }
  
  // Если нет статей, показываем сообщение
  if (posts.length === 0) {
    return <div className={styles.emptyState}>{t('noBlogPosts')}</div>;
  }
  
  // Форматирование даты
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  // Генерация кнопок пагинации
  const renderPagination = () => {
    const pages = [];
    
    // Кнопка "Предыдущая"
    pages.push(
      <button
        key="prev"
        className={styles.pageButton}
        onClick={() => onChangePage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &laquo;
      </button>
    );
    
    // Кнопки с номерами страниц
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          className={`${styles.pageButton} ${currentPage === i ? styles.active : ''}`}
          onClick={() => onChangePage(i)}
        >
          {i}
        </button>
      );
    }
    
    // Кнопка "Следующая"
    pages.push(
      <button
        key="next"
        className={styles.pageButton}
        onClick={() => onChangePage(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        &raquo;
      </button>
    );
    
    return pages;
  };
  
  return (
    <div className={styles.postList}>
      {posts.map((post) => (
        <div key={post._id} className={styles.postItem}>
          <div className={styles.postInfo}>
            <h3 className={styles.postTitle}>{post.title.en}</h3>
            <div className={styles.postMeta}>
              <span className={`${styles.postStatus} ${styles[post.status]}`}>
                {post.status === 'draft' ? t('draft') : t('published')}
              </span>
              {post.publishedAt && (
                <span>{t('publishedAt')}: {formatDate(post.publishedAt)}</span>
              )}
              <span>{t('views')}: {post.views}</span>
            </div>
          </div>
          <div className={styles.postActions}>
            <button
              className={styles.editButton}
              onClick={() => onEdit(post)}
              aria-label={t('edit')}
            >
              {t('edit')}
            </button>
            <button
              className={styles.deleteButton}
              onClick={() => onDelete(post._id)}
              aria-label={t('delete')}
            >
              {t('delete')}
            </button>
          </div>
        </div>
      ))}
      
      {totalPages > 1 && (
        <div className={styles.pagination}>
          {renderPagination()}
        </div>
      )}
    </div>
  );
};

export default BlogPostList; 