import type { Metadata, Viewport } from 'next';
import { unstable_setRequestLocale } from 'next-intl/server';
import dynamic from 'next/dynamic';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import '../globals.scss';
import { Rubik } from 'next/font/google';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import Footer from '@/components/Layout/Footer/Footer';
import { GoogleAnalytics } from '@next/third-parties/google';
import Script from 'next/script';
import { headers } from 'next/headers';
import { SessionProvider } from '@/components/Providers/SessionProvider';

const Header = dynamic(() => import('@/components/Layout/Header/Header'), {
  ssr: false,
});

const Modal = dynamic(() => import('@/components/Layout/Modal/Modal'), {
  ssr: false,
});

const rubik = Rubik({
  weight: ['300', '400', '500', '900'],
  style: 'normal',
  display: 'swap',
  variable: '--font-Rubik',
  subsets: ['latin', 'cyrillic', 'hebrew'],
});

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'he' }, { lang: 'ru' }];
}

// Define viewport separately for better typings
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#ffffff',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://www.mitoderm.com'),
  title: {
    default: 'MitoDerm - Advanced Exosome Skincare Solutions | Official Distributor in Israel',
    template: '%s | MitoDerm'
  },
  description: 'MitoDerm offers advanced exosome-based skincare solutions for skin rejuvenation, anti-aging, acne scars treatment, hair loss therapy, and post-surgery recovery. Official Exoxe distributor in Israel.',
  keywords: ['exosome therapy', 'skin rejuvenation', 'anti-aging treatment', 'acne scars', 'hair loss treatment', 'exoxe', 'mitoderm', 'dermatology', 'aesthetic medicine', 'korean skincare', 'beauty technology', 'professional skincare', 'dermatology clinic', 'skin health', 'aesthetic clinic'],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-video-preview': -1,
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://www.mitoderm.com',
    languages: {
      'en': 'https://www.mitoderm.com/en',
      'he': 'https://www.mitoderm.com/he',
      'ru': 'https://www.mitoderm.com/ru',
    },
  },
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
  twitter: {
    card: 'summary_large_image',
    title: 'MitoDerm - Advanced Exosome Skincare Solutions',
    description: 'Advanced exosome-based skincare for rejuvenation, anti-aging, acne scars, hair loss therapy. Official Exoxe distributor in Israel.',
    images: ['https://www.mitoderm.com/images/twitter-image.jpg'],
    creator: '@mitoderm',
  },
  icons: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      url: '/favicon/favicon.ico',
      sizes: 'auto',
    },
    {
      rel: 'icon',
      type: 'image/png',
      url: '/favicon/favicon-16x16.png',
      sizes: '16x16',
    },
    {
      rel: 'icon',
      type: 'image/png',
      url: '/favicon/favicon-32x32.png',
      sizes: '32x32',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '512x512',
      url: '/favicon/android-chrome-512x512.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '192x192',
      url: '/favicon/android-chrome-192x192.png',
    },
    {
      rel: 'apple-touch-icon',
      type: 'image/png',
      sizes: '192x192',
      url: '/favicon/apple-touch-icon.png',
    },
  ],
  verification: {
    google: 'google-site-verification-code', // Replace with actual verification code
  },
  category: 'dermatology',
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { lang: string };
}>) {
  const messages = await getMessages();
  const headersList = headers();
  const host = headersList.get('host') || '';
  const isIsraeliDomain = host.includes('co.il');

  if (!routing.locales.includes(params.lang as any)) {
    notFound();
  }

  unstable_setRequestLocale(params.lang);

  return (
    <html lang={params.lang}>
      <head>
        {/* Preload critical resources */}
        <link
          rel="preload"
          href="/fonts/Rubik-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/images/logo.png"
          as="image"
          type="image/png"
        />
        
        {/* Cache control */}
        <meta httpEquiv="Cache-Control" content="max-age=31536000, public" />
        <meta httpEquiv="Expires" content="31536000" />
        
        {/* PWA manifest */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="MitoDerm" />
        <link rel="apple-touch-startup-image" href="/images/splash-screen.png" />

        {/* Google Analytics for mitoderm.com */}
        {!isIsraeliDomain && (
          <>
            <Script async src="https://www.googletagmanager.com/gtag/js?id=G-0WL5YD8ELK" strategy="afterInteractive" />
            <Script id="google-analytics-com" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-0WL5YD8ELK');
                gtag('config', 'GT-PJR55J33');
              `}
            </Script>
          </>
        )}

        {/* Google Analytics for mitoderm.co.il */}
        {isIsraeliDomain && (
          <>
            <Script async src="https://www.googletagmanager.com/gtag/js?id=G-45MFZYYLD8" strategy="afterInteractive" />
            <Script id="google-analytics-il" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-45MFZYYLD8');
              `}
            </Script>
          </>
        )}
        
        {/* Schema.org structured data */}
        <Script id="schema-organization" type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "MitoDerm",
              "url": "https://www.mitoderm.com",
              "logo": "https://www.mitoderm.com/images/logo.png",
              "description": "MitoDerm offers advanced exosome-based skincare solutions. Official Exoxe distributor in Israel.",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "רפאל איתן 38",
                "addressLocality": "Ramat Gan",
                "postalCode": "5590500",
                "addressCountry": "IL"
              },
              "email": "info@mitoderm.com",
              "telephone": "+9721234567890",
              "sameAs": [
                "https://www.facebook.com/mitoderm",
                "https://www.instagram.com/mitoderm",
                "https://www.linkedin.com/company/mitoderm"
              ]
            }
          `}
        </Script>
        <Script id="schema-product" type="application/ld+json">
          {`
            {
              "@context": "https://schema.org/",
              "@type": "Product",
              "name": "Exoxe Exosome",
              "image": "https://www.mitoderm.com/images/product.jpg",
              "description": "Advanced exosome-based skincare solution for professional use in skin rejuvenation, anti-aging treatments, acne scars reduction, and hair loss therapy.",
              "brand": {
                "@type": "Brand",
                "name": "Exoxe"
              },
              "offers": {
                "@type": "Offer",
                "url": "https://www.mitoderm.com/form",
                "priceCurrency": "ILS",
                "availability": "https://schema.org/InStock",
                "seller": {
                  "@type": "Organization",
                  "name": "MitoDerm"
                }
              }
            }
          `}
        </Script>
        <Script id="schema-faq" type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [{
                "@type": "Question",
                "name": "What are exosomes?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Exosomes are tiny vesicles, rich in growth factors, proteins, and regenerative signals. These powerful messengers interact with your body's cells, stimulating healing and rejuvenation."
                }
              }, {
                "@type": "Question",
                "name": "How do exosomes work?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Exosomes deliver growth factors, proteins, and regenerative signals directly to your body's target cells. When applied to a treatment area, they communicate with these cells to promote repair, regeneration, and rejuvenation."
                }
              }, {
                "@type": "Question",
                "name": "What conditions are helped by exosomes?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Exosome therapy offers transformative solutions for skin rejuvenation, hair restoration, reduction of acne scars, and post-procedure healing acceleration."
                }
              }]
            }
          `}
        </Script>
        <Script id="schema-event" type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Event",
              "name": "Join Conference by Mitoderm",
              "startDate": "2025-06-15T19:00:00+03:00",
              "endDate": "2025-06-15T22:00:00+03:00",
              "location": {
                "@type": "Place",
                "name": "MitoDerm Conference Hall",
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": "רפאל איתן 38",
                  "addressLocality": "Ramat Gan",
                  "postalCode": "5590500",
                  "addressCountry": "IL"
                }
              },
              "image": "https://www.mitoderm.com/images/event-og-image.jpg",
              "description": "Join MitoDerm's exclusive conference on advanced exosome technologies. Learn about the future of aesthetics, networking opportunities, and innovative skincare solutions.",
              "offers": {
                "@type": "Offer",
                "url": "https://www.mitoderm.com/event/form",
                "priceCurrency": "ILS",
                "availability": "https://schema.org/InStock"
              },
              "organizer": {
                "@type": "Organization",
                "name": "MitoDerm",
                "url": "https://www.mitoderm.com"
              }
            }
          `}
        </Script>
      </head>
      <NextIntlClientProvider messages={messages}>
        <body
          className={rubik.className}
          dir={params.lang === 'he' ? 'rtl' : 'ltr'}
        >
          <SessionProvider>
            <Header />
            <Modal />
            {children}
            <Footer />
          </SessionProvider>
        </body>
      </NextIntlClientProvider>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ID as string} />
    </html>
  );
}
