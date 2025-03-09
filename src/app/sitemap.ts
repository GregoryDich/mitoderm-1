import { MetadataRoute } from 'next';

const baseUrl = 'https://www.mitoderm.com';
const languages = ['en', 'he', 'ru'];
const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

// Blog post slugs
const blogSlugs = [
  'exosome-therapy-future',
  'hair-loss-treatment',
  'acne-scars-solutions',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const mainRoutes = languages.map((lang) => ({
    url: `${baseUrl}/${lang}`,
    lastModified: today,
    changeFrequency: 'weekly' as const,
    priority: 1,
  }));

  const sections = [
    { path: 'about', priority: 0.8 },
    { path: 'solution', priority: 0.8 },
    { path: 'gallery', priority: 0.7 },
    { path: 'mission', priority: 0.7 },
    { path: 'faq', priority: 0.6 },
    { path: 'contact', priority: 0.9 },
  ];

  const sectionRoutes = languages.flatMap((lang) =>
    sections.map((section) => ({
      url: `${baseUrl}/${lang}#${section.path}`,
      lastModified: today,
      changeFrequency: 'monthly' as const,
      priority: section.priority,
    }))
  );

  const pageRoutes = languages.flatMap((lang) => [
    {
      url: `${baseUrl}/${lang}/event`,
      lastModified: today,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/${lang}/form`,
      lastModified: today,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/${lang}/event/form`,
      lastModified: today,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/${lang}/blog`,
      lastModified: today,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/${lang}/sitemap`,
      lastModified: today,
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/${lang}/privacy-policy`,
      lastModified: today,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/${lang}/accessibility`,
      lastModified: today,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    // Form success pages with robots: false flag to avoid indexing
    {
      url: `${baseUrl}/${lang}/form/success`,
      lastModified: today,
      changeFrequency: 'never' as const,
      priority: 0.1,
    },
    {
      url: `${baseUrl}/${lang}/event/form/success`,
      lastModified: today,
      changeFrequency: 'never' as const,
      priority: 0.1,
    },
  ]);

  // Add blog post routes
  const blogRoutes = languages.flatMap((lang) =>
    blogSlugs.map((slug) => ({
      url: `${baseUrl}/${lang}/blog/${slug}`,
      lastModified: today,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  );

  return [...mainRoutes, ...sectionRoutes, ...pageRoutes, ...blogRoutes];
}