import mongoose, { Schema, model, models } from 'mongoose';
import { LocaleType } from '@/types';

export interface IBlogPost {
  title: Record<LocaleType, string>;
  slug: Record<LocaleType, string>;
  content: Record<LocaleType, string>;
  excerpt: Record<LocaleType, string>;
  featuredImage: string;
  images: string[];
  author: string;
  status: 'draft' | 'published';
  tags: string[];
  categories: string[];
  seo: {
    title?: Record<LocaleType, string>;
    description?: Record<LocaleType, string>;
    keywords?: string[];
    ogImage?: string;
  };
  views: number;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const blogPostSchema = new Schema<IBlogPost>(
  {
    title: {
      en: { type: String, required: true },
      ru: { type: String, required: true },
      he: { type: String, required: true },
    },
    slug: {
      en: { type: String, required: true, unique: true },
      ru: { type: String, required: true, unique: true },
      he: { type: String, required: true, unique: true },
    },
    content: {
      en: { type: String, required: true },
      ru: { type: String, required: true },
      he: { type: String, required: true },
    },
    excerpt: {
      en: { type: String, required: true },
      ru: { type: String, required: true },
      he: { type: String, required: true },
    },
    featuredImage: { type: String, required: true },
    images: [{ type: String }],
    author: { type: String, required: true },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    tags: [{ type: String }],
    categories: [{ type: String }],
    seo: {
      title: {
        en: { type: String },
        ru: { type: String },
        he: { type: String },
      },
      description: {
        en: { type: String },
        ru: { type: String },
        he: { type: String },
      },
      keywords: [{ type: String }],
      ogImage: { type: String },
    },
    views: { type: Number, default: 0 },
    publishedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

// Создаем индексы для быстрого поиска
blogPostSchema.index({ 'slug.en': 1 });
blogPostSchema.index({ 'slug.ru': 1 });
blogPostSchema.index({ 'slug.he': 1 });
blogPostSchema.index({ status: 1 });
blogPostSchema.index({ tags: 1 });
blogPostSchema.index({ categories: 1 });
blogPostSchema.index({ publishedAt: -1 });
blogPostSchema.index({ views: -1 });

export default models.BlogPost || model<IBlogPost>('BlogPost', blogPostSchema); 