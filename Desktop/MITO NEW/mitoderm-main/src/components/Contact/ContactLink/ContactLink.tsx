'use client';
import Image from 'next/image';
import { FC } from 'react';
import styles from './ContactLink.module.scss';
import { useMediaQuery } from 'react-responsive';

interface Props {
  imageLink: string;
  url: string;
  size?: number;
  iconSize?: number;
  wide?: boolean;
}

const ContactLink: FC<Props> = ({ imageLink, url, size, iconSize, wide }) => {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });
  return (
    <a
      className={`${styles.link} ${wide ? styles.wide : ''}`}
      style={size ? { width: size, height: size, borderRadius: 24 } : {}}
      target='_blank'
      href={url}
    >
      <Image
        src={imageLink}
        width={iconSize ? iconSize : isTabletOrMobile ? 35 : 25}
        height={iconSize ? iconSize : isTabletOrMobile ? 35 : 25}
        alt='social icon'
      />
    </a>
  );
};

export default ContactLink;
