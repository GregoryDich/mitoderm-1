'use client';
import { FC, useState } from 'react';
import styles from './Dropdown.module.scss';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

interface Props {
  item: string;
  time?: boolean;
}

const Dropdown: FC<Props> = ({ item, time }) => {
  const t = useTranslations();
  const [isShown, setIsShown] = useState<boolean>(false);
  return (
    <div
      className={styles.container}
      onClick={() => setIsShown((state) => !state)}
    >
      <div className={styles.label}>
        <Image
          className={`${styles.image} ${isShown ? styles.active : ''}`}
          src='/images/arrowDown.svg'
          alt='arrow icon'
          width={26}
          height={15}
        />
        <span className={styles.title}>
          {time ? (
            <span className={styles.time}>{t(`${item}.time`)}</span>
          ) : null}
          {t(`${item}.title`)}
        </span>
      </div>
      {isShown ? <p className={styles.text}>{t(`${item}.text`)}</p> : null}
    </div>
  );
};

export default Dropdown;
