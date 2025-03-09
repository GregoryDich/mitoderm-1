import { FC } from 'react';
import dynamic from 'next/dynamic';
import path from 'path';
import { promises as fs } from 'fs';
import styles from './Gallery.module.scss';
import { getTranslations } from 'next-intl/server';
import GalleryPagination from './GalleryPagination/GalleryPagination';

const env = process.env.NODE_ENV;

const extractNumber = (item: string): number => {
  return parseInt(item.match(/\d+/)?.[0] || '0', 10);
};

const GalleryWrapper = dynamic(
  () => import('@/components/Gallery/GalleryWrapper/GalleryWrapper'),
  {
    ssr: false,
  }
);

const Gallery: FC = async () => {
  const t = await getTranslations('gallery');
  const imageDirectory = path.join(
    process.cwd(),
    '/public/images/beforeAfterExamples'
  );
  const imageFilenames = await fs.readdir(imageDirectory);
  const itemList: Array<[string, string]> = [];
  let sliderItemsArray: string[] = [];

  if (env == 'development') {
    sliderItemsArray = imageFilenames.slice(1);
  } else sliderItemsArray = imageFilenames;

  if (sliderItemsArray)
    sliderItemsArray.sort((a, b) => {
      return extractNumber(a) - extractNumber(b);
    });
  for (let i = 0; i < sliderItemsArray.length; i += 2) {
    itemList.push(sliderItemsArray.slice(i, i + 2) as any);
  }

  return (
    <section id='gallery' className={styles.container}>
      <h2 className={styles.title}>{t('title')}</h2>
      <GalleryWrapper itemList={itemList} />
      <GalleryPagination count={itemList.length} />
    </section>
  );
};

export default Gallery;
