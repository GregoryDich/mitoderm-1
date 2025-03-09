import { unstable_setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import PrivatePolicy from '@/components/PrivatePolicy/PrivatePolicy';

// Define proper type for component props
interface PrivacyPolicyPageProps {
  params: {
    lang: string;
  };
}

// Generate metadata for the privacy policy page
export function generateMetadata({ params }: PrivacyPolicyPageProps): Metadata {
  return {
    title: 'Privacy Policy | MitoDerm',
    description: 'Read our privacy policy to understand how MitoDerm handles your personal information and protects your privacy.',
    alternates: {
      canonical: `https://www.mitoderm.com/${params.lang}/privacy-policy`,
      languages: {
        'en': 'https://www.mitoderm.com/en/privacy-policy',
        'he': 'https://www.mitoderm.com/he/privacy-policy',
        'ru': 'https://www.mitoderm.com/ru/privacy-policy',
      },
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function PrivacyPolicyPage({ params: { lang } }: PrivacyPolicyPageProps) {
  unstable_setRequestLocale(lang);
  
  return (
    <main className="policy-container">
      <PrivatePolicy />
      
      <style jsx>{`
        .policy-container {
          max-width: 1200px;
          margin: 60px auto;
          padding: 0 20px;
        }
      `}</style>
    </main>
  );
} 