import { unstable_setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import Accessibility from '@/components/Accessibility/Accessibility';

// Define proper type for component props
interface AccessibilityPageProps {
  params: {
    lang: string;
  };
}

// Generate metadata for the accessibility page
export function generateMetadata({ params }: AccessibilityPageProps): Metadata {
  return {
    title: 'Accessibility Statement | MitoDerm',
    description: 'MitoDerm is committed to providing a website that is accessible to the widest possible audience. Learn about our accessibility features and commitment.',
    alternates: {
      canonical: `https://www.mitoderm.com/${params.lang}/accessibility`,
      languages: {
        'en': 'https://www.mitoderm.com/en/accessibility',
        'he': 'https://www.mitoderm.com/he/accessibility',
        'ru': 'https://www.mitoderm.com/ru/accessibility',
      },
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function AccessibilityPage({ params: { lang } }: AccessibilityPageProps) {
  unstable_setRequestLocale(lang);
  
  return (
    <main className="accessibility-container">
      <Accessibility />
      
      <style jsx>{`
        .accessibility-container {
          max-width: 1200px;
          margin: 60px auto;
          padding: 0 20px;
        }
      `}</style>
    </main>
  );
} 