'use client';
import { FC, useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import styles from './SeoManager.module.scss';

interface SeoSettings {
  _id: string;
  page: string;
  title: Record<string, string>;
  description: Record<string, string>;
  keywords: Record<string, string[]>;
  ogImage?: string;
  structuredData?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

interface SeoFormData {
  _id?: string;
  page: string;
  title: Record<string, string>;
  description: Record<string, string>;
  keywords: Record<string, string[]>;
  ogImage?: string;
  structuredData?: string;
}

const SeoManager: FC = () => {
  const t = useTranslations('admin');
  const [isLoading, setIsLoading] = useState(true);
  const [seoSettings, setSeoSettings] = useState<SeoSettings[]>([]);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFormData, setCurrentFormData] = useState<SeoFormData>({
    page: '',
    title: { en: '', ru: '', he: '' },
    description: { en: '', ru: '', he: '' },
    keywords: { en: [], ru: [], he: [] },
    ogImage: '',
    structuredData: '{}'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formError, setFormError] = useState('');
  const [activeTab, setActiveTab] = useState('en');
  const [keywords, setKeywords] = useState({ en: '', ru: '', he: '' });

  useEffect(() => {
    fetchSeoSettings();
  }, []);

  const fetchSeoSettings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/seo');
      const data = await response.json();
      
      if (data.success) {
        setSeoSettings(data.data);
      } else {
        setError(t('errorFetchingSEO'));
      }
    } catch (err) {
      console.error('Error fetching SEO settings:', err);
      setError(t('errorFetchingSEO'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSeo = () => {
    setCurrentFormData({
      page: '',
      title: { en: '', ru: '', he: '' },
      description: { en: '', ru: '', he: '' },
      keywords: { en: [], ru: [], he: [] },
      ogImage: '',
      structuredData: '{}'
    });
    setKeywords({ en: '', ru: '', he: '' });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEditSeo = (item: SeoSettings) => {
    const keywordsStr = {
      en: (item.keywords.en || []).join(', '),
      ru: (item.keywords.ru || []).join(', '),
      he: (item.keywords.he || []).join(', ')
    };
    
    setCurrentFormData({
      _id: item._id,
      page: item.page,
      title: { ...item.title },
      description: { ...item.description },
      keywords: { ...item.keywords },
      ogImage: item.ogImage || '',
      structuredData: item.structuredData ? JSON.stringify(item.structuredData, null, 2) : '{}'
    });
    setKeywords(keywordsStr);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDeleteSeo = async (id: string) => {
    if (window.confirm(t('confirmDeleteSEO'))) {
      try {
        const response = await fetch(`/api/seo?id=${id}`, {
          method: 'DELETE'
        });
        const data = await response.json();
        
        if (data.success) {
          alert(t('seoDeleted'));
          fetchSeoSettings();
        } else {
          alert(t('errorDeletingSEO'));
        }
      } catch (err) {
        console.error('Error deleting SEO settings:', err);
        alert(t('errorDeletingSEO'));
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleMultilingualInputChange = (field: 'title' | 'description', locale: string, value: string) => {
    setCurrentFormData(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [locale]: value
      }
    }));
  };

  const handleKeywordsChange = (locale: string, value: string) => {
    setKeywords(prev => ({
      ...prev,
      [locale]: value
    }));
    
    // Преобразуем строку ключевых слов в массив
    const keywordsArray = value
      .split(',')
      .map(k => k.trim())
      .filter(k => k);
    
    setCurrentFormData(prev => ({
      ...prev,
      keywords: {
        ...prev.keywords,
        [locale]: keywordsArray
      }
    }));
  };

  const validateStructuredData = (jsonString: string): boolean => {
    try {
      JSON.parse(jsonString);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleStructuredDataChange = (value: string) => {
    setCurrentFormData(prev => ({
      ...prev,
      structuredData: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    
    // Валидация формы
    if (!currentFormData.page) {
      setFormError(t('pagepathRequired'));
      return;
    }
    
    // Валидация структурированных данных
    if (currentFormData.structuredData && !validateStructuredData(currentFormData.structuredData)) {
      setFormError(t('invalidStructuredData'));
      return;
    }
    
    try {
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing ? `/api/seo?id=${currentFormData._id}` : '/api/seo';
      
      // Преобразуем структурированные данные из строки в объект
      const formDataToSend = {
        ...currentFormData,
        structuredData: currentFormData.structuredData ? JSON.parse(currentFormData.structuredData) : undefined
      };
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formDataToSend)
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert(isEditing ? t('seoUpdated') : t('seoCreated'));
        setIsModalOpen(false);
        fetchSeoSettings();
      } else {
        setFormError(t('errorSavingSEO'));
      }
    } catch (err) {
      console.error('Error saving SEO settings:', err);
      setFormError(t('errorSavingSEO'));
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setFormError('');
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.sectionTitle}>{t('manageSEO')}</h2>
      
      <div className={styles.actionButtons}>
        <button 
          className={styles.createButton}
          onClick={handleCreateSeo}
        >
          {t('createNewSEO')}
        </button>
      </div>
      
      {isLoading ? (
        <div className={styles.loading}>{t('loadingSEO')}</div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : seoSettings.length === 0 ? (
        <div className={styles.emptyState}>{t('noSEO')}</div>
      ) : (
        <div className={styles.seoList}>
          <table className={styles.seoTable}>
            <thead>
              <tr>
                <th>{t('pagePath')}</th>
                <th>{t('pageTitle')} (EN)</th>
                <th>{t('pageDescription')} (EN)</th>
                <th>{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {seoSettings.map(item => (
                <tr key={item._id}>
                  <td>{item.page}</td>
                  <td>{item.title.en || '-'}</td>
                  <td className={styles.description}>{item.description.en || '-'}</td>
                  <td className={styles.actions}>
                    <button 
                      className={styles.editButton}
                      onClick={() => handleEditSeo(item)}
                    >
                      {t('edit')}
                    </button>
                    <button 
                      className={styles.deleteButton}
                      onClick={() => handleDeleteSeo(item._id)}
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
            <h3>{isEditing ? t('editSEO') : t('createNewSEO')}</h3>
            
            {formError && <div className={styles.formError}>{formError}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="page">{t('pagePath')}*</label>
                <input
                  type="text"
                  id="page"
                  name="page"
                  value={currentFormData.page}
                  onChange={handleInputChange}
                  placeholder="/path/to/page or /"
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="ogImage">{t('ogImage')}</label>
                <input
                  type="text"
                  id="ogImage"
                  name="ogImage"
                  value={currentFormData.ogImage}
                  onChange={handleInputChange}
                  placeholder="/images/og-image.jpg"
                />
              </div>
              
              <div className={styles.tabs}>
                <button 
                  type="button" 
                  className={`${styles.tabButton} ${activeTab === 'en' ? styles.active : ''}`}
                  onClick={() => handleTabChange('en')}
                >
                  English
                </button>
                <button 
                  type="button" 
                  className={`${styles.tabButton} ${activeTab === 'ru' ? styles.active : ''}`}
                  onClick={() => handleTabChange('ru')}
                >
                  Русский
                </button>
                <button 
                  type="button" 
                  className={`${styles.tabButton} ${activeTab === 'he' ? styles.active : ''}`}
                  onClick={() => handleTabChange('he')}
                >
                  עברית
                </button>
                <button 
                  type="button" 
                  className={`${styles.tabButton} ${activeTab === 'structuredData' ? styles.active : ''}`}
                  onClick={() => handleTabChange('structuredData')}
                >
                  {t('structuredData')}
                </button>
              </div>
              
              <div className={styles.tabContent}>
                {activeTab === 'en' && (
                  <div className={styles.tabPane}>
                    <div className={styles.formGroup}>
                      <label htmlFor="title-en">{t('pageTitle')}</label>
                      <input
                        type="text"
                        id="title-en"
                        value={currentFormData.title.en}
                        onChange={(e) => handleMultilingualInputChange('title', 'en', e.target.value)}
                        placeholder="Page Title (English)"
                      />
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label htmlFor="description-en">{t('pageDescription')}</label>
                      <textarea
                        id="description-en"
                        value={currentFormData.description.en}
                        onChange={(e) => handleMultilingualInputChange('description', 'en', e.target.value)}
                        placeholder="Page Description (English)"
                        rows={3}
                      />
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label htmlFor="keywords-en">{t('pageKeywords')}</label>
                      <input
                        type="text"
                        id="keywords-en"
                        value={keywords.en}
                        onChange={(e) => handleKeywordsChange('en', e.target.value)}
                        placeholder="keyword1, keyword2, keyword3"
                      />
                      <small>Separate keywords with commas</small>
                    </div>
                  </div>
                )}
                
                {activeTab === 'ru' && (
                  <div className={styles.tabPane}>
                    <div className={styles.formGroup}>
                      <label htmlFor="title-ru">{t('pageTitle')}</label>
                      <input
                        type="text"
                        id="title-ru"
                        value={currentFormData.title.ru}
                        onChange={(e) => handleMultilingualInputChange('title', 'ru', e.target.value)}
                        placeholder="Заголовок страницы (Русский)"
                      />
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label htmlFor="description-ru">{t('pageDescription')}</label>
                      <textarea
                        id="description-ru"
                        value={currentFormData.description.ru}
                        onChange={(e) => handleMultilingualInputChange('description', 'ru', e.target.value)}
                        placeholder="Описание страницы (Русский)"
                        rows={3}
                      />
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label htmlFor="keywords-ru">{t('pageKeywords')}</label>
                      <input
                        type="text"
                        id="keywords-ru"
                        value={keywords.ru}
                        onChange={(e) => handleKeywordsChange('ru', e.target.value)}
                        placeholder="ключевое слово1, ключевое слово2, ключевое слово3"
                      />
                      <small>Разделите ключевые слова запятыми</small>
                    </div>
                  </div>
                )}
                
                {activeTab === 'he' && (
                  <div className={styles.tabPane}>
                    <div className={styles.formGroup}>
                      <label htmlFor="title-he">{t('pageTitle')}</label>
                      <input
                        type="text"
                        id="title-he"
                        value={currentFormData.title.he}
                        onChange={(e) => handleMultilingualInputChange('title', 'he', e.target.value)}
                        placeholder="כותרת העמוד (עברית)"
                        dir="rtl"
                      />
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label htmlFor="description-he">{t('pageDescription')}</label>
                      <textarea
                        id="description-he"
                        value={currentFormData.description.he}
                        onChange={(e) => handleMultilingualInputChange('description', 'he', e.target.value)}
                        placeholder="תיאור העמוד (עברית)"
                        rows={3}
                        dir="rtl"
                      />
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label htmlFor="keywords-he">{t('pageKeywords')}</label>
                      <input
                        type="text"
                        id="keywords-he"
                        value={keywords.he}
                        onChange={(e) => handleKeywordsChange('he', e.target.value)}
                        placeholder="מילת מפתח1, מילת מפתח2, מילת מפתח3"
                        dir="rtl"
                      />
                      <small>הפרד מילות מפתח עם פסיקים</small>
                    </div>
                  </div>
                )}
                
                {activeTab === 'structuredData' && (
                  <div className={styles.tabPane}>
                    <div className={styles.formGroup}>
                      <label htmlFor="structuredData">{t('structuredData')} (JSON)</label>
                      <textarea
                        id="structuredData"
                        value={currentFormData.structuredData}
                        onChange={(e) => handleStructuredDataChange(e.target.value)}
                        placeholder='{"@context": "https://schema.org", "@type": "WebPage", ...}'
                        rows={10}
                        className={styles.codeEditor}
                      />
                      <small>Enter valid JSON for structured data</small>
                    </div>
                  </div>
                )}
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

export default SeoManager; 