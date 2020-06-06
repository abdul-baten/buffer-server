import { MediaDefinition } from '@definitions';
import { Schema } from 'mongoose';

export const MediaSchema = new Schema(MediaDefinition, {
  toJSON: { getters: true, virtuals: true },
});
