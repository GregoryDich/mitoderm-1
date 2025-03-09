import { unstable_setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

// Define proper type for component props
interface BlogPageProps {
  params: {
    lang: string;
  };
}

// Sample blog post data
const blogPosts = [
  {
    id: 'exosome-therapy-future',
    title: 'The Future of Exosome Therapy in Aesthetics',
    excerpt: 'Discover how exosome therapy is revolutionizing the field of aesthetics and skincare. Learn about the latest research and applications.',
    date: '2025-03-01',
    imageUrl: '/images/blog/exosome-therapy.jpg',
    author: 'Dr. Maria Cohen',
  },
  {
    id: 'hair-loss-treatment',
    title: 'Advanced Hair Loss Treatments with Exosomes',
    excerpt: 'Exploring how exosome therapy is changing the landscape of hair restoration with promising results for both men and women.',
    date: '2025-02-15',
    imageUrl: '/images/blog/hair-loss.jpg',
    author: 'Dr. James Wilson',
  },
  {
    id: 'acne-scars-solutions',
    title: 'Treating Acne Scars: The Exosome Approach',
    excerpt: 'New approaches to treating stubborn acne scars using exosome therapy and the science behind it.',
    date: '2025-01-20',
    imageUrl: '/images/blog/acne-scars.jpg',
    author: 'Dr. Sarah Miller',
  },
];

// Generate metadata for the blog page
export function generateMetadata({ params }: BlogPageProps): Metadata {
  return {
    title: 'MitoDerm Blog | Latest Research on Exosome Therapy',
    description: 'Explore the latest research, case studies, and innovations in exosome therapy for skin rejuvenation, hair loss treatment, and aesthetic procedures.',
    alternates: {
      canonical: `https://www.mitoderm.com/${params.lang}/blog`,
      languages: {
        'en': 'https://www.mitoderm.com/en/blog',
        'he': 'https://www.mitoderm.com/he/blog',
        'ru': 'https://www.mitoderm.com/ru/blog',
      },
    },
    openGraph: {
      url: `https://www.mitoderm.com/${params.lang}/blog`,
      title: 'MitoDerm Blog - Exosome Therapy Research and Insights',
      description: 'Stay updated with the latest developments in exosome therapy for aesthetics, skin rejuvenation, and more.',
      images: [
        {
          url: 'https://www.mitoderm.com/images/blog/blog-og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'MitoDerm Blog',
        },
      ],
    },
  };
}

export default function BlogPage({ params: { lang } }: BlogPageProps) {
  unstable_setRequestLocale(lang);

  return (
    <main className="blog-container">
      <div className="blog-header">
        <h1>MitoDerm Blog</h1>
        <p>Explore the latest insights, research, and applications of exosome therapy in aesthetics</p>
      </div>

      <div className="blog-posts">
        {blogPosts.map((post) => (
          <article key={post.id} className="blog-post">
            <div className="post-image">
              <Image 
                src={post.imageUrl} 
                alt={post.title}
                width={400}
                height={250}
                className="post-thumbnail"
              />
            </div>
            <div className="post-content">
              <span className="post-date">{new Date(post.date).toLocaleDateString()}</span>
              <h2 className="post-title">{post.title}</h2>
              <p className="post-excerpt">{post.excerpt}</p>
              <p className="post-author">By {post.author}</p>
              <Link href={`/${lang}/blog/${post.id}`} className="read-more">
                Read more
              </Link>
            </div>
          </article>
        ))}
      </div>

      <style jsx global>{`
        .blog-container {
          max-width: 1200px;
          margin: 60px auto;
          padding: 0 20px;
        }
        .blog-header {
          text-align: center;
          margin-bottom: 60px;
        }
        .blog-header h1 {
          font-size: 42px;
          margin-bottom: 16px;
        }
        .blog-header p {
          font-size: 18px;
          color: #555;
        }
        .blog-posts {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 30px;
        }
        .blog-post {
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          transition: transform 0.3s ease;
        }
        .blog-post:hover {
          transform: translateY(-5px);
        }
        .post-image {
          width: 100%;
          height: 250px;
          position: relative;
        }
        .post-thumbnail {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .post-content {
          padding: 20px;
        }
        .post-date {
          font-size: 14px;
          color: #777;
        }
        .post-title {
          margin: 10px 0;
          font-size: 22px;
        }
        .post-excerpt {
          color: #444;
          margin-bottom: 15px;
        }
        .post-author {
          font-style: italic;
          color: #666;
          margin-bottom: 15px;
        }
        .read-more {
          display: inline-block;
          color: #0070f3;
          font-weight: 500;
          text-decoration: none;
        }
        .read-more:hover {
          text-decoration: underline;
        }
        @media (max-width: 768px) {
          .blog-posts {
            grid-template-columns: 1fr;
          }
          .blog-header h1 {
            font-size: 32px;
          }
        }
      `}</style>
    </main>
  );
} 