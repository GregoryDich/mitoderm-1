import { unstable_setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Define proper type for component props
interface BlogPostPageProps {
  params: {
    lang: string;
    slug: string;
  };
}

// Sample blog post data (this would normally come from a CMS or database)
const blogPosts = {
  'exosome-therapy-future': {
    title: 'The Future of Exosome Therapy in Aesthetics',
    excerpt: 'Discover how exosome therapy is revolutionizing the field of aesthetics and skincare. Learn about the latest research and applications.',
    date: '2025-03-01',
    imageUrl: '/images/blog/exosome-therapy.jpg',
    author: 'Dr. Maria Cohen',
    authorBio: 'Dr. Maria Cohen is a dermatologist and researcher specializing in regenerative medicine and advanced skin treatments.',
    content: `
      <p>Exosome therapy represents a significant advancement in the field of aesthetic medicine, offering a promising new approach to skin rejuvenation and hair restoration. Unlike traditional treatments that often address only the symptoms of aging or skin damage, exosome therapy targets the cellular mechanisms involved in regeneration and repair.</p>
      
      <h2>What are Exosomes?</h2>
      <p>Exosomes are tiny vesicles released by cells that contain various bioactive molecules, including proteins, lipids, and nucleic acids. They play a crucial role in cell-to-cell communication and can influence the behavior of recipient cells. In aesthetic applications, exosomes derived from stem cells are particularly valuable due to their regenerative properties.</p>
      
      <h2>Current Applications in Aesthetics</h2>
      <p>The aesthetic industry has begun to harness the power of exosomes for various treatments, including:</p>
      <ul>
        <li><strong>Skin Rejuvenation:</strong> Exosomes can stimulate collagen production, improve skin texture, and reduce the appearance of fine lines and wrinkles.</li>
        <li><strong>Hair Restoration:</strong> By promoting hair follicle activity, exosomes show promise in treating hair thinning and loss.</li>
        <li><strong>Wound Healing:</strong> The regenerative properties of exosomes can accelerate wound healing and reduce scarring.</li>
        <li><strong>Post-Procedure Recovery:</strong> After procedures like microneedling or laser treatments, exosomes can enhance results and reduce downtime.</li>
      </ul>
      
      <h2>The Science Behind the Success</h2>
      <p>Recent studies have demonstrated that exosomes can modulate inflammation, promote angiogenesis (the formation of new blood vessels), and stimulate cell proliferation. These mechanisms contribute to their effectiveness in aesthetic treatments. Furthermore, their small size allows them to penetrate the skin barrier more effectively than larger molecules.</p>
      
      <h2>Future Directions</h2>
      <p>As research in this field continues to advance, we can expect to see more targeted exosome formulations designed for specific aesthetic concerns. The potential for personalized treatments, where exosomes are tailored to an individual's unique needs, represents an exciting frontier in aesthetic medicine.</p>
      
      <p>At MitoDerm, we're committed to staying at the forefront of these innovations, bringing the most advanced and effective exosome-based treatments to our clients.</p>
    `,
    tags: ['exosome therapy', 'skin rejuvenation', 'aesthetic medicine', 'regenerative medicine', 'anti-aging'],
    relatedPosts: ['hair-loss-treatment', 'acne-scars-solutions'],
  },
  'hair-loss-treatment': {
    title: 'Advanced Hair Loss Treatments with Exosomes',
    excerpt: 'Exploring how exosome therapy is changing the landscape of hair restoration with promising results for both men and women.',
    date: '2025-02-15',
    imageUrl: '/images/blog/hair-loss.jpg',
    author: 'Dr. James Wilson',
    authorBio: 'Dr. James Wilson is a trichologist with over 15 years of experience in hair restoration and regenerative medicine.',
    content: `
      <p>Hair loss affects millions of people worldwide, impacting not just appearance but also self-confidence and psychological well-being. While traditional treatments have shown limited success, exosome therapy is emerging as a promising solution for hair restoration.</p>
      
      <h2>The Hair Loss Challenge</h2>
      <p>Pattern hair loss, or androgenetic alopecia, is the most common form of hair loss, affecting both men and women. It's characterized by the progressive miniaturization of hair follicles, leading to thinner, shorter hair and eventually, no hair growth at all. Conventional treatments have focused on either blocking DHT (dihydrotestosterone) or stimulating blood flow to the scalp, with variable results.</p>
      
      <h2>How Exosomes Address Hair Loss</h2>
      <p>Exosomes work on multiple fronts to combat hair loss:</p>
      <ul>
        <li><strong>Revitalizing Hair Follicles:</strong> Exosomes can reactivate dormant hair follicles, promoting new growth.</li>
        <li><strong>Extending the Growth Phase:</strong> They help prolong the anagen (growth) phase of the hair cycle.</li>
        <li><strong>Improving Blood Supply:</strong> Enhanced microcirculation delivers more nutrients to hair follicles.</li>
        <li><strong>Modulating Inflammation:</strong> Exosomes can reduce scalp inflammation, which often contributes to hair loss.</li>
      </ul>
      
      <h2>Clinical Evidence</h2>
      <p>Recent clinical studies have demonstrated significant improvements in hair density, thickness, and growth after exosome treatments. In one study, patients receiving exosome therapy showed a 31% increase in hair count after just three months, compared to only a 10% increase with traditional treatments.</p>
      
      <h2>The Treatment Experience</h2>
      <p>Exosome hair treatments are typically administered through a series of scalp injections or microneedling procedures. The procedure is minimally invasive, with little to no downtime. Most patients require 3-4 sessions spaced 4-6 weeks apart for optimal results.</p>
      
      <h2>Who Can Benefit?</h2>
      <p>Exosome therapy for hair loss is suitable for both men and women experiencing various forms of hair thinning. It's particularly effective for those in the early to moderate stages of hair loss. However, results can vary based on individual factors such as the extent of hair loss, age, and overall health.</p>
      
      <p>At MitoDerm, we offer personalized exosome hair restoration programs tailored to each client's specific needs and goals.</p>
    `,
    tags: ['hair loss treatment', 'exosome therapy', 'hair restoration', 'male pattern baldness', 'female hair thinning'],
    relatedPosts: ['exosome-therapy-future', 'acne-scars-solutions'],
  },
  'acne-scars-solutions': {
    title: 'Treating Acne Scars: The Exosome Approach',
    excerpt: 'New approaches to treating stubborn acne scars using exosome therapy and the science behind it.',
    date: '2025-01-20',
    imageUrl: '/images/blog/acne-scars.jpg',
    author: 'Dr. Sarah Miller',
    authorBio: 'Dr. Sarah Miller specializes in dermatology with a focus on scar treatment and skin texture improvement using advanced regenerative techniques.',
    content: `
      <p>Acne scars are among the most challenging skin concerns to address, often requiring multiple treatment approaches to achieve significant improvement. Exosome therapy is now offering new hope for those with stubborn acne scarring, providing an innovative solution that targets the root causes of scar formation.</p>
      
      <h2>Understanding Acne Scars</h2>
      <p>Acne scars develop when the body's healing process after acne inflammation creates excess collagen, leading to raised scars, or when there's a loss of tissue, resulting in depressed scars. Traditional treatments have focused on either resurfacing the skin (e.g., lasers, chemical peels) or stimulating collagen production (e.g., microneedling), but results are often limited.</p>
      
      <h2>The Exosome Difference</h2>
      <p>Exosomes offer a more comprehensive approach to scar treatment by:</p>
      <ul>
        <li><strong>Remodeling Scar Tissue:</strong> Exosomes help reorganize collagen fibers for a more natural structure.</li>
        <li><strong>Reducing Inflammation:</strong> They modulate the inflammatory response that contributes to scar formation.</li>
        <li><strong>Promoting Healthy Cell Function:</strong> By delivering growth factors and signaling molecules, exosomes support optimal cellular activity.</li>
        <li><strong>Enhancing Skin Barrier Function:</strong> Improved barrier function leads to better overall skin health.</li>
      </ul>
      
      <h2>Combined Treatment Approaches</h2>
      <p>While exosomes can be used as a standalone treatment, they often show the best results when combined with other modalities. For example, applying exosomes immediately after microneedling or laser treatment can significantly enhance outcomes. The microneedling or laser creates controlled micro-injuries that allow better penetration of the exosomes, while the exosomes accelerate healing and optimize the remodeling process.</p>
      
      <h2>What to Expect</h2>
      <p>A typical exosome treatment for acne scars involves:</p>
      <ol>
        <li>Initial consultation and skin assessment</li>
        <li>Preparation of the skin with gentle cleansing</li>
        <li>Application of exosomes, often combined with microneedling or other delivery methods</li>
        <li>Post-treatment care to maximize results</li>
      </ol>
      
      <p>Multiple sessions are usually required, spaced 4-6 weeks apart. Improvements generally become visible after the second or third treatment, with continued enhancement over time as the skin remodeling process progresses.</p>
      
      <h2>Long-term Results</h2>
      <p>One of the most significant advantages of exosome therapy for acne scars is the potential for long-lasting results. By addressing the underlying structural issues in the skin, rather than just surface appearance, exosomes help create more sustainable improvements.</p>
      
      <p>At MitoDerm, we offer customized exosome treatments for acne scars, tailored to each client's specific scar types, skin condition, and goals.</p>
    `,
    tags: ['acne scars', 'scar treatment', 'exosome therapy', 'skin regeneration', 'microneedling'],
    relatedPosts: ['exosome-therapy-future', 'hair-loss-treatment'],
  }
};

// Generate static params for all blog posts
export async function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({ 
    slug, 
    lang: 'en' 
  }));
}

// Generate metadata for the blog post page
export function generateMetadata({ params }: BlogPostPageProps): Metadata {
  const { slug, lang } = params;
  const post = blogPosts[slug as keyof typeof blogPosts];
  
  // If post doesn't exist, return default metadata
  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.',
    };
  }
  
  return {
    title: `${post.title} | MitoDerm Blog`,
    description: post.excerpt,
    alternates: {
      canonical: `https://www.mitoderm.com/${lang}/blog/${slug}`,
      languages: {
        'en': `https://www.mitoderm.com/en/blog/${slug}`,
        'he': `https://www.mitoderm.com/he/blog/${slug}`,
        'ru': `https://www.mitoderm.com/ru/blog/${slug}`,
      },
    },
    openGraph: {
      type: 'article',
      url: `https://www.mitoderm.com/${lang}/blog/${slug}`,
      title: post.title,
      description: post.excerpt,
      images: [
        {
          url: `https://www.mitoderm.com${post.imageUrl}`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      publishedTime: new Date(post.date).toISOString(),
      authors: [post.author],
      tags: post.tags,
    },
  };
}

export default function BlogPostPage({ params: { lang, slug } }: BlogPostPageProps) {
  unstable_setRequestLocale(lang);
  
  // Get the post data
  const post = blogPosts[slug as keyof typeof blogPosts];
  
  // If post doesn't exist, return 404
  if (!post) {
    notFound();
  }
  
  // Get related posts
  const relatedPostsData = post.relatedPosts.map(
    (relatedSlug) => ({ 
      slug: relatedSlug, 
      ...blogPosts[relatedSlug as keyof typeof blogPosts]
    })
  );

  return (
    <main className="blog-post-container">
      <div className="blog-post-header">
        <Link href={`/${lang}/blog`} className="back-to-blog">
          ← Back to blog
        </Link>
        
        <h1>{post.title}</h1>
        
        <div className="blog-post-meta">
          <div className="post-author-info">
            <span>By {post.author}</span>
            <span className="post-date">{new Date(post.date).toLocaleDateString()}</span>
          </div>
          <div className="post-tags">
            {post.tags.map((tag) => (
              <span key={tag} className="post-tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div className="blog-post-featured-image">
        <Image
          src={post.imageUrl}
          alt={post.title}
          width={1200}
          height={600}
          className="post-featured-image"
        />
      </div>
      
      <div className="blog-post-content">
        <div className="author-bio">
          <h3>About the Author</h3>
          <p>{post.authorBio}</p>
        </div>
        
        <article 
          className="post-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
      
      {relatedPostsData.length > 0 && (
        <div className="related-posts">
          <h2>Related Articles</h2>
          <div className="related-posts-grid">
            {relatedPostsData.map((relatedPost) => (
              <div key={relatedPost.slug} className="related-post">
                <Link href={`/${lang}/blog/${relatedPost.slug}`}>
                  <div className="related-post-image">
                    <Image
                      src={relatedPost.imageUrl}
                      alt={relatedPost.title}
                      width={300}
                      height={180}
                    />
                  </div>
                  <h3>{relatedPost.title}</h3>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <style jsx global>{`
        .blog-post-container {
          max-width: 900px;
          margin: 60px auto;
          padding: 0 20px;
        }
        
        .blog-post-header {
          margin-bottom: 30px;
        }
        
        .back-to-blog {
          display: inline-block;
          margin-bottom: 20px;
          color: #0070f3;
          text-decoration: none;
        }
        
        .back-to-blog:hover {
          text-decoration: underline;
        }
        
        .blog-post-header h1 {
          font-size: 40px;
          line-height: 1.2;
          margin-bottom: 20px;
        }
        
        .blog-post-meta {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }
        
        .post-author-info {
          display: flex;
          flex-direction: column;
        }
        
        .post-date {
          color: #666;
          font-size: 14px;
          margin-top: 5px;
        }
        
        .post-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        
        .post-tag {
          background-color: #f0f0f0;
          padding: 5px 10px;
          border-radius: 15px;
          font-size: 12px;
          color: #555;
        }
        
        .blog-post-featured-image {
          margin-bottom: 40px;
          border-radius: 8px;
          overflow: hidden;
        }
        
        .post-featured-image {
          width: 100%;
          height: auto;
          object-fit: cover;
        }
        
        .blog-post-content {
          display: grid;
          grid-template-columns: 1fr 3fr;
          gap: 30px;
        }
        
        .author-bio {
          padding: 20px;
          background-color: #f9f9f9;
          border-radius: 8px;
          height: fit-content;
        }
        
        .author-bio h3 {
          margin-top: 0;
          margin-bottom: 10px;
        }
        
        .post-content {
          font-size: 18px;
          line-height: 1.6;
          color: #333;
        }
        
        .post-content h2 {
          margin-top: 40px;
          margin-bottom: 20px;
        }
        
        .post-content p {
          margin-bottom: 20px;
        }
        
        .post-content ul,
        .post-content ol {
          margin-bottom: 20px;
          padding-left: 20px;
        }
        
        .post-content li {
          margin-bottom: 10px;
        }
        
        .related-posts {
          margin-top: 60px;
          padding-top: 40px;
          border-top: 1px solid #eaeaea;
        }
        
        .related-posts h2 {
          margin-bottom: 30px;
        }
        
        .related-posts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 30px;
        }
        
        .related-post {
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          transition: transform 0.3s ease;
        }
        
        .related-post:hover {
          transform: translateY(-5px);
        }
        
        .related-post-image {
          width: 100%;
          height: 180px;
          overflow: hidden;
        }
        
        .related-post-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        
        .related-post:hover .related-post-image img {
          transform: scale(1.05);
        }
        
        .related-post h3 {
          padding: 15px;
          margin: 0;
          font-size: 18px;
          color: #333;
        }
        
        @media (max-width: 768px) {
          .blog-post-header h1 {
            font-size: 32px;
          }
          
          .blog-post-content {
            grid-template-columns: 1fr;
          }
          
          .author-bio {
            order: 2;
            margin-top: 40px;
          }
          
          .post-content {
            order: 1;
          }
        }
      `}</style>
    </main>
  );
} 