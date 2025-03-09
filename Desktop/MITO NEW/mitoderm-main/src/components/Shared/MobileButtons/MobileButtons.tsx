import { FC } from 'react';
import styles from './MobileButtons.module.scss';
import ArrowButton from '../ArrowButton/ArrowButton';
import { useLocale } from 'next-intl';

interface Props {
  disabledLeft: boolean;
  disabledRight: boolean;
  onClickLeft: () => void;
  onClickRight: () => void;
}

const MobileButtons: FC<Props> = ({
  disabledLeft,
  disabledRight,
  onClickLeft,
  onClickRight,
}) => {
  const locale = useLocale();

  return (
    <div className={styles.mobileButtons}>
      <ArrowButton
        disabled={disabledLeft}
        colored
        dark
        reversed={locale === 'he' ? false : true}
        onClick={onClickLeft}
      />
      <ArrowButton
        disabled={disabledRight}
        colored
        reversed={locale === 'he'}
        dark
        onClick={onClickRight}
      />
    </div>
  );
};

export default MobileButtons;
