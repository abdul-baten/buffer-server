import { MediaDefinition } from '@definitions';
import { Schema } from 'mongoose';

export const MediaSchema = new Schema(MediaDefinition, {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  toJSON: {
    getters: true,
    virtuals: true
  }
});
