import { FC } from 'react';
import styles from './GalleryMobile.module.scss';
import MobileButtons from '@/components/Shared/MobileButtons/MobileButtons';
import { useTranslations } from 'next-intl';

interface Props {
  disabledLeft: boolean;
  disabledRight: boolean;
  onClickLeft: () => void;
  onClickRight: () => void;
  items: Array<[string, string]>;
}

const GalleryMobile: FC<Props> = ({
  disabledLeft,
  disabledRight,
  onClickLeft,
  onClickRight,
  items,
}) => {
  const t = useTranslations();
  return (
    <>
      <div className={styles.itemWrapper}>
        <div id='galleryItemBox' className={styles.imageBox}>
          {items.map((item, i) => (
            <div id={`item${i}`} className={styles.item} key={`key${i}`}>
              <div className={styles.imageContainer}>
                <div className={styles.image}>
                  <img
                    src={`/images/beforeAfterExamples/${item[0]}`}
                    alt='before usage exoxo'
                  />
                </div>
                <span className={styles.label}>{t('gallery.before')}</span>
              </div>
              <span className={styles.roundLabel}>&</span>
              <div className={styles.imageContainer}>
                <div className={styles.image}>
                  <img
                    src={`/images/beforeAfterExamples/${item[1]}`}
                    alt='result after usage exoxo'
                  />
                </div>
                <span className={`${styles.label} ${styles.bottom}`}>
                  {t('gallery.after')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.mobileButtonContainer}>
        <MobileButtons
          disabledLeft={disabledLeft}
          disabledRight={disabledRight}
          onClickLeft={onClickLeft}
          onClickRight={onClickRight}
        />
      </div>
    </>
  );
};

export default GalleryMobile;
