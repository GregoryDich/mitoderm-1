import { FC } from 'react';
import styles from './BulletItem.module.scss';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface Props {
  imageUrl: string;
  text: string;
}

const BulletItem: FC<Props> = ({ imageUrl, text }) => {
  const t = useTranslations();
  return (
    <div className={styles.container}>
      <Image src={imageUrl} width={118} height={110} alt='item purpose' />
      <span>{t(text)}</span>
    </div>
  );
};

export default BulletItem;
