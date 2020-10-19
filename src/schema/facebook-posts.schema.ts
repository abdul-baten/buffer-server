import { FacebookPostsDefinition } from '@definitions';
import { Schema } from 'mongoose';

export const FacebookPostsSchema = new Schema(FacebookPostsDefinition, {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  toJSON: {
    getters: true,
    virtuals: true
  }
});
