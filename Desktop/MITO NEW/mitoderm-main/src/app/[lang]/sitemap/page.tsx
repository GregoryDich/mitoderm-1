import { unstable_setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import Link from 'next/link';

// Define proper type for component props
interface SitemapPageProps {
  params: {
    lang: string;
  };
}

// Generate metadata for the sitemap page
export function generateMetadata({ params }: SitemapPageProps): Metadata {
  return {
    title: 'Site Map | MitoDerm',
    description: 'A complete list of all pages on the MitoDerm website for easy navigation.',
    alternates: {
      canonical: `https://www.mitoderm.com/${params.lang}/sitemap`,
      languages: {
        'en': 'https://www.mitoderm.com/en/sitemap',
        'he': 'https://www.mitoderm.com/he/sitemap',
        'ru': 'https://www.mitoderm.com/ru/sitemap',
      },
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function SitemapPage({ params: { lang } }: SitemapPageProps) {
  unstable_setRequestLocale(lang);

  // Site structure data
  const siteStructure = [
    {
      title: 'Main Pages',
      links: [
        { name: 'Home', url: `/${lang}` },
        { name: 'Event', url: `/${lang}/event` },
        { name: 'Contact Form', url: `/${lang}/form` },
        { name: 'Event Registration', url: `/${lang}/event/form` },
        { name: 'Blog', url: `/${lang}/blog` },
      ],
    },
    {
      title: 'Home Page Sections',
      links: [
        { name: 'About Us', url: `/${lang}#about` },
        { name: 'Products', url: `/${lang}#solution` },
        { name: 'Gallery', url: `/${lang}#gallery` },
        { name: 'Mission', url: `/${lang}#mission` },
        { name: 'FAQ', url: `/${lang}#faq` },
        { name: 'Contact', url: `/${lang}#contact` },
      ],
    },
    {
      title: 'Blog Articles',
      links: [
        { name: 'The Future of Exosome Therapy in Aesthetics', url: `/${lang}/blog/exosome-therapy-future` },
        { name: 'Advanced Hair Loss Treatments with Exosomes', url: `/${lang}/blog/hair-loss-treatment` },
        { name: 'Treating Acne Scars: The Exosome Approach', url: `/${lang}/blog/acne-scars-solutions` },
      ],
    },
    {
      title: 'Legal & Information',
      links: [
        { name: 'Privacy Policy', url: `/${lang}/privacy-policy` },
        { name: 'Accessibility Statement', url: `/${lang}/accessibility` },
        { name: 'This Sitemap', url: `/${lang}/sitemap` },
      ],
    },
  ];

  return (
    <main className="sitemap-container">
      <h1>Site Map</h1>
      <p className="sitemap-intro">
        Welcome to the MitoDerm site map. This page provides a complete overview of all the content available on our website.
      </p>

      {siteStructure.map((section, index) => (
        <div key={index} className="sitemap-section">
          <h2>{section.title}</h2>
          <ul className="sitemap-links">
            {section.links.map((link, linkIndex) => (
              <li key={linkIndex}>
                <Link href={link.url}>
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div className="sitemap-languages">
        <h2>Available Languages</h2>
        <ul className="sitemap-links">
          <li><Link href="/en/sitemap">English</Link></li>
          <li><Link href="/he/sitemap">Hebrew (עברית)</Link></li>
          <li><Link href="/ru/sitemap">Russian (Русский)</Link></li>
        </ul>
      </div>

      <style jsx>{`
        .sitemap-container {
          max-width: 800px;
          margin: 60px auto;
          padding: 0 20px;
        }
        
        h1 {
          font-size: 36px;
          margin-bottom: 20px;
          color: #333;
        }
        
        .sitemap-intro {
          font-size: 18px;
          color: #555;
          margin-bottom: 40px;
          line-height: 1.6;
        }
        
        .sitemap-section {
          margin-bottom: 40px;
        }
        
        h2 {
          font-size: 24px;
          color: #444;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 1px solid #eaeaea;
        }
        
        .sitemap-links {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .sitemap-links li {
          margin-bottom: 12px;
        }
        
        .sitemap-links a {
          color: #0070f3;
          text-decoration: none;
          font-size: 16px;
          transition: color 0.2s ease;
        }
        
        .sitemap-links a:hover {
          color: #004bb4;
          text-decoration: underline;
        }
        
        .sitemap-languages {
          margin-top: 60px;
          padding-top: 20px;
          border-top: 2px solid #eaeaea;
        }
        
        @media (max-width: 768px) {
          h1 {
            font-size: 28px;
          }
          
          h2 {
            font-size: 20px;
          }
          
          .sitemap-intro {
            font-size: 16px;
          }
        }
      `}</style>
    </main>
  );
} 