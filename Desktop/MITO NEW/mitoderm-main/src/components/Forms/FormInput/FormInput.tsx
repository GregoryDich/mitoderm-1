'use client';
import { FC, useEffect, useState, useCallback, memo } from 'react';
import styles from './FormInput.module.scss';
import { useLocale, useTranslations } from 'next-intl';
import type { NameTypeMain, NameTypeEvent, TranslationFunction, FormChangeHandler } from '@/types';

interface Props {
  validator: (data: string, t: TranslationFunction) => string;
  setFormData: FormChangeHandler;
  name: NameTypeMain | NameTypeEvent;
  type: 'text' | 'tel' | 'email';
  label: string;
  placeholder: string;
  required?: boolean;
  'aria-required'?: string;
}

const FormInput: FC<Props> = ({
  validator,
  setFormData,
  type,
  name,
  placeholder,
  label,
  required,
  'aria-required': ariaRequired,
}) => {
  const [data, setData] = useState<string>('');
  const [error, setError] = useState<string>('');
  const locale = useLocale();
  const t = useTranslations() as TranslationFunction;

  // Handle input changes with proper validation
  const onChange = useCallback((value: string) => {
    let validatedData = '';
    
    // Apply specific validation for different field types
    if (name === 'phone') {
      validatedData = value.replace(/[^0-9+]/g, '');
    } else if (name === 'idNumber') {
      validatedData = value.replace(/[^0-9]/g, '');
    } else {
      validatedData = value;
    }
    
    setData(validatedData);
    const validationError = validator(validatedData, t);
    setError(validationError);
  }, [name, validator, t]);

  // Update parent form data when local state changes
  useEffect(() => {
    setFormData(data, name, !error.length);
  }, [error, data, name, setFormData]);

  // Handle right-to-left text direction for phone numbers
  useEffect(() => {
    if (locale === 'he' && type === 'tel') {
      const input: HTMLInputElement | null = document.querySelector(`input[name="${name}"]`);
      
      const handlePhoneNumber = () => {
        if (input?.value.startsWith('+')) {
          input.setSelectionRange(0, 0);
        }
      };
      
      if (input) {
        input.addEventListener('input', handlePhoneNumber);
        
        // Clean up event listener
        return () => {
          input.removeEventListener('input', handlePhoneNumber);
        };
      }
    }
  }, [locale, type, name]);

  return (
    <label className={styles.inputLabel}>
      <span className={styles.labelText}>{label}</span>
      <input
        dir={locale === 'he' ? 'rtl' : 'ltr'}
        className={error ? styles.error : ''}
        value={data}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        aria-required={ariaRequired}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {error && (
        <span 
          className={styles.errorText} 
          id={`${name}-error`}
          role="alert"
        >
          {error}
        </span>
      )}
    </label>
  );
};

// Add display name for better debugging
FormInput.displayName = 'FormInput';

// Export memoized component to prevent unnecessary re-renders
export default memo(FormInput);
