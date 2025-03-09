'use client';
import { FC, useEffect, useCallback, memo } from 'react';
import styles from './NumberInput.module.scss';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import useAppStore from '@/store/store';
import type { TranslationFunction } from '@/types';

const NumberInput: FC = () => {
  const t = useTranslations() as TranslationFunction;
  const { numberOfTickets, setNumberOfTickets } = useAppStore((state) => state);

  // Initialize on mount
  useEffect(() => {
    setNumberOfTickets(1);
    
    // Clean up on unmount
    return () => {
      setNumberOfTickets(1);
    };
  }, [setNumberOfTickets]);

  // Handle increment/decrement
  const handleChange = useCallback((arg: 'inc' | 'dec') => {
    if (arg === 'dec') {
      setNumberOfTickets(prev => (prev <= 1 ? 1 : prev - 1));
    } else if (arg === 'inc') {
      setNumberOfTickets(prev => prev + 1);
    }
  }, [setNumberOfTickets]);

  // Handle keyboard interactions
  const handleKeyDown = useCallback((e: React.KeyboardEvent, action: 'inc' | 'dec') => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleChange(action);
    }
  }, [handleChange]);

  return (
    <div className={styles.container}>
      <label htmlFor="ticket-quantity" className={styles.label}>
        {t('form.numberTickets')}
      </label>
      <div className={styles.inputContainer}>
        <button 
          type='button' 
          onClick={() => handleChange('dec')}
          onKeyDown={(e) => handleKeyDown(e, 'dec')}
          aria-label={t('buttons.decrease')}
          aria-controls="ticket-quantity"
          disabled={numberOfTickets <= 1}
        >
          <Image src='/images/minus.svg' width={18} height={18} alt='' aria-hidden="true" />
        </button>
        <input 
          id="ticket-quantity"
          type='number' 
          readOnly 
          value={numberOfTickets} 
          min={1}
          aria-label={t('form.numberTickets')}
          aria-valuemin={1}
          aria-valuenow={numberOfTickets}
        />
        <button 
          type='button' 
          onClick={() => handleChange('inc')}
          onKeyDown={(e) => handleKeyDown(e, 'inc')}
          aria-label={t('buttons.increase')}
          aria-controls="ticket-quantity"
        >
          <Image src='/images/plus.svg' width={18} height={18} alt='' aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

// Add display name for better debugging in React DevTools
NumberInput.displayName = 'NumberInput';

// Export memoized component to prevent unnecessary re-renders
export default memo(NumberInput);
