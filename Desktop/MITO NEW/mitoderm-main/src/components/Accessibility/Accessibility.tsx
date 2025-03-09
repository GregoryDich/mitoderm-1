import { FC } from 'react';
import styles from './Acessibility.module.scss';
import { useTranslations } from 'next-intl';
import ModalContentWrapper from '../Shared/ModalContentWrapper/ModalContentWrapper';

const Accessibility: FC = () => {
  const t = useTranslations();
  return (
    <ModalContentWrapper>
      <h2 className={styles.title}>{t('accessibility.title')}</h2>
      <p className={styles.text}>{t('accessibility.general')}</p>
      <p className={styles.text}>{t('accessibility.websites')}</p>
      <p className={styles.text}>{t('accessibility.interfaceTitle')}</p>
      <p className={styles.text}>{t('accessibility.interfaceText')}</p>
      <p className={styles.text}>{t('accessibility.readers')}</p>
      <p className={styles.text}>{t('accessibility.navigating')}</p>
      <p className={styles.text}>{t('accessibility.contrast')}</p>
      <p className={styles.text}>{t('accessibility.alt')}</p>
      <p className={styles.text}>{t('accessibility.scaling')}</p>
      <p className={styles.text}>{t('accessibility.feedbackTitle')}</p>
      <p className={styles.text}>{t('accessibility.difficulties')}</p>
      <p className={styles.text}>
        {t('accessibility.email')}
        {'info@mitoderm.com'}
      </p>
      <p className={styles.text}>
        {t('accessibility.phone')}
        {'+972 54-326-2182'}
      </p>
      <p className={styles.text}>{t('accessibility.feedbackHelp')}</p>
      <p className={styles.text}>{t('accessibility.obligationsTitle')}</p>
      <p className={styles.text}>{t('accessibility.obligationsText')}</p>
    </ModalContentWrapper>
  );
};

export default Accessibility;
