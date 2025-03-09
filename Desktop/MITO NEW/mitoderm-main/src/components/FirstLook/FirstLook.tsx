'use client';
import { FC } from 'react';
import styles from './FirstLook.module.scss';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import ContactLink from '../Contact/ContactLink/ContactLink';
import { useMediaQuery } from 'react-responsive';

const FirstLook: FC = () => {
  const t = useTranslations();
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });

  return (
    <section id='firstlook' className={styles.container}>
      <span className={styles.title}>
        {t('firstLook.titleP1')}
        <span className={styles.colored}>{t('firstLook.titleP2')}</span>
      </span>
      <span className={styles.subtitle}>{t('firstLook.subtitle')}</span>
      <div className={styles.containerInner}>
        <div className={styles.imageBox}>
          <Image
            src='/images/aestheticsBG.png'
            width={594}
            height={397}
            layout={isTabletOrMobile ? 'responsive' : 'auto'}
            alt='exosome bottles on rose table'
          />
        </div>
        <div className={styles.textContainer}>
          <span className={styles.textTitle}>{t('firstLook.textTitle')}</span>
          <span className={styles.text}>{t('firstLook.text')}</span>
          <div className={styles.linkbox}>
            <ContactLink
              wide={isTabletOrMobile}
              size={125}
              iconSize={45}
              imageLink='/images/contacts/instagram.svg'
              url={process.env.NEXT_PUBLIC_LINK_INSTAGRAM as string}
            />
            <ContactLink
              wide={isTabletOrMobile}
              size={125}
              iconSize={45}
              imageLink='/images/contacts/tiktok.svg'
              url={process.env.NEXT_PUBLIC_LINK_TIKTOK as string}
            />
            <ContactLink
              wide={isTabletOrMobile}
              size={125}
              iconSize={45}
              imageLink='/images/contacts/google.svg'
              url={process.env.NEXT_PUBLIC_LINK_GOOGLE as string}
            />
            <ContactLink
              wide={isTabletOrMobile}
              size={125}
              iconSize={45}
              imageLink='/images/contacts/facebook.svg'
              url={process.env.NEXT_PUBLIC_LINK_FACEBOOK as string}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FirstLook;
