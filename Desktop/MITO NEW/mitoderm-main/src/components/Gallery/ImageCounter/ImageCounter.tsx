import { FC } from 'react';
import styles from './ImageCounter.module.scss';
import useAppStore from '@/store/store';

interface Props {
  count: number;
}

const ImageCounter: FC<Props> = ({ count }) => {
  const galleryPage = useAppStore((state) => state.galleryPage);
  return (
    <span className={styles.count}>{`${galleryPage + 1} / ${count}`}</span>
  );
};

export default ImageCounter;
