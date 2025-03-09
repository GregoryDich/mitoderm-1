import { FC } from 'react';
import styles from './RoundLabel.module.scss';
import { useLocale } from 'next-intl';

interface Props {
  text: string;
}

const RoundLabel: FC<Props> = ({ text }) => {
  const locale = useLocale();
  return (
    <div className={`${styles.container} ${locale === 'he' ? styles.he : ''}`}>
      {text}
    </div>
  );
};

export default RoundLabel;
