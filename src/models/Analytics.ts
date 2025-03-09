import mongoose, { Schema, model, models } from 'mongoose';

export interface IPageView {
  path: string;
  referer: string;
  userAgent: string;
  ip: string;
  language: string;
  timestamp: Date;
}

export interface IFormSubmission {
  formType: 'contact' | 'event' | 'other';
  data: Record<string, any>;
  successful: boolean;
  ip: string;
  userAgent: string;
  language: string;
  timestamp: Date;
}

// Схема для просмотров страниц
const pageViewSchema = new Schema<IPageView>({
  path: { type: String, required: true },
  referer: { type: String, default: '' },
  userAgent: { type: String, default: '' },
  ip: { type: String, default: '' },
  language: { type: String, default: 'en' },
  timestamp: { type: Date, default: Date.now },
});

// Схема для отправок форм
const formSubmissionSchema = new Schema<IFormSubmission>({
  formType: {
    type: String,
    enum: ['contact', 'event', 'other'],
    required: true,
  },
  data: { type: Schema.Types.Mixed, required: true },
  successful: { type: Boolean, default: true },
  ip: { type: String, default: '' },
  userAgent: { type: String, default: '' },
  language: { type: String, default: 'en' },
  timestamp: { type: Date, default: Date.now },
});

// Индексы для быстрого поиска
pageViewSchema.index({ path: 1 });
pageViewSchema.index({ timestamp: -1 });
pageViewSchema.index({ language: 1 });

formSubmissionSchema.index({ formType: 1 });
formSubmissionSchema.index({ timestamp: -1 });
formSubmissionSchema.index({ successful: 1 });
formSubmissionSchema.index({ language: 1 });

// Экспортируем модели
export const PageView = models.PageView || model<IPageView>('PageView', pageViewSchema);
export const FormSubmission = models.FormSubmission || model<IFormSubmission>('FormSubmission', formSubmissionSchema); 