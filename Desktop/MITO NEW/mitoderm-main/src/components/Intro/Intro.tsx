'use client';
import { FC, useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import styles from './Intro.module.scss';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { usePathname } from '@/i18n/routing';
import DotPagination from '../Shared/DotPagination/DotPagination';
import useAppStore from '@/store/store';

const Button = dynamic(() => import('@/components/Shared/Button/Button'), {
  ssr: false,
});

const AUTO_SCROLL_INTERVAL = 15000; // 15 seconds

const Intro: FC = () => {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const isEventPage = pathname.includes('event');
  const { introPage, setIntroPage } = useAppStore((state) => state);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Memoize scrollToNextChild to prevent unnecessary re-creation
  const scrollToNextChild = useCallback(() => {
    const container = document.getElementById('scroller');
    if (!container) return;
    
    const scrollPosition = introPage * window.innerWidth;
    
    if (locale === 'he') {
      container.scrollTo({
        left: -scrollPosition,
        behavior: 'smooth',
      });
    } else {
      container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth',
      });
    }
  }, [introPage, locale]);

  // Set initial page based on route
  useEffect(() => {
    setIntroPage(isEventPage ? 1 : 0);
    
    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isEventPage, setIntroPage]);

  // Add event listeners
  useEffect(() => {
    const container = document.getElementById('scroller');
    
    // Event handler functions
    const preventDefaultHandler = (event: Event) => {
      event.preventDefault();
    };
    
    // Only add event listeners if container exists
    if (container) {
      container.addEventListener('wheel', preventDefaultHandler, { passive: false });
      container.addEventListener('touchmove', preventDefaultHandler, { passive: false });
      container.addEventListener('scroll', preventDefaultHandler, { passive: false });
      
      // Cleanup function to remove event listeners
      return () => {
        container.removeEventListener('wheel', preventDefaultHandler);
        container.removeEventListener('touchmove', preventDefaultHandler);
        container.removeEventListener('scroll', preventDefaultHandler);
      };
    }
  }, []);

  // Scroll when introPage changes
  useEffect(() => {
    scrollToNextChild();
  }, [introPage, scrollToNextChild]);

  // Auto-scroll carousel
  useEffect(() => {
    // Don't auto-scroll on event page
    if (isEventPage) return;
    
    const nextPage = introPage === 0 ? 1 : 0;
    
    intervalRef.current = setInterval(() => {
      setIntroPage(nextPage);
    }, AUTO_SCROLL_INTERVAL);

    // Clean up the interval
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [introPage, setIntroPage, isEventPage]);

  return (
    <section id='intro' className={styles.section}>
      <div id='scroller' className={styles.scrollBox}>
        <div
          className={`${styles.introMain} ${
            locale === 'he' ? styles.reversed : ''
          }`}
        >
          <div className={styles.container}>
            <span>
              <span>{t('intro.subtitleP1')}</span>
              <span className={styles.dot}>&#x2022;</span>
              <span>{t('intro.subtitleP2')}</span>
            </span>
            <h1
              className={`${styles.title} ${locale === 'ru' ? styles.ru : ''}`}
            >
              {t('intro.title')}
            </h1>
            <div className={styles.row}>
              <Button
                text={t('buttons.contact')}
                style={{ marginTop: 20 }}
                formPage={'main'}
              />
              <p className={styles.text}>{t('intro.text')}</p>
            </div>
          </div>
        </div>
        <div
          className={`${styles.introEvent} ${
            locale === 'he' ? styles.reversed : ''
          }`}
        >
          <div className={styles.container}>
            <span>
              <span>{t('intro.eventSubtitle')}</span>
            </span>
            <h1
              className={`${styles.title} ${locale === 'ru' ? styles.ru : ''}`}
            >
              {t('intro.eventTitle')}
            </h1>
            <div className={styles.row}>
              <Button
                text={t('buttons.seat')}
                style={{ marginTop: 20 }}
                formPage={'event'}
              />
            </div>
          </div>
        </div>
      </div>
      {!isEventPage && (
        <Image
          className={styles.lines}
          src='/images/lines1.svg'
          width={460}
          height={460}
          alt='lines'
          priority={true}
        />
      )}
      <div className={styles.paginationBox}>
        <DotPagination count={2} intro />
      </div>
    </section>
  );
};

export default Intro;
