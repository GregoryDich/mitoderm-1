'use client';
import { FC, useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import styles from './ContentManager.module.scss';

interface ContentItem {
  _id: string;
  key: string;
  section: string;
  content: Record<string, string>;
  description?: string;
  isHTML: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ContentFormData {
  _id?: string;
  key: string;
  section: string;
  content: Record<string, string>;
  description: string;
  isHTML: boolean;
}

const ContentManager: FC = () => {
  const t = useTranslations('admin');
  const [isLoading, setIsLoading] = useState(true);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFormData, setCurrentFormData] = useState<ContentFormData>({
    key: '',
    section: '',
    content: { en: '', ru: '', he: '' },
    description: '',
    isHTML: false
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchContentItems();
  }, []);

  const fetchContentItems = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/content');
      const data = await response.json();
      
      if (data.success) {
        setContentItems(data.data);
      } else {
        setError(t('errorFetchingContent'));
      }
    } catch (err) {
      console.error('Error fetching content:', err);
      setError(t('errorFetchingContent'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateContent = () => {
    setCurrentFormData({
      key: '',
      section: '',
      content: { en: '', ru: '', he: '' },
      description: '',
      isHTML: false
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEditContent = (item: ContentItem) => {
    setCurrentFormData({
      _id: item._id,
      key: item.key,
      section: item.section,
      content: { ...item.content },
      description: item.description || '',
      isHTML: item.isHTML
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDeleteContent = async (id: string) => {
    if (window.confirm(t('confirmDeleteContent'))) {
      try {
        const response = await fetch(`/api/content?id=${id}`, {
          method: 'DELETE'
        });
        const data = await response.json();
        
        if (data.success) {
          alert(t('contentDeleted'));
          fetchContentItems();
        } else {
          alert(t('errorDeletingContent'));
        }
      } catch (err) {
        console.error('Error deleting content:', err);
        alert(t('errorDeletingContent'));
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContentChange = (locale: string, value: string) => {
    setCurrentFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [locale]: value
      }
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setCurrentFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    
    // Валидация формы
    if (!currentFormData.key || !currentFormData.section) {
      setFormError(t('allFieldsRequired'));
      return;
    }
    
    // Валидация содержимого хотя бы для одного языка
    if (!currentFormData.content.en && !currentFormData.content.ru && !currentFormData.content.he) {
      setFormError(t('contentRequired'));
      return;
    }
    
    try {
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing ? `/api/content?id=${currentFormData._id}` : '/api/content';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(currentFormData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert(isEditing ? t('contentUpdated') : t('contentCreated'));
        setIsModalOpen(false);
        fetchContentItems();
      } else {
        setFormError(t('errorSavingContent'));
      }
    } catch (err) {
      console.error('Error saving content:', err);
      setFormError(t('errorSavingContent'));
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setFormError('');
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.sectionTitle}>{t('manageContent')}</h2>
      
      <div className={styles.actionButtons}>
        <button 
          className={styles.createButton}
          onClick={handleCreateContent}
        >
          {t('createNewContent')}
        </button>
      </div>
      
      {isLoading ? (
        <div className={styles.loading}>{t('loadingContent')}</div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : contentItems.length === 0 ? (
        <div className={styles.emptyState}>{t('noContent')}</div>
      ) : (
        <div className={styles.contentList}>
          <table className={styles.contentTable}>
            <thead>
              <tr>
                <th>{t('contentKey')}</th>
                <th>{t('contentSection')}</th>
                <th>{t('contentDescription')}</th>
                <th>{t('isHTML')}</th>
                <th>{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {contentItems.map(item => (
                <tr key={item._id}>
                  <td>{item.key}</td>
                  <td>{item.section}</td>
                  <td>{item.description || '-'}</td>
                  <td>{item.isHTML ? '✓' : '✗'}</td>
                  <td className={styles.actions}>
                    <button 
                      className={styles.editButton}
                      onClick={() => handleEditContent(item)}
                    >
                      {t('edit')}
                    </button>
                    <button 
                      className={styles.deleteButton}
                      onClick={() => handleDeleteContent(item._id)}
                    >
                      {t('delete')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {isModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>{isEditing ? t('editContent') : t('createNewContent')}</h3>
            
            {formError && <div className={styles.formError}>{formError}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="key">{t('contentKey')}*</label>
                <input
                  type="text"
                  id="key"
                  name="key"
                  value={currentFormData.key}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="section">{t('contentSection')}*</label>
                <input
                  type="text"
                  id="section"
                  name="section"
                  value={currentFormData.section}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="description">{t('contentDescription')}</label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  value={currentFormData.description}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="isHTML"
                    checked={currentFormData.isHTML}
                    onChange={handleCheckboxChange}
                  />
                  {t('isHTML')}
                </label>
              </div>
              
              <div className={styles.formGroup}>
                <label>{t('contentValue')}</label>
                
                <div className={styles.tabsContainer}>
                  <div className={styles.tabs}>
                    <button type="button" className={styles.tabButton}>English</button>
                    <button type="button" className={styles.tabButton}>Русский</button>
                    <button type="button" className={styles.tabButton}>עברית</button>
                  </div>
                  
                  <div className={styles.tabContent}>
                    <div className={styles.tabPane}>
                      <textarea
                        value={currentFormData.content.en}
                        onChange={(e) => handleContentChange('en', e.target.value)}
                        placeholder="English content"
                        rows={5}
                      />
                    </div>
                    
                    <div className={styles.tabPane}>
                      <textarea
                        value={currentFormData.content.ru}
                        onChange={(e) => handleContentChange('ru', e.target.value)}
                        placeholder="Содержимое на русском"
                        rows={5}
                      />
                    </div>
                    
                    <div className={styles.tabPane}>
                      <textarea
                        value={currentFormData.content.he}
                        onChange={(e) => handleContentChange('he', e.target.value)}
                        placeholder="תוכן בעברית"
                        rows={5}
                        dir="rtl"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={styles.buttonGroup}>
                <button type="button" className={styles.cancelButton} onClick={handleCancel}>
                  {t('cancel')}
                </button>
                <button type="submit" className={styles.submitButton}>
                  {isEditing ? t('update') : t('create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentManager; 