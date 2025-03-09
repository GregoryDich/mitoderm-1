import { FC } from 'react';
import styles from './ArrowButton.module.scss';
import Image from 'next/image';

interface Props {
  reversed?: boolean;
  colored?: boolean;
  dark?: boolean;
  onClick?: (arg: any) => void;
  disabled?: boolean;
}

const ArrowButton: FC<Props> = ({
  reversed,
  colored,
  onClick,
  dark,
  disabled,
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`${styles.button} ${colored ? styles.colored : ''} ${
        dark ? styles.dark : ''
      } ${disabled ? styles.disabled : ''}`}
      style={reversed ? { transform: 'rotate(180deg)' } : {}}
    >
      <Image
        className={`${styles.image} ${colored ? styles.colored : ''} ${
          dark ? styles.dark : ''
        }`}
        src='/images/arrowRight.svg'
        width={40}
        height={40}
        alt='arrow button'
      />
    </button>
  );
};

export default ArrowButton;
