'use client';
import { FC, useState } from 'react';
import styles from './Solution.module.scss';
import { useLocale, useTranslations } from 'next-intl';
import Button from '../Shared/Button/Button';
import { solutionItems } from '@/constants';
import { combinedArray } from '@/utils/helpers';
import { SolutionItem as SolutionItemType } from '@/types';
import SolutionItem from './SolutionItem/SolutionItem';
// import ArrowButton from '../Shared/ArrowButton/ArrowButton';
import { useMediaQuery } from 'react-responsive';
// import MobileButtons from '../Shared/MobileButtons/MobileButtons';

const Solution: FC = () => {
  // const [currentPage, setCurrentPage] = useState<number>(1);
  const t = useTranslations();
  const locale = useLocale();
  // const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });

  // const handleScroll = (arg: 1 | 2) => {
  //   setCurrentPage(arg);
  //   const currentScroll = document.getElementById(`block${arg}`);
  //   currentScroll?.scrollIntoView({
  //     behavior: 'smooth',
  //     block: 'nearest',
  //     inline: 'center',
  //   });
  // };

  const solutionBlocks = combinedArray(solutionItems);
  return (
    <section id='solution' className={styles.section}>
      {locale === 'ru' ? (
        <p className={styles.title}>
          {t('solution.titleP1') + ' ' + t('solution.titleP3')}
          <span>{t('solution.titleP2')}</span>
        </p>
      ) : (
        <p className={styles.title}>
          {t('solution.titleP1')}
          <span>{t('solution.titleP2')}</span>
          {t('solution.titleP3')}
        </p>
      )}
      <span className={styles.subtitle}>{t('solution.subtitle')}</span>
      <div className={styles.sliderContainer}>
        {/*
        For now this element is hidden

        {!isTabletOrMobile ? (
          <ArrowButton
            disabled={currentPage === 1}
            colored
            reversed={locale === 'he' ? false : true}
            onClick={() => handleScroll(1)}
          />
        ) : null} */}
        <div className={styles.slider}>
          {solutionBlocks.map((block: SolutionItemType[], index: number) => (
            <div
              id={`block${index + 1}`}
              className={styles.solutionBlock}
              key={index}
            >
              <SolutionItem item={block[0]} withLabel />
              <SolutionItem item={block[1]} />
            </div>
          ))}
        </div>
        {/* 
        For now this element is hidden
        
        {!isTabletOrMobile ? (
          <ArrowButton
            disabled={currentPage === 2}
            colored
            onClick={() => handleScroll(2)}
            reversed={locale === 'he'}
          />
        ) : null} */}
      </div>
      {/* 
      For now this element is hidden

      {isTabletOrMobile ? (
        <MobileButtons
          disabledLeft={currentPage === 1}
          disabledRight={currentPage === 2}
          onClickLeft={() => handleScroll(1)}
          onClickRight={() => handleScroll(2)}
        />
      ) : null} */}
      <Button
        style={{ margin: '40px auto' }}
        colored
        text={t('buttons.contactForPrice')}
        formPage='main'
      />
    </section>
  );
};

export default Solution;
