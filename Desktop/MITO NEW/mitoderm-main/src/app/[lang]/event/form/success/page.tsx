import { unstable_setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

// Define proper type for component props
interface EventFormSuccessPageProps {
  params: {
    lang: string;
  };
}

// Generate metadata for the event form success page
export function generateMetadata({ params }: EventFormSuccessPageProps): Metadata {
  return {
    title: 'Event Registration Confirmed | MitoDerm',
    description: 'Thank you for registering for our event. Your registration has been confirmed and we look forward to seeing you.',
    alternates: {
      canonical: `https://www.mitoderm.com/${params.lang}/event/form/success`,
      languages: {
        'en': 'https://www.mitoderm.com/en/event/form/success',
        'he': 'https://www.mitoderm.com/he/event/form/success',
        'ru': 'https://www.mitoderm.com/ru/event/form/success',
      },
    },
    robots: {
      index: false, // don't index success pages
      follow: true,
    },
  };
}

export default function EventFormSuccessPage({ params: { lang } }: EventFormSuccessPageProps) {
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
        
        <h1>Registration Confirmed!</h1>
        <p className="success-message">
          Your registration for the MitoDerm event has been confirmed. 
          We look forward to seeing you there!
        </p>
        
        <div className="event-details">
          <h2>Event Details</h2>
          <p><strong>Date:</strong> Coming Soon</p>
          <p><strong>Time:</strong> 19:00</p>
          <p><strong>Location:</strong> MitoDerm Conference Hall, Ramat Gan</p>
        </div>
        
        <div className="success-actions">
          <Link href={`/${lang}/event`} className="event-button">
            Back to Event Page
          </Link>
          <Link href={`/${lang}`} className="home-button">
            Home
          </Link>
        </div>
        
        {/* Google Analytics Event Tracking */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof gtag === 'function') {
                gtag('event', 'event_registration', {
                  'event_category': 'event',
                  'event_label': 'conference_registration'
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
          max-width: 600px;
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
        
        h2 {
          font-size: 22px;
          margin: 30px 0 15px;
          color: #444;
        }
        
        .success-message {
          font-size: 18px;
          line-height: 1.6;
          color: #555;
          margin-bottom: 20px;
        }
        
        .event-details {
          background: #f9f9f9;
          border-radius: 6px;
          padding: 20px;
          margin: 25px 0;
          text-align: left;
        }
        
        .event-details p {
          margin: 8px 0;
          font-size: 16px;
        }
        
        .success-actions {
          margin-top: 30px;
          display: flex;
          justify-content: center;
          gap: 16px;
        }
        
        .event-button {
          display: inline-block;
          background: #0070f3;
          color: white;
          padding: 12px 24px;
          border-radius: 4px;
          text-decoration: none;
          font-weight: 500;
          transition: background 0.3s ease;
        }
        
        .home-button {
          display: inline-block;
          background: #f3f3f3;
          color: #444;
          padding: 12px 24px;
          border-radius: 4px;
          text-decoration: none;
          font-weight: 500;
          transition: background 0.3s ease;
        }
        
        .event-button:hover {
          background: #0058cc;
        }
        
        .home-button:hover {
          background: #e0e0e0;
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
          
          .success-actions {
            flex-direction: column;
            gap: 12px;
          }
          
          .event-button, .home-button {
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
} 