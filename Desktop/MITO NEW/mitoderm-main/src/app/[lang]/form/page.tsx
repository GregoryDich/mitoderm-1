import { unstable_setRequestLocale } from 'next-intl/server';
import MainForm from '@/components/Forms/MainForm';
import { Metadata } from 'next';

// Define proper type for component props
interface FormPageProps {
  params: {
    lang: string;
  };
}

// Generate metadata for the form page
export function generateMetadata({ params }: FormPageProps): Metadata {
  return {
    title: 'Contact MitoDerm | Get Personalized Skincare Solutions',
    description: 'Get in touch with MitoDerm specialists to receive personalized exosome skincare solutions for your clinic. Fill out our form to start the conversation.',
    alternates: {
      canonical: `https://www.mitoderm.com/${params.lang}/form`,
      languages: {
        'en': 'https://www.mitoderm.com/en/form',
        'he': 'https://www.mitoderm.com/he/form',
        'ru': 'https://www.mitoderm.com/ru/form',
      },
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function FormPage({ params: { lang } }: FormPageProps) {
  unstable_setRequestLocale(lang);
  return (
    <main className='formPage'>
      <MainForm />
    </main>
  );
}
