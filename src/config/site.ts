import { LocaleType } from '@/types';

/**
 * Site configuration for MitoDerm
 * This file contains central configuration for the site
 */
export const siteConfig = {
  name: 'MitoDerm',
  title: {
    default: 'MitoDerm - Advanced Exosome Skincare Solutions | Official Distributor in Israel',
    template: '%s | MitoDerm',
  },
  description: 'MitoDerm offers advanced exosome-based skincare solutions for skin rejuvenation, anti-aging, acne scars treatment, hair loss therapy, and post-surgery recovery. Official Exoxe distributor in Israel.',
  keywords: [
    'exosome therapy',
    'skin rejuvenation',
    'anti-aging treatment',
    'acne scars',
    'hair loss treatment',
    'exoxe',
    'mitoderm',
    'dermatology',
    'aesthetic medicine',
    'korean skincare',
    'beauty technology',
    'professional skincare',
    'dermatology clinic',
    'skin health',
    'aesthetic clinic',
  ],
  authors: [
    {
      name: 'MitoDerm Team',
      url: 'https://www.mitoderm.com',
    },
  ],
  creator: 'MitoDerm',
  url: {
    base: 'https://www.mitoderm.com',
    il: 'https://www.mitoderm.co.il',
  },
  company: {
    name: 'MitoDerm',
    address: 'רפאל איתן 38, Ramat Gan, 5590500',
    email: 'info@mitoderm.com',
    phone: '+9721234567890',
    social: {
      facebook: 'https://www.facebook.com/mitoderm',
      instagram: 'https://www.instagram.com/mitoderm',
      linkedin: 'https://www.linkedin.com/company/mitoderm',
    },
  },
  locales: ['en', 'he', 'ru'] as LocaleType[],
  defaultLocale: 'en' as LocaleType,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.mitoderm.com',
    siteName: 'MitoDerm',
    title: 'MitoDerm - Advanced Exosome Skincare Solutions',
    description: 'Advanced exosome-based skincare solutions for rejuvenation, anti-aging, acne scars, hair loss therapy, and more. Official Exoxe distributor in Israel.',
    images: [
      {
        url: 'https://www.mitoderm.com/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MitoDerm Exoxe Exosome Therapy',
      },
    ],
  },
  links: {
    twitter: 'https://twitter.com/mitoderm',
  },
  analytics: {
    google: {
      com: {
        id: 'G-0WL5YD8ELK',
        gtId: 'GT-PJR55J33',
      },
      il: {
        id: 'G-45MFZYYLD8',
      },
    },
  },
  pricing: {
    event: {
      basePrice: 300,
      discountPercent: 10,
    },
  },
}; 