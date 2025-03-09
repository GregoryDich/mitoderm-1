import { unstable_setRequestLocale } from 'next-intl/server';
import dynamic from 'next/dynamic';
import Intro from '@/components/Intro/Intro';
import Button from '@/components/Shared/Button/Button';
import { useTranslations } from 'next-intl';
import EventBulletList from '@/components/EventBulletList/EventBulletList';
import Gallery from '@/components/Gallery/Gallery';
import { Metadata } from 'next';

// Define proper type for component props
interface EventPageProps {
  params: {
    lang: string;
  };
}

// Generate metadata for the event page
export function generateMetadata({ params }: EventPageProps): Metadata {
  return {
    title: 'Join MitoDerm Conference | Exosome Technologies Event | Aesthetics Innovations',
    description: 'Join MitoDerm\'s exclusive conference on advanced exosome technologies. Learn about the future of aesthetics, networking opportunities, and innovative skincare solutions.',
    alternates: {
      canonical: `https://www.mitoderm.com/${params.lang}/event`,
      languages: {
        'en': 'https://www.mitoderm.com/en/event',
        'he': 'https://www.mitoderm.com/he/event',
        'ru': 'https://www.mitoderm.com/ru/event',
      },
    },
    openGraph: {
      url: `https://www.mitoderm.com/${params.lang}/event`,
      title: 'MitoDerm Conference - The Future of Aesthetics',
      description: 'Join our exclusive conference to discover innovative exosome technologies and network with industry professionals.',
      images: [
        {
          url: 'https://www.mitoderm.com/images/event-og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'MitoDerm Conference Event',
        },
      ],
    },
  };
}

const FirstLook = dynamic(() => import('@/components/FirstLook/FirstLook'), {
  ssr: false,
});

const Event = dynamic(() => import('@/components/Event/Event'), {
  ssr: false,
});

const ToTopItOff = dynamic(() => import('@/components/ToTopItOff/ToTopItOff'), {
  ssr: false,
});

const Contact = dynamic(() => import('@/components/Contact/Contact'), {
  ssr: false,
});

const About = dynamic(() => import('@/components/About/About'), {
  ssr: false,
});

const Mission = dynamic(() => import('@/components/Mission/Mission'), {
  ssr: false,
});

export default function EventPage({ params: { lang } }: EventPageProps) {
  unstable_setRequestLocale(lang);
  const t = useTranslations();
  return (
    <main>
      <Intro />
      <EventBulletList />
      <FirstLook />
      <Event />
      <ToTopItOff />
      <Contact />
      <Gallery />
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          padding: '0px 20px',
        }}
      >
        <Button
          style={{ margin: '20px auto 40px auto' }}
          colored
          text={t('buttons.seat')}
          formPage='event'
        />
      </div>
      <About />
      <Mission />
    </main>
  );
}
