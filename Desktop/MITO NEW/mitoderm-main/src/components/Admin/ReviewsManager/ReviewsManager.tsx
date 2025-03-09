'use client';
import { FC, useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import styles from './ReviewsManager.module.scss';
import ErrorMessage from '@/components/Shared/ErrorMessage/ErrorMessage';
import { ReviewType } from '@/types';

interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  isTranslationKey?: boolean;
}

const ReviewsManager: FC = () => {
  const t = useTranslations('admin');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [messageType, setMessageType] = useState<'error' | 'success' | 'info'>('info');
  
  // Состояние для нового отзыва
  const [newReview, setNewReview] = useState<{
    name: string;
    rating: number;
    text: string;
    isTranslationKey: boolean;
  }>({
    name: '',
    rating: 5,
    text: '',
    isTranslationKey: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Загрузка списка отзывов при монтировании компонента
  useEffect(() => {
    fetchReviews();
  }, []);

  // Функция для загрузки списка отзывов
  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/reviews');
      const data = await response.json();
      
      if (data.success) {
        setReviews(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch reviews');
      }
      
      setErrorMessage('');
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setMessageType('error');
      setErrorMessage(t('errorFetchingReviews'));
    } finally {
      setIsLoading(false);
    }
  };

  // Обработчик изменения полей формы
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setNewReview(prev => ({
        ...prev,
        [name]: target.checked
      }));
    } else {
      setNewReview(prev => ({
        ...prev,
        [name]: name === 'rating' ? parseInt(value) || 5 : value
      }));
    }
  };

  // Обработчик отправки формы
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!newReview.name || !newReview.text) {
      setMessageType('error');
      setErrorMessage(t('allFieldsRequired'));
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newReview),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to add review');
      }
      
      // Добавляем новый отзыв в список
      setReviews(prev => [data.data, ...prev]);
      
      // Сбрасываем форму
      setNewReview({
        name: '',
        rating: 5,
        text: '',
        isTranslationKey: false
      });
      
      // Показываем сообщение об успехе
      setMessageType('success');
      setErrorMessage(t('reviewAdded'));
      
      // Через 3 секунды убираем сообщение
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
      
    } catch (error) {
      console.error('Error adding review:', error);
      setMessageType('error');
      setErrorMessage(t('errorAddingReview'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Функция для удаления отзыва
  const handleDeleteReview = async (id: string) => {
    if (window.confirm(t('confirmDeleteReview'))) {
      try {
        const response = await fetch(`/api/reviews/${id}`, {
          method: 'DELETE',
        });
        
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.message || 'Failed to delete review');
        }
        
        // Удаляем отзыв из списка
        setReviews(prev => prev.filter(review => review.id !== id));
        
        setMessageType('success');
        setErrorMessage(t('reviewDeleted'));
        
        // Через 3 секунды убираем сообщение
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      } catch (error) {
        console.error('Error deleting review:', error);
        setMessageType('error');
        setErrorMessage(t('errorDeletingReview'));
      }
    }
  };

  // Функция для отображения звездочек рейтинга
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? styles.starFilled : styles.starEmpty}>
        ★
      </span>
    ));
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.sectionTitle}>{t('manageReviews')}</h2>
      
      {errorMessage && (
        <ErrorMessage message={errorMessage} type={messageType} />
      )}
      
      {/* Форма добавления нового отзыва */}
      <form onSubmit={handleSubmit} className={styles.reviewForm}>
        <h3 className={styles.formTitle}>{t('addNewReview')}</h3>
        
        <div className={styles.formGroup}>
          <label htmlFor="name">{t('reviewName')}</label>
          <input
            type="text"
            id="name"
            name="name"
            value={newReview.name}
            onChange={handleInputChange}
            placeholder={t('reviewNamePlaceholder')}
            className={styles.textInput}
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="rating">{t('reviewRating')}</label>
          <div className={styles.ratingInput}>
            {[1, 2, 3, 4, 5].map((star) => (
              <label key={star} className={styles.starLabel}>
                <input
                  type="radio"
                  name="rating"
                  value={star}
                  checked={newReview.rating === star}
                  onChange={handleInputChange}
                  className={styles.starInput}
                />
                <span className={star <= newReview.rating ? styles.starFilled : styles.starEmpty}>
                  ★
                </span>
              </label>
            ))}
          </div>
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="text">{t('reviewText')}</label>
          <textarea
            id="text"
            name="text"
            value={newReview.text}
            onChange={handleInputChange}
            placeholder={t('reviewTextPlaceholder')}
            className={styles.textArea}
            rows={4}
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="isTranslationKey"
              checked={newReview.isTranslationKey}
              onChange={(e) => setNewReview(prev => ({
                ...prev,
                isTranslationKey: e.target.checked
              }))}
              className={styles.checkbox}
            />
            <span>Это ключ перевода</span>
          </label>
        </div>
        
        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? t('adding') : t('addReview')}
        </button>
      </form>
      
      {/* Список существующих отзывов */}
      <div className={styles.reviewsList}>
        <h3 className={styles.listTitle}>{t('existingReviews')}</h3>
        
        {isLoading ? (
          <div className={styles.loading}>{t('loadingReviews')}</div>
        ) : reviews.length === 0 ? (
          <div className={styles.emptyState}>{t('noReviews')}</div>
        ) : (
          <div className={styles.reviewsGrid}>
            {reviews.map((review) => (
              <div key={review.id} className={styles.reviewItem}>
                <div className={styles.reviewHeader}>
                  <h4 className={styles.reviewName}>
                    {review.isTranslationKey ? t(review.name) : review.name}
                    {review.isTranslationKey && <span className={styles.translationBadge}>Ключ перевода</span>}
                  </h4>
                  <button
                    onClick={() => handleDeleteReview(review.id)}
                    className={styles.deleteButton}
                    aria-label={t('delete')}
                  >
                    ×
                  </button>
                </div>
                <div className={styles.reviewRating}>
                  {renderStars(review.rating)}
                </div>
                <p className={styles.reviewText}>
                  {review.isTranslationKey ? t(review.text) : review.text}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsManager; 