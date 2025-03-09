'use client';
import { FC, useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import styles from './GalleryManager.module.scss';
import ErrorMessage from '@/components/Shared/ErrorMessage/ErrorMessage';

interface GalleryItem {
  id: string;
  beforeImage: string;
  afterImage: string;
  order: number;
}

const GalleryManager: FC = () => {
  const t = useTranslations('admin');
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [messageType, setMessageType] = useState<'error' | 'success' | 'info'>('info');
  
  // Состояние для новой пары изображений
  const [beforeImage, setBeforeImage] = useState<File | null>(null);
  const [afterImage, setAfterImage] = useState<File | null>(null);
  const [order, setOrder] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);

  // Загрузка списка изображений при монтировании компонента
  useEffect(() => {
    fetchGalleryItems();
  }, []);

  // Функция для загрузки списка изображений
  const fetchGalleryItems = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/gallery');
      const data = await response.json();
      
      if (data.success) {
        setGalleryItems(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch gallery items');
      }
      
      setErrorMessage('');
    } catch (error) {
      console.error('Error fetching gallery items:', error);
      setMessageType('error');
      setErrorMessage(t('errorFetchingGallery'));
    } finally {
      setIsLoading(false);
    }
  };

  // Обработчик изменения файла "До"
  const handleBeforeImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBeforeImage(e.target.files[0]);
    }
  };

  // Обработчик изменения файла "После"
  const handleAfterImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAfterImage(e.target.files[0]);
    }
  };

  // Обработчик изменения порядка
  const handleOrderChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOrder(parseInt(e.target.value) || 0);
  };

  // Обработчик отправки формы
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!beforeImage || !afterImage) {
      setMessageType('error');
      setErrorMessage(t('bothImagesRequired'));
      return;
    }
    
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('beforeImage', beforeImage);
      formData.append('afterImage', afterImage);
      formData.append('order', order.toString());
      
      const response = await fetch('/api/gallery', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to upload images');
      }
      
      // Добавляем новый элемент в список
      setGalleryItems(prev => [...prev, data.data].sort((a, b) => a.order - b.order));
      
      // Сбрасываем форму
      setBeforeImage(null);
      setAfterImage(null);
      setOrder(0);
      
      // Сбрасываем значения input[type="file"]
      const beforeInput = document.getElementById('beforeImage') as HTMLInputElement;
      const afterInput = document.getElementById('afterImage') as HTMLInputElement;
      if (beforeInput) beforeInput.value = '';
      if (afterInput) afterInput.value = '';
      
      // Показываем сообщение об успехе
      setMessageType('success');
      setErrorMessage(t('galleryItemAdded'));
      
      // Через 3 секунды убираем сообщение
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
      
    } catch (error) {
      console.error('Error uploading images:', error);
      setMessageType('error');
      setErrorMessage(t('errorUploadingImages'));
    } finally {
      setIsUploading(false);
    }
  };

  // Функция для удаления элемента галереи
  const handleDeleteItem = async (id: string) => {
    if (window.confirm(t('confirmDeleteGalleryItem'))) {
      try {
        const response = await fetch(`/api/gallery/${id}`, {
          method: 'DELETE',
        });
        
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.message || 'Failed to delete gallery item');
        }
        
        // Удаляем элемент из списка
        setGalleryItems(prev => prev.filter(item => item.id !== id));
        
        setMessageType('success');
        setErrorMessage(t('galleryItemDeleted'));
        
        // Через 3 секунды убираем сообщение
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      } catch (error) {
        console.error('Error deleting gallery item:', error);
        setMessageType('error');
        setErrorMessage(t('errorDeletingGalleryItem'));
      }
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.sectionTitle}>{t('manageGallery')}</h2>
      
      {errorMessage && (
        <ErrorMessage message={errorMessage} type={messageType} />
      )}
      
      {/* Форма добавления новых изображений */}
      <form onSubmit={handleSubmit} className={styles.uploadForm}>
        <h3 className={styles.formTitle}>{t('addNewBeforeAfter')}</h3>
        
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="beforeImage">{t('beforeImage')}</label>
            <input
              type="file"
              id="beforeImage"
              accept="image/*"
              onChange={handleBeforeImageChange}
              className={styles.fileInput}
            />
            {beforeImage && (
              <div className={styles.imagePreview}>
                <img src={URL.createObjectURL(beforeImage)} alt="Before preview" />
              </div>
            )}
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="afterImage">{t('afterImage')}</label>
            <input
              type="file"
              id="afterImage"
              accept="image/*"
              onChange={handleAfterImageChange}
              className={styles.fileInput}
            />
            {afterImage && (
              <div className={styles.imagePreview}>
                <img src={URL.createObjectURL(afterImage)} alt="After preview" />
              </div>
            )}
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="order">{t('displayOrder')}</label>
            <input
              type="number"
              id="order"
              min="1"
              value={order || ''}
              onChange={handleOrderChange}
              placeholder={t('orderPlaceholder')}
              className={styles.numberInput}
            />
          </div>
        </div>
        
        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={isUploading}
        >
          {isUploading ? t('uploading') : t('uploadImages')}
        </button>
      </form>
      
      {/* Список существующих изображений */}
      <div className={styles.galleryList}>
        <h3 className={styles.listTitle}>{t('existingImages')}</h3>
        
        {isLoading ? (
          <div className={styles.loading}>{t('loadingGallery')}</div>
        ) : galleryItems.length === 0 ? (
          <div className={styles.emptyState}>{t('noGalleryItems')}</div>
        ) : (
          <div className={styles.itemsGrid}>
            {galleryItems.map((item) => (
              <div key={item.id} className={styles.galleryItem}>
                <div className={styles.itemHeader}>
                  <span className={styles.itemOrder}>#{item.order}</span>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className={styles.deleteButton}
                    aria-label={t('delete')}
                  >
                    ×
                  </button>
                </div>
                <div className={styles.itemImages}>
                  <div className={styles.itemImage}>
                    <img src={item.beforeImage} alt={`Before ${item.id}`} />
                    <span className={styles.imageLabel}>{t('before')}</span>
                  </div>
                  <div className={styles.itemImage}>
                    <img src={item.afterImage} alt={`After ${item.id}`} />
                    <span className={styles.imageLabel}>{t('after')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryManager; 