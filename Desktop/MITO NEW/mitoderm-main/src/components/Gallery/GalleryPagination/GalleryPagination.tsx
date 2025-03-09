'use client';
import { FC } from 'react';
import styles from './GallleryPagination.module.scss';
// import DotPagination from '@/components/Shared/DotPagination/DotPagination';
import { useMediaQuery } from 'react-responsive';
import ImageCounter from '../ImageCounter/ImageCounter';

interface Props {
  count: number;
}

const GalleryPagination: FC<Props> = ({ count }) => {
  const isTabletOrMobile = useMediaQuery({
    query: '(max-width: 1224px)',
  });
  return (
    <>
      {!isTabletOrMobile ? (
        <div className={styles.paginationBox}>
          {/* <DotPagination gallery colored count={count} /> */}
          <ImageCounter count={count} />
        </div>
      ) : null}
    </>
  );
};

export default GalleryPagination;
