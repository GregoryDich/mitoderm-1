'use client';
import { FC } from 'react';
import styles from './ToTopItOff.module.scss';
import { useMediaQuery } from 'react-responsive';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Button from '../Shared/Button/Button';

const ToTopItOff: FC = () => {
  const t = useTranslations();
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });
  return (
    <section className={styles.container}>
      {isTabletOrMobile ? (
        <span className={styles.titleMob}>{t('toTop.title')}</span>
      ) : null}
      <div className={styles.containerInner}>
        <div className={styles.itemList}>
          {!isTabletOrMobile ? (
            <span className={styles.title}>{t('toTop.title')}</span>
          ) : null}
          <div className={styles.item}>
            <p className={styles.round}>1</p>
            <span className={styles.text}>{t('toTop.text1')}</span>
          </div>
          <div className={styles.item}>
            <p className={styles.round}>2</p>
            <span className={styles.text}>{t('toTop.text2')}</span>
          </div>
        </div>
        <Image
          src='/images/toTopBG.png'
          width={594}
          height={554}
          layout={isTabletOrMobile ? 'responsive' : 'auto'}
          alt='exosome bottles on rose table'
        />
      </div>
      <div className={styles.buttonBox}>
        <Button text={t('buttons.seat')} colored formPage='event' />
      </div>
    </section>
  );
};

export default ToTopItOff;
