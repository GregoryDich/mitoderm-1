import { FC } from 'react';
import styles from './Event.module.scss';
import { useTranslations } from 'next-intl';
import Dropdown from '../Shared/Dropdown/Dropdown';
import Button from '../Shared/Button/Button';

const Event: FC = () => {
  const t = useTranslations();
  return (
    <section id='agenda' className={styles.container}>
      <div className={styles.containerInner}>
        <span className={styles.title}>{t('event.title')}</span>
        <div className={styles.itemBox}>
          <Dropdown item={'event.item1'} time />
          <Dropdown item={'event.item2'} time />
          <Dropdown item={'event.item3'} time />
          <Dropdown item={'event.item4'} time />
        </div>
      </div>
      <Button formPage='event' colored text={t('buttons.seat')} />
    </section>
  );
};

export default Event;
