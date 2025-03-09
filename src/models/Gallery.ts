import mongoose, { Schema, model, models } from 'mongoose';

export interface IGalleryItem {
  beforeImage: string;
  afterImage: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const galleryItemSchema = new Schema<IGalleryItem>(
  {
    beforeImage: {
      type: String,
      required: [true, 'Before image is required'],
    },
    afterImage: {
      type: String,
      required: [true, 'After image is required'],
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Индекс для сортировки по порядку
galleryItemSchema.index({ order: 1 });

export default models.Gallery || model<IGalleryItem>('Gallery', galleryItemSchema); 