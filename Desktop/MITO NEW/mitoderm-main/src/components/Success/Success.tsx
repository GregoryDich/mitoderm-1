'use client';
import { FC, useEffect } from 'react';
import styles from './Success.module.scss';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { sendPaymentEmail } from '@/utils/sendPaymentEmail';

const Success: FC = () => {
  const t = useTranslations();
  const router = useRouter();

  const params = useSearchParams();
  const name = params.get('name');
  const email = params.get('email');
  const phone = params.get('phone');
  const amount = params.get('amount');
  const idNumber = params.get('idNumber');

  useEffect(() => {
    console.log(name, email, phone, amount, idNumber);
    if (!name || !email || !phone || !amount || !idNumber) {
      router.push('/');
    } else sendPaymentEmail({ name, email, phone, amount, idNumber });
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.containerInner}>
        <h1 className={styles.title}>{t('success.title')}</h1>
        <Image
          src='/images/success.svg'
          width={150}
          height={150}
          alt='success icon'
          style={{ marginBlock: 30 }}
        />
        <>
          <span>
            <span className={styles.text}>{t('success.client')}</span>
            {name?.replace('_', ' ')}
          </span>
          <span>
            <span className={styles.text}>{t('success.id')}</span>
            {idNumber}
          </span>
          <span>
            <span className={styles.text}>{t('success.email')}</span>
            {email}
          </span>
          <span dir='ltr'>
            <span className={styles.text}>{t('success.phone')}</span>
            {phone}
          </span>
          <span>
            <span className={styles.text}>{t('success.amount')}</span>{' '}
            <span>&#8362; </span> {amount}
          </span>
        </>
      </div>
    </div>
  );
};

export default Success;
