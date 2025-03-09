'use client';
import { FC, useEffect, useState, useCallback, memo } from 'react';
import styles from './Price.module.scss';
import { useLocale, useTranslations } from 'next-intl';
import useAppStore from '@/store/store';
import type { TranslationFunction } from '@/types';

type ErrorMessageType = 'default' | 'error' | 'success';

const initialErrorStatus: ErrorMessageType = 'default';

declare global {
  interface ProcessEnv {
    NEXT_PUBLIC_EVENT_PRICE: string;
    NEXT_PUBLIC_EVENT_PROMOCODE: string;
  }
}

const Price: FC = () => {
  const [value, setValue] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<ErrorMessageType>(initialErrorStatus);
  const t = useTranslations() as TranslationFunction;
  const locale = useLocale();
  const currentPrice = process.env.NEXT_PUBLIC_EVENT_PRICE || '300';
  const promoCode = process.env.NEXT_PUBLIC_EVENT_PROMOCODE || 'PROMO2024';
  
  const { 
    numberOfTickets, 
    isDiscounted, 
    setIsDiscounted 
  } = useAppStore(state => state);

  // Reset on component mount
  useEffect(() => {
    setValue('');
    setIsDiscounted(false);
    setErrorMessage(initialErrorStatus);
    
    // Clean up on unmount
    return () => {
      setIsDiscounted(false);
    };
  }, [setIsDiscounted]);

  // Apply promo code
  const handleApplyPromo = useCallback(() => {
    if (!value.trim()) {
      return;
    }
    
    const isValidPromo = value === promoCode;
    setErrorMessage(isValidPromo ? 'success' : 'error');
    setIsDiscounted(isValidPromo);
  }, [value, promoCode, setIsDiscounted]);

  // Clear error message after delay
  useEffect(() => {
    if (errorMessage !== 'default') {
      const timer = setTimeout(() => setErrorMessage(initialErrorStatus), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  // Calculate total price
  const calculateTotal = useCallback(() => {
    const basePrice = parseInt(currentPrice);
    const discount = isDiscounted ? 0.9 : 1;
    return (basePrice * numberOfTickets * discount).toFixed(2).replace('.', ',');
  }, [currentPrice, numberOfTickets, isDiscounted]);

  return (
    <div className={styles.container}>
      <div className={styles.totalBox}>
        <span className={styles.total}>{t('form.total')}</span>
        <span
          className={`${styles.amount} ${locale === 'he' ? styles.he : ''}`}
        >
          <span>&#8362; </span>
          {calculateTotal()}
        </span>
      </div>
      <div className={styles.promoBox}>
        <span className={styles.promo}>{t('form.promo')}</span>
        <div className={`${styles.inputBox} ${locale === 'he' ? styles.he : ''}`}>
          <input
            placeholder='Promo432'
            type='text'
            value={value}
            onChange={(e) => setValue(e.target.value.substring(0, 15))}
            aria-label={t('form.promo')}
          />
          <button 
            onClick={handleApplyPromo} 
            type='button'
            aria-label={t('form.apply')}
          >
            {t('form.apply')}
          </button>
        </div>
        
        {(errorMessage !== 'default' || isDiscounted) && (
          <span
            className={`${styles.message} ${
              errorMessage === 'error' 
                ? styles.error 
                : styles.success
            }`}
            role="alert"
          >
            {errorMessage === 'error'
              ? t('form.wrongPromo')
              : t('form.success')}
          </span>
        )}
      </div>
    </div>
  );
};

// Add display name for better debugging in React DevTools
Price.displayName = 'Price';

// Export memoized component to prevent unnecessary re-renders
export default memo(Price);
