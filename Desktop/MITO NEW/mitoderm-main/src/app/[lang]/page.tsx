import { unstable_setRequestLocale } from 'next-intl/server';
import dynamic from 'next/dynamic';
import Intro from '@/components/Intro/Intro';
import HowCanBeUsed from '@/components/HowCanBeUsed/HowCanBeUsed';
import Gallery from '@/components/Gallery/Gallery';
import { Metadata } from 'next';

// Define proper type for component props
interface HomePageProps {
  params: {
    lang: string;
  };
}

// Generate metadata for the home page
export function generateMetadata({ params }: HomePageProps): Metadata {
  return {
    title: 'MitoDerm - Advanced Exosome Skincare Solutions | Official Distributor in Israel',
    description: 'MitoDerm offers advanced exosome-based skincare solutions for skin rejuvenation, anti-aging, acne scars treatment, hair loss therapy, and post-surgery recovery. Official Exoxe distributor in Israel.',
    alternates: {
      canonical: `https://www.mitoderm.com/${params.lang}`,
      languages: {
        'en': 'https://www.mitoderm.com/en',
        'he': 'https://www.mitoderm.com/he',
        'ru': 'https://www.mitoderm.com/ru',
      },
    },
    openGraph: {
      url: `https://www.mitoderm.com/${params.lang}`,
    },
  };
}

const Solution = dynamic(() => import('@/components/Solution/Solution'), {
  ssr: false,
});

const Reviews = dynamic(() => import('@/components/Reviews/Reviews'), {
  ssr: false,
});

const About = dynamic(() => import('@/components/About/About'), {
  ssr: false,
});

const Mission = dynamic(() => import('@/components/Mission/Mission'), {
  ssr: false,
});

const Faq = dynamic(() => import('@/components/Faq/Faq'), {
  ssr: false,
});

const Contact = dynamic(() => import('@/components/Contact/Contact'), {
  ssr: false,
});

export default function HomePage({ params: { lang } }: HomePageProps) {
  unstable_setRequestLocale(lang);
  return (
    <main>
      <Intro />
      <HowCanBeUsed />
      <About />
      <Solution />
      <Reviews />
      <Gallery />
      <Mission />
      <Faq />
      <Contact />
    </main>
  );
}
