import mongoose, { Schema, model, models } from 'mongoose';
import { LocaleType } from '@/types';

export interface ISiteContent {
  key: string;
  section: string;
  content: Record<LocaleType, string>;
  description?: string;
  isHTML: boolean;
  updatedAt: Date;
  createdAt: Date;
}

export interface ISeoSettings {
  page: string;
  title: Record<LocaleType, string>;
  description: Record<LocaleType, string>;
  keywords: Record<LocaleType, string[]>;
  ogImage?: string;
  structuredData?: Record<string, any>;
  updatedAt: Date;
  createdAt: Date;
}

// Схема для контента сайта
const siteContentSchema = new Schema<ISiteContent>(
  {
    key: { type: String, required: true, unique: true },
    section: { type: String, required: true },
    content: {
      en: { type: String, required: true },
      ru: { type: String, required: true },
      he: { type: String, required: true },
    },
    description: { type: String },
    isHTML: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Схема для SEO настроек
const seoSettingsSchema = new Schema<ISeoSettings>(
  {
    page: { type: String, required: true, unique: true },
    title: {
      en: { type: String, required: true },
      ru: { type: String, required: true },
      he: { type: String, required: true },
    },
    description: {
      en: { type: String, required: true },
      ru: { type: String, required: true },
      he: { type: String, required: true },
    },
    keywords: {
      en: [{ type: String }],
      ru: [{ type: String }],
      he: [{ type: String }],
    },
    ogImage: { type: String },
    structuredData: { type: Schema.Types.Mixed },
  },
  {
    timestamps: true,
  }
);

// Индексы для быстрого поиска
siteContentSchema.index({ key: 1 });
siteContentSchema.index({ section: 1 });
seoSettingsSchema.index({ page: 1 });

// Экспортируем модели
export const SiteContent = models.SiteContent || model<ISiteContent>('SiteContent', siteContentSchema);
export const SeoSettings = models.SeoSettings || model<ISeoSettings>('SeoSettings', seoSettingsSchema); 