'use client';
import { FC, useEffect, useState } from 'react';
import styles from './Header.module.scss';
import Image from 'next/image';
import LanguageSwitch from '../LanguageSwitch/LanguageSwitch';
import Navigation from '../Navigation/Navigation';
import { useMediaQuery } from 'react-responsive';
import BurgerButton from '@/components/Shared/BurgerButton/BurgerButton';
import Link from 'next/link';
import { usePathname } from '@/i18n/routing';

const Header: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });
  const pathname = usePathname();
  const isSuccessPage = pathname.includes('success');
  const handleClose = (e: MouseEvent) => {
    const { target } = e;
    if ((target as HTMLDivElement).id === 'overlay') setIsOpen(false);
  };

  useEffect(() => {
    isOpen
      ? window.addEventListener('click', handleClose)
      : window.removeEventListener('click', handleClose);
    return () => window.removeEventListener('click', handleClose);
  }, [isOpen]);

  return (
    <header className={styles.header}>
      <div
        className={`${styles.overlay} ${isOpen ? styles.active : ''}`}
        id='overlay'
      />
      <div className={styles.container}>
        <Link className={styles.logoContainer} href='#intro'>
          <Image
            src='/images/logo.svg'
            width={isTabletOrMobile ? 96 : 120}
            height={isTabletOrMobile ? 32 : 40}
            quality={100}
            alt='mitoderm logo'
          />
        </Link>
        <Navigation setIsOpen={setIsOpen} isOpen={isOpen} />
        {!isSuccessPage ? <LanguageSwitch /> : <div style={{ width: 120 }} />}
        {isTabletOrMobile && (
          <BurgerButton isOpen={isOpen} setIsOpen={setIsOpen} />
        )}
      </div>
    </header>
  );
};

export default Header;
