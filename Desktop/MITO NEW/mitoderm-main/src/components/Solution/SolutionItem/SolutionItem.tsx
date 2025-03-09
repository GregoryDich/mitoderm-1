import { FC } from 'react';
import styles from './SolutionItem.module.scss';
import Image from 'next/image';
import { SolutionItem as SolutionItemType } from '@/types';
import { useLocale, useTranslations } from 'next-intl';
import { useMediaQuery } from 'react-responsive';
import RoundLabel from '@/components/Shared/RoundLabel/RoundLabel';

interface Props {
  item: SolutionItemType;
  withLabel?: boolean;
}

function splitArray<T>(arr: T[]): [T[], T[]] {
  const mid = Math.ceil(arr.length / 2);
  const firstHalf = arr.slice(0, mid);
  const secondHalf = arr.slice(mid);
  return [firstHalf, secondHalf];
}

const SolutionItem: FC<Props> = ({ item, withLabel }) => {
  const t = useTranslations();
  const locale = useLocale();
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });
  const { imageUrl, title, text } = item;
  const bulletsArray = splitArray(text);
  return (
    <div className={styles.container}>
      <Image
        src={imageUrl}
        width={isTabletOrMobile ? 56 : 86}
        height={isTabletOrMobile ? 113 : 174}
        alt='medicine image'
      />
      <p className={styles.title}>{t(title)}</p>
      {text.length > 2 ? (
        <div className={styles.textContainer}>
          {
            <>
              <div
                className={`${styles.firstColumn} ${
                  locale === 'he' ? styles.he : ''
                }`}
              >
                {bulletsArray[0].map((el: string, i: number) => (
                  <span key={i} className={styles.text}>
                    {t(el)}
                  </span>
                ))}
              </div>
              <div className={styles.secondColumn}>
                {bulletsArray[1].map((el: string, i: number) => (
                  <span key={i} className={styles.text}>
                    {t(el)}
                  </span>
                ))}
              </div>
            </>
          }
        </div>
      ) : (
        text.map((item: string, index: number) => (
          <span key={index} className={styles.text}>
            {t(item)}
          </span>
        ))
      )}
      {withLabel ? <RoundLabel text='+' /> : null}
    </div>
  );
};

export default SolutionItem;
