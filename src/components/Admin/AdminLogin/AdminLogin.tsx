'use client';
import { FC, useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { signIn, useSession } from 'next-auth/react';
import styles from './AdminLogin.module.scss';
import ErrorMessage from '@/components/Shared/ErrorMessage/ErrorMessage';

const AdminLogin: FC = () => {
  const t = useTranslations('admin');
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [messageType, setMessageType] = useState<'error' | 'success' | 'info'>('error');
  const [isLoading, setIsLoading] = useState(false);

  // Проверяем, авторизован ли пользователь при загрузке компонента
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role === 'admin') {
      router.push('/admin/dashboard');
    }
  }, [router, session, status]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password
      });

      if (result?.error) {
        setMessageType('error');
        setErrorMessage(t('invalidCredentials'));
      } else {
        setMessageType('success');
        setErrorMessage(t('loginSuccess'));
        
        // Перенаправление на страницу админ-панели
        setTimeout(() => {
          router.push('/admin/dashboard');
        }, 1000);
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessageType('error');
      setErrorMessage(t('loginError'));
    } finally {
      setIsLoading(false);
    }
  };

  // Если статус загрузки, показываем индикатор загрузки
  if (status === 'loading') {
    return <div className={styles.loading}>{t('loading')}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h1 className={styles.title}>{t('loginTitle')}</h1>
        
        {errorMessage && (
          <ErrorMessage message={errorMessage} type={messageType} />
        )}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">{t('email')}</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder={t('emailPlaceholder')}
              className={styles.input}
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="password">{t('password')}</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder={t('passwordPlaceholder')}
              className={styles.input}
            />
          </div>
          
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? t('loggingIn') : t('login')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin; 