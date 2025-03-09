'use client';
import { FC } from 'react';
import styles from './Footer.module.scss';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { usePathname } from '@/i18n/routing';
import Link from 'next/link';

const Footer: FC = () => {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const isFormPage = pathname.includes('form');

  return (
    <footer
      style={isFormPage ? { padding: '30px 0' } : {}}
      className={styles.footer}
    >
      <div className={styles.content}>
        <span className={styles.copyright}>{t('footer.copyright')}</span>
        <div className={styles.textContainer}>
          <Link href={`/${locale}/accessibility`} className={styles.item}>
            {t('footer.accessibility')}
          </Link>
          <Link href={`/${locale}/privacy-policy`} className={styles.item}>
            {t('footer.privacy')}
          </Link>
          <span className={styles.item}>{t('footer.group')}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
