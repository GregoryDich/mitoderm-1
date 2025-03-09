import { FC } from 'react';
import styles from './Contact.module.scss';
import { useLocale, useTranslations } from 'next-intl';
import ContactLink from './ContactLink/ContactLink';

const Contact: FC = () => {
  const t = useTranslations();
  const locale = useLocale();
  return (
    <section className={styles.section}>
      <div className={styles.content}>
        <div className={styles.cardContainer}>
          <iframe
            title='map'
            className={styles.iframe}
            src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3381.742871905674!2d34.838356476322325!3d32.04915057397624!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151d4b0d109f21bb%3A0x3ea185837fd0354b!2z16jXpNeQ15wg15DXmdeq158gMzgsIFJhbWF0IEdhbg!5e0!3m2!1sru!2sil!4v1733341052563!5m2!1sru!2sil'
            style={{ border: 'none' }}
            allowFullScreen={false}
            loading='lazy'
            referrerPolicy='no-referrer-when-downgrade'
          />
        </div>
        <div className={styles.contacts}>
          <div className={styles.contactsItem}>
            <span className={styles.contactsItemTitle}>
              {t('contactUs.item1title')}
            </span>
            <p>
              <span className={styles.text}>{t('contactUs.phone')}</span>
              <span className={styles.text}>
                {t('contactUs.phoneText')}{' '}
                <a
                  style={{ marginRight: locale === 'he' ? 5 : 0 }}
                  dir='ltr'
                  href='https://wa.me/+972547621889'
                  target='_blank'
                >
                  {' +972-54-326-21-82 '}
                </a>
              </span>
            </p>
            <p>
              <span className={styles.text}>{t('contactUs.address')}</span>
              <span className={styles.text}>{t('contactUs.addressText')}</span>
            </p>
            <p>
              <span className={styles.text}>{t('contactUs.email')}</span>
              <a href='mailto:info@mitoderm.com' className={styles.text}>
                {t('contactUs.emailText')}
              </a>
            </p>
          </div>
          <div className={styles.contactsItem}>
            <span className={styles.contactsItemTitle}>
              {t('contactUs.item2title')}
            </span>
            <div className={styles.item2textBox}>
              <div className={styles.column}>
                <span className={`${styles.text} ${styles.item2text}`}>
                  {t('contactUs.workWeek')}
                </span>
                <span className={`${styles.text} ${styles.item2text}`}>
                  {t('contactUs.friday')}
                </span>
                <span className={`${styles.text} ${styles.item2text}`}>
                  {t('contactUs.saturday')}
                </span>
                <span className={`${styles.text} ${styles.item2text}`}>
                  {t('contactUs.followUs')}
                </span>
              </div>
              <div className={styles.column}>
                <span className={`${styles.text} ${styles.item2text}`}>
                  9:00 - 21:00
                </span>
                <span className={`${styles.text} ${styles.item2text}`}>
                  {t('contactUs.fridayText')}
                </span>
                <span className={`${styles.text} ${styles.item2text}`}>
                  {t('contactUs.closed')}
                </span>
                <div className={styles.linkBox}>
                  <ContactLink
                    imageLink='/images/contacts/instagram.svg'
                    url={process.env.NEXT_PUBLIC_LINK_INSTAGRAM as string}
                  />
                  <ContactLink
                    imageLink='/images/contacts/tiktok.svg'
                    url={process.env.NEXT_PUBLIC_LINK_TIKTOK as string}
                  />
                  <ContactLink
                    imageLink='/images/contacts/google.svg'
                    url={process.env.NEXT_PUBLIC_LINK_GOOGLE as string}
                  />
                  <ContactLink
                    imageLink='/images/contacts/facebook.svg'
                    url={process.env.NEXT_PUBLIC_LINK_FACEBOOK as string}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
