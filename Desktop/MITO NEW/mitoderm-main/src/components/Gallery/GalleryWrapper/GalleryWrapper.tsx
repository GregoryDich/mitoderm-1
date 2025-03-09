'use client';
import { FC, useEffect } from 'react';
import styles from './GalleryWrapper.module.scss';
import useAppStore from '@/store/store';
import { useMediaQuery } from 'react-responsive';
import GalleryDesktop from '../GalleryDesktop/GalleryDesktop';
import GalleryMobile from '../GalleryMobile/GalleryMobile';
import { useLocale } from 'next-intl';

interface Props {
  itemList: Array<[string, string]>;
}

const GalleryWrapper: FC<Props> = ({ itemList }) => {
  const locale = useLocale();
  const isTabletOrMobile = useMediaQuery({
    query: '(max-width: 1224px)',
  });
  const { galleryPage, setGalleryPage } = useAppStore((state) => state);

  const scrollTo = () => {
    const container = document.getElementById('galleryItemBox');
    if (galleryPage >= itemList.length) setGalleryPage(0);
    if (galleryPage < 0) setGalleryPage(itemList.length - 1);
    if (container) {
      const scrollPosition = galleryPage * container?.clientWidth;
      if (locale === 'he') {
        container?.scrollTo({
          left: -scrollPosition,
          behavior: 'smooth',
        });
      } else {
        container?.scrollTo({
          left: scrollPosition,
          behavior: 'smooth',
        });
      }
    }
  };

  useEffect(() => {
    scrollTo();
  }, [galleryPage]);

  const increment = () => {
    itemList.length >= galleryPage
      ? setGalleryPage(galleryPage + 1)
      : setGalleryPage(0);
  };
  const decrement = () => {
    galleryPage <= 0
      ? setGalleryPage(itemList.length - 1)
      : setGalleryPage(galleryPage - 1);
  };

  return (
    <div className={styles.container}>
      {isTabletOrMobile ? (
        <GalleryMobile
          disabledLeft={false}
          disabledRight={false}
          onClickLeft={decrement}
          onClickRight={increment}
          items={itemList}
        />
      ) : (
        <GalleryDesktop
          disabledLeft={false}
          disabledRight={false}
          onClickLeft={decrement}
          onClickRight={increment}
          items={itemList}
        />
      )}
    </div>
  );
};

export default GalleryWrapper;
