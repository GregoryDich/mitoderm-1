import { FC } from 'react';
import styles from './BulletList.module.scss';
import type { HowToUseItem, EventBulletItem } from '@/types';
import BulletItem from './BulletItem/BulletItem';

interface Props {
  data: HowToUseItem[] | EventBulletItem[];
}

const BulletList: FC<Props> = ({ data }) => {
  return (
    <div className={styles.itemList}>
      {data.map((item) => (
        <BulletItem
          key={item.text}
          imageUrl={item.imagePath}
          text={item.text}
        />
      ))}
    </div>
  );
};

export default BulletList;
