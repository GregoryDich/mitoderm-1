import { unstable_setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

// Define proper type for component props
interface FormSuccessPageProps {
  params: {
    lang: string;
  };
}

// Generate metadata for the form success page
export function generateMetadata({ params }: FormSuccessPageProps): Metadata {
  return {
    title: 'Form Submitted Successfully | MitoDerm',
    description: 'Thank you for contacting MitoDerm. Your message has been received and we will get back to you shortly.',
    alternates: {
      canonical: `https://www.mitoderm.com/${params.lang}/form/success`,
      languages: {
        'en': 'https://www.mitoderm.com/en/form/success',
        'he': 'https://www.mitoderm.com/he/form/success',
        'ru': 'https://www.mitoderm.com/ru/form/success',
      },
    },
    robots: {
      index: false, // don't index success pages
      follow: true,
    },
  };
}

export default function FormSuccessPage({ params: { lang } }: FormSuccessPageProps) {
  unstable_setRequestLocale(lang);
  
  return (
    <main className="success-container">
      <div className="success-content">
        <Image 
          src="/images/success-icon.svg" 
          alt="Success" 
          width={80} 
          height={80}
          className="success-icon"
        />
        
        <h1>Thank You!</h1>
        <p className="success-message">
          Your form has been submitted successfully. Our team will get back to you shortly.
        </p>
        
        <div className="success-actions">
          <Link href={`/${lang}`} className="home-button">
            Return to Home
          </Link>
        </div>
        
        {/* Google Analytics Event Tracking */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof gtag === 'function') {
                gtag('event', 'form_submission', {
                  'event_category': 'form',
                  'event_label': 'contact_form'
                });
              }
            `,
          }}
        />
      </div>
      
      <style jsx>{`
        .success-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 70vh;
          padding: 40px 20px;
        }
        
        .success-content {
          background: white;
          border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          padding: 40px;
          max-width: 500px;
          width: 100%;
          text-align: center;
        }
        
        .success-icon {
          margin-bottom: 24px;
        }
        
        h1 {
          font-size: 32px;
          margin-bottom: 16px;
          color: #333;
        }
        
        .success-message {
          font-size: 18px;
          line-height: 1.6;
          color: #555;
          margin-bottom: 32px;
        }
        
        .success-actions {
          margin-top: 30px;
        }
        
        .home-button {
          display: inline-block;
          background: #0070f3;
          color: white;
          padding: 12px 24px;
          border-radius: 4px;
          text-decoration: none;
          font-weight: 500;
          transition: background 0.3s ease;
        }
        
        .home-button:hover {
          background: #0058cc;
        }
        
        @media (max-width: 600px) {
          .success-content {
            padding: 30px 20px;
          }
          
          h1 {
            font-size: 28px;
          }
          
          .success-message {
            font-size: 16px;
          }
        }
      `}</style>
    </main>
  );
} 