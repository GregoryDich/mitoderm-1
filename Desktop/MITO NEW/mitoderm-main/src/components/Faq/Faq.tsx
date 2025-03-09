import { FC } from 'react';
import styles from './Faq.module.scss';
import { useTranslations } from 'next-intl';
import Dropdown from '../Shared/Dropdown/Dropdown';

const Faq: FC = () => {
  const t = useTranslations();
  return (
    <section id='faq' className={styles.container}>
      <div className={styles.containerInner}>
        <span className={styles.title}>{t('faq.title')}</span>
        <div className={styles.itemBox}>
          <Dropdown item={'faq.item1'} />
          <Dropdown item={'faq.item2'} />
          <Dropdown item={'faq.item3'} />
        </div>
      </div>
    </section>
  );
};

export default Faq;
