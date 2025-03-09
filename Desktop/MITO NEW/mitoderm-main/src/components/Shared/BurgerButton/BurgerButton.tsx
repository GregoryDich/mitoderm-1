'use client';
import { FC, Dispatch, SetStateAction } from 'react';
import styles from './BurgerButton.module.scss';

interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const BurgerButton: FC<Props> = ({ isOpen, setIsOpen }) => {
  return (
    <button
      name='burger'
      onClick={() => setIsOpen(!isOpen)}
      className={`${styles.button} ${isOpen ? styles.active : ''}`}
    >
      <div className={`${styles.line} ${styles.line1}`} />
      <div className={`${styles.line} ${styles.line2}`} />
      <div className={`${styles.line} ${styles.line3}`} />
    </button>
  );
};

export default BurgerButton;
