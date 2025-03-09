'use client';
import { FC, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useSession, signOut } from 'next-auth/react';
import styles from './AdminDashboard.module.scss';
import GalleryManager from '../GalleryManager/GalleryManager';
import ReviewsManager from '../ReviewsManager/ReviewsManager';
import BlogManager from '../BlogManager/BlogManager';
import ContentManager from '../ContentManager/ContentManager';
import SeoManager from '../SeoManager/SeoManager';
import AnalyticsManager from '../AnalyticsManager/AnalyticsManager';

type TabType = 'gallery' | 'reviews' | 'blog' | 'content' | 'seo' | 'analytics';

const AdminDashboard: FC = () => {
  const t = useTranslations('admin');
  const router = useRouter();
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<TabType>('gallery');

  // Проверяем, авторизован ли пользователь
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin');
    } else if (status === 'authenticated' && session?.user?.role !== 'admin') {
      // Если пользователь не администратор, перенаправляем на страницу входа
      signOut({ redirect: false });
      router.push('/admin');
    }
  }, [router, session, status]);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/admin');
  };

  // Если статус загрузки или пользователь не авторизован, показываем индикатор загрузки
  if (status === 'loading' || status === 'unauthenticated') {
    return <div className={styles.loading}>{t('loading')}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t('dashboardTitle')}</h1>
        <div className={styles.userInfo}>
          <span className={styles.userName}>{session?.user?.name || session?.user?.email}</span>
          <button onClick={handleLogout} className={styles.logoutButton}>
            {t('logout')}
          </button>
        </div>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tabButton} ${activeTab === 'gallery' ? styles.active : ''}`}
          onClick={() => setActiveTab('gallery')}
        >
          {t('galleryTab')}
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'reviews' ? styles.active : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          {t('reviewsTab')}
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'blog' ? styles.active : ''}`}
          onClick={() => setActiveTab('blog')}
        >
          {t('blogTab')}
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'content' ? styles.active : ''}`}
          onClick={() => setActiveTab('content')}
        >
          {t('contentTab')}
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'seo' ? styles.active : ''}`}
          onClick={() => setActiveTab('seo')}
        >
          {t('seoTab')}
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'analytics' ? styles.active : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          {t('analyticsTab')}
        </button>
      </div>

      <div className={styles.tabContent}>
        {activeTab === 'gallery' && <GalleryManager />}
        {activeTab === 'reviews' && <ReviewsManager />}
        {activeTab === 'blog' && <BlogManager />}
        {activeTab === 'content' && <ContentManager />}
        {activeTab === 'seo' && <SeoManager />}
        {activeTab === 'analytics' && <AnalyticsManager />}
      </div>
    </div>
  );
};

export default AdminDashboard; 