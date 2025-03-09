'use client';
import { FC, FormEvent, useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Form.module.scss';
import Image from 'next/image';
import Button from '../Shared/Button/Button';
import ErrorMessage from '../Shared/ErrorMessage/ErrorMessage';
import { useLocale, useTranslations } from 'next-intl';
import FormInput from './FormInput/FormInput';
import { useMediaQuery } from 'react-responsive';
import type { 
  MainFormDataType, 
  NameTypeEvent, 
  NameTypeMain, 
  FormChangeHandler, 
  TranslationFunction, 
  ApiResponse 
} from '@/types';
import { sendDataOnMail } from '@/utils/sendEmailData';
import { sendDataToCRM } from '@/utils/sendCRMData';
import Loader from '../Shared/Loader/Loader';
import { usePathname } from 'next/navigation';
import {
  validateName,
  validateEmail,
  validatePhone,
  validateProfession,
} from '@/utils/validateFormFields';

const MainForm: FC = () => {
  const router = useRouter();
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
  
  // Form data state
  const [formData, setFormData] = useState<MainFormDataType>({
    name: { value: '', isValid: false },
    email: { value: '', isValid: false },
    phone: { value: '', isValid: false },
    profession: { value: '', isValid: false },
  });

  // Handle form field changes
  const handleData = useCallback<FormChangeHandler>((
    data: string,
    name: NameTypeMain | NameTypeEvent,
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
  const validateMainPageForm = useCallback(() => {
    const { name, email, phone, profession } = formData;
    const isValid = name.isValid && 
                    email.isValid && 
                    phone.isValid && 
                    profession.isValid && 
                    isChecked;
    
    setIsButtonDisabled(!isValid);
    return isValid;
  }, [formData, isChecked]);

  // Submit form handler
  const onSubmit = useCallback(async (e?: FormEvent) => {
    e?.preventDefault();
    
    // Reset error message
    setErrorMessage('');
    
    // Validate form before submission
    if (!validateMainPageForm()) {
      setErrorMessage(t('forms.validationError'));
      setMessageType('error');
      return;
    }
    
    setIsSending(true);

    try {
      const [emailResponse, crmResponse] = await Promise.all([
        sendDataOnMail(formData).catch(error => {
          console.error("Error sending email:", error);
          return { success: false, message: error?.message || "Email sending failed" } as ApiResponse;
        }),
        sendDataToCRM(formData).catch(error => {
          console.error("Error sending to CRM:", error);
          return { success: false, message: error?.message || "CRM sending failed" } as ApiResponse;
        })
      ]);
      
      if (emailResponse?.success || crmResponse?.success) {
        // Redirect to success page instead of showing inline success message
        if (isEventPage) {
          router.push(`/${locale}/event/form/success`);
        } else {
          router.push(`/${locale}/form/success`);
        }
      } else {
        // Handle case when both requests failed
        setErrorMessage(t('forms.error'));
        setMessageType('error');
        setIsSending(false);
      }
    } catch (error) {
      console.error("Submission error:", error);
      setErrorMessage(t('forms.error'));
      setMessageType('error');
      setIsSending(false);
    }
  }, [formData, validateMainPageForm, t, router, isEventPage, locale]);

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

  // Update form validation when data changes
  useEffect(() => {
    validateMainPageForm();
  }, [formData, isChecked, validateMainPageForm]);

  // Scroll to error message when it appears
  useEffect(() => {
    if (errorMessage && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [errorMessage]);

  return (
    <div className={styles.container}>
      <div ref={formRef} className={styles.formContainer}>
        {isSending ? (
          <Loader />
        ) : (
          <>
            <h2>
              {t('form.titleP1')}
              <br />
              <span>{t('form.titleP2')}</span>
              {t('form.titleP3')}
            </h2>
            <p>{t('form.subtitle')}</p>
            <div
              className={`${styles.form} ${isTabletOrMobile ? styles.mobile : ''}`}
            >
              <form 
                onSubmit={onSubmit} 
                className={styles.contactForm}
                aria-labelledby="form-title"
                role="form"
                noValidate
              >
                <h3 id="form-title" className={styles.srOnly}>{t('forms.title')}</h3>
                
                {/* Error message display */}
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
                <FormInput
                  label={t('form.placeholderProfession')}
                  setFormData={handleData}
                  type='text'
                  name='profession'
                  placeholder={t('form.placeholderProfession')}
                  validator={validateProfession}
                  required
                  aria-required="true"
                />
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
                  disabled={isButtonDisabled}
                  submit
                  colored
                  text={t(
                    isEventPage
                      ? 'buttons.reserveSeat'
                      : 'buttons.requestCallback'
                  )}
                  ariaLabel={t(
                    isEventPage
                      ? 'buttons.reserveSeat'
                      : 'buttons.requestCallback'
                  )}
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
            </div>
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

export default MainForm;
