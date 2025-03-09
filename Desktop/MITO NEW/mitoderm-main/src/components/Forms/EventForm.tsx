'use client';
import { FC, FormEvent, useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  validateName,
  validateEmail,
  validatePhone,
  validateId,
} from '@/utils/validateFormFields';
import styles from './Form.module.scss';
import Image from 'next/image';
import Button from '../Shared/Button/Button';
import ErrorMessage from '../Shared/ErrorMessage/ErrorMessage';
import { useLocale, useTranslations } from 'next-intl';
import FormInput from '../Forms/FormInput/FormInput';
import { useMediaQuery } from 'react-responsive';
import useAppStore from '@/store/store';
import type { EventFormDataType, ApiResponse, TranslationFunction, FormChangeHandler } from '@/types';
import Loader from '../Shared/Loader/Loader';
import NumberInput from '../Forms/NumberInput/NumberInput';
import Price from '../Forms/Price/Price';
import { usePathname } from 'next/navigation';
import { sendPaymentDataToCRM } from '@/utils/sendPayment';
import type { NameTypeMain, NameTypeEvent } from '@/types';

const EventForm: FC = () => {
  const router = useRouter();
  const { numberOfTickets, isDiscounted, setNumberOfTickets } = useAppStore((state) => state);
  const t = useTranslations() as TranslationFunction;
  const pathname = usePathname();
  const isEventPage = pathname?.includes('event') || false;
  const locale = useLocale();
  const formRef = useRef<HTMLDivElement>(null);
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });
  
  // Form state
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [messageType, setMessageType] = useState<'error' | 'info' | 'success'>('error');
  
  // Form data
  const [formData, setFormData] = useState<EventFormDataType>({
    name: { value: '', isValid: false },
    email: { value: '', isValid: false },
    phone: { value: '', isValid: false },
    idNumber: { value: '', isValid: false },
  });
  
  const [totalPrice, setTotalPrice] = useState<string>('');

  // Initialize state on mount
  useEffect(() => {
    // Set initial total price
    updateTotalPrice();
    
    // Reset number of tickets when component unmounts
    return () => {
      setNumberOfTickets(1);
    };
  }, []);

  // Calculate price whenever tickets or discount changes
  useEffect(() => {
    updateTotalPrice();
  }, [numberOfTickets, isDiscounted]);

  // Handle form data changes
  const handleData = useCallback<FormChangeHandler>((
    data: string,
    name: NameTypeEvent | NameTypeMain,
    isValid: boolean
  ) => {
    setFormData(prevData => ({ 
      ...prevData, 
      [name]: { value: data, isValid } 
    }));
    
    // Clear any previous error messages when user is typing
    if (errorMessage) {
      setErrorMessage('');
    }
  }, [errorMessage]);

  // Validate form fields
  const validatePageForm = useCallback(() => {
    const { name, email, phone, idNumber } = formData;
    const isValid = name.isValid && 
                   email.isValid && 
                   phone.isValid && 
                   idNumber.isValid && 
                   isChecked;
    
    setIsButtonDisabled(!isValid);
    return isValid;
  }, [formData, isChecked]);

  // Update total price
  const updateTotalPrice = useCallback(() => {
    const price = 300;
    const discount = isDiscounted ? 0.9 : 1;
    const total = price * numberOfTickets * discount;
    setTotalPrice(total.toString());
  }, [numberOfTickets, isDiscounted]);

  // Handle form submission
  const onSubmit = useCallback(async (e?: FormEvent) => {
    e?.preventDefault();
    
    // Reset error message
    setErrorMessage('');
    
    // Validate form before submission
    if (!validatePageForm()) {
      setErrorMessage(t('forms.validationError'));
      setMessageType('error');
      return;
    }
    
    setIsSending(true);

    try {
      const updatedFormData: EventFormDataType = {
        ...formData,
        totalPrice,
        discount: isDiscounted,
        quantity: numberOfTickets,
        lang: locale,
      };

      const response = await sendPaymentDataToCRM(updatedFormData).catch(error => {
        console.error("Payment error:", error);
        return { success: false, message: error?.message || "Payment processing failed" } as ApiResponse;
      });
      
      if (response?.success) {
        // If there's a payment URL, redirect to it
        if (response.pay_url) {
          // Show success message before redirecting
          setErrorMessage(t('forms.processingPayment'));
          setMessageType('success');
          
          // Short delay to show the message before redirecting
          setTimeout(() => {
            window.location.href = response.pay_url!;
          }, 1000);
        } else {
          // Otherwise redirect to success page
          router.push(`/${locale}/event/form/success`);
        }
      } else {
        // Handle failed request
        setErrorMessage(t('forms.error'));
        setMessageType('error');
        setIsSending(false);
      }
    } catch (error) {
      console.error("Payment submission error:", error);
      setErrorMessage(t('forms.error'));
      setMessageType('error');
      setIsSending(false);
    }
  }, [formData, totalPrice, isDiscounted, numberOfTickets, locale, validatePageForm, t, router]);

  // Handle Enter key press
  const onEnterHit = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Enter' && !isButtonDisabled && !isSending) {
      onSubmit();
    }
  }, [isButtonDisabled, isSending, onSubmit]);

  // Add keyboard event listener
  useEffect(() => {
    document.addEventListener('keydown', onEnterHit);
    return () => {
      document.removeEventListener('keydown', onEnterHit);
    };
  }, [onEnterHit]);

  // Update form validation when form data changes
  useEffect(() => {
    validatePageForm();
  }, [formData, isChecked, validatePageForm]);

  // Scroll to error message when it appears
  useEffect(() => {
    if (errorMessage && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [errorMessage]);

  return (
    <div className={styles.container}>
      <div ref={formRef} className={styles.formContainer}>
        {isSending && !errorMessage ? (
          <Loader />
        ) : (
          <>
            <h2>
              {t('form.eventTitle')}
              <br />
            </h2>
            <form 
              className={styles.form}
              onSubmit={onSubmit}
              aria-labelledby="event-form-title"
              role="form"
              noValidate
            >
              <h3 id="event-form-title" className={styles.srOnly}>
                {t('form.eventTitle')}
              </h3>
              
              {/* Error/success message display */}
              {errorMessage && (
                <ErrorMessage 
                  message={errorMessage} 
                  type={messageType} 
                />
              )}
              
              <FormInput
                label={t('form.placeholderInputName')}
                setFormData={handleData}
                type='text'
                name='name'
                placeholder='Aaron Smith'
                validator={validateName}
                required
                aria-required="true"
              />
              <FormInput
                label={t('form.placeholderInputID')}
                setFormData={handleData}
                type='text'
                name='idNumber'
                placeholder='123456789'
                validator={validateId}
                required
                aria-required="true"
              />
              <FormInput
                label={t('form.placeholderEmailName')}
                setFormData={handleData}
                type='email'
                name='email'
                placeholder='mitoderm@mail.com'
                validator={validateEmail}
                required
                aria-required="true"
              />
              <FormInput
                label={t('form.placeholderPhoneName')}
                setFormData={handleData}
                type='tel'
                name='phone'
                placeholder='586 412 924'
                validator={validatePhone}
                required
                aria-required="true"
              />
              <NumberInput />
              <Price />
              <label
                className={`${styles.checkboxLabel} ${
                  locale === 'he' ? styles.he : ''
                }`}
              >
                {t('form.checkboxLabel')}
                <input
                  checked={isChecked}
                  onChange={() => setIsChecked((state) => !state)}
                  name='approve'
                  type='checkbox'
                  required
                  aria-required="true"
                />
                <div className={styles.customCheckbox} aria-hidden="true" />
              </label>
              <Button
                disabled={isButtonDisabled || isSending}
                submit
                colored
                text={t('buttons.reserveSeat')}
                ariaLabel={t('buttons.reserveSeat')}
              />
              <div
                className={`${styles.row} ${locale === 'he' ? styles.he : ''}`}
              >
                <Image
                  src='/images/lockIcon.svg'
                  width={14}
                  height={14}
                  alt='lock icon'
                />
                <p>{t('form.sharing')}</p>
              </div>
            </form>
          </>
        )}
      </div>
      {isTabletOrMobile ? null : (
        <div className={styles.formImageContainer}>
          <Image
            className={styles.desktopImage}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            src='/images/formImage.png'
            alt='background with exosome'
            loading="lazy"
          />
        </div>
      )}
    </div>
  );
};

export default EventForm;
