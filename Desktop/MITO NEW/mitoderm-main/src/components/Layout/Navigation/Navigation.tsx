'use client';
import { FC } from 'react';
import styles from './Navigation.module.scss';
import { navMainList, navEventList, navFormList } from '@/constants';
import { NavItem } from '@/types';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { useMediaQuery } from 'react-responsive';
import { usePathname, Link } from '@/i18n/routing';

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navigation: FC<Props> = ({ isOpen, setIsOpen }) => {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });
  const pathName = usePathname();
  const isFormPage = pathName.includes('form');
  const isSuccessPage = pathName.includes('success');

  const navList =
    isFormPage || isSuccessPage
      ? navFormList
      : pathName.includes('event')
      ? navEventList
      : navMainList;

  const randomString = () => (Math.random() + 1).toString(36).substring(7);

  const t = useTranslations();
  const locale = useLocale();

  const handleClick = () => {
    setIsOpen(false);
  };

  const putImage = (text: string) => {
    if (text === 'navigation.product')
      return (
        <Image
          className={`${styles.arrowIcon} ${
            locale === 'he' ? styles.reversed : ''
          }`}
          src='/images/arrowDown.svg'
          width={10}
          height={5.5}
          alt='arrow icon'
        />
      );
  };

  return (
    <>
      {isTabletOrMobile ? (
        <nav
          className={`${styles.mobileNavigation} ${isOpen && styles.active}`}
        >
          {navList.map((item: NavItem, index: number) => (
            <div
              className={styles.linkContainerMobile}
              key={`item${index + Math.random()}`}
            >
              {!item.scrollId && !item.url ? (
                <button
                  onClick={handleClick}
                  key={index + randomString()}
                  className={styles.buttonMobile}
                >
                  {t(item.text)}
                  {putImage(item.text)}
                </button>
              ) : (
                <Link
                  onClick={handleClick}
                  href={item.url ? item.url : `#${item.scrollId}`}
                  key={index + randomString()}
                  className={styles.buttonMobile}
                >
                  {t(item.text)}
                  {putImage(item.text)}
                </Link>
              )}
            </div>
          ))}
        </nav>
      ) : (
        <nav
          className={`${styles.navigation} ${
            isFormPage || isSuccessPage ? styles.formPage : ''
          }`}
        >
          {navList.map((item: NavItem, index: number) => (
            <div
              className={styles.linkContainer}
              key={`item${index + Math.random()}`}
            >
              {!item.scrollId && !item.url ? (
                <button
                  onClick={() => setIsOpen(false)}
                  key={index + randomString()}
                  className={styles.button}
                >
                  {t(item.text)}
                  {putImage(item.text)}
                </button>
              ) : (
                <Link
                  href={item.url ? item.url : `#${item.scrollId}`}
                  key={index + randomString()}
                  className={styles.button}
                >
                  {t(item.text)}
                  {putImage(item.text)}
                </Link>
              )}
            </div>
          ))}
        </nav>
      )}
    </>
  );
};

export default Navigation;
