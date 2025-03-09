import mongoose, { Schema, model, models } from 'mongoose';

export interface IReview {
  name: string;
  rating: number;
  text: string;
  isTranslationKey?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating must be at most 5'],
    },
    text: {
      type: String,
      required: [true, 'Review text is required'],
    },
    isTranslationKey: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default models.Review || model<IReview>('Review', reviewSchema); 