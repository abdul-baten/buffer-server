import { PostDefinition } from '@definitions';
import { Schema } from 'mongoose';

export const PostSchema = new Schema(PostDefinition, {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  toJSON: {
    getters: true,
    virtuals: true
  }
});
