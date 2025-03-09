'use client';
import { FC } from 'react';
import styles from './HowCaBeUsed.module.scss';
import { useTranslations } from 'next-intl';
import { howToUseItemList } from '@/constants';
import Button from '../Shared/Button/Button';
import BulletList from '../Shared/BulletsList/BulletList';

const scrollTo = () => {
  const element = document.getElementById('about');
  if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  return;
};

const HowCanBeUsed: FC = () => {
  const t = useTranslations();
  return (
    <section className={styles.section}>
      <p className={styles.title}>
        {t('howToUse.titleP1')}
        <span className={styles.titleColored}>{t('howToUse.titleP2')}</span>
        {t('howToUse.titleP3')}
      </p>
      <BulletList data={howToUseItemList} />
      <Button colored onClick={scrollTo} text={t('buttons.learnMore')} />
    </section>
  );
};

export default HowCanBeUsed;
