import { FC } from 'react';
import styles from './AboutItem.module.scss';

interface Props {
  data: string;
  text: string;
}

const AboutItem: FC<Props> = ({ data, text }) => {
  return (
    <div className={styles.container}>
      <span className={styles.data}>{data}</span>
      <span className={styles.text}>{text}</span>
    </div>
  );
};

export default AboutItem;
