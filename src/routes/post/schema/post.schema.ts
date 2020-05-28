import { PostDefinition } from '../definition/post.definition';
import { Schema } from 'mongoose';

export const PostSchema = new Schema(PostDefinition, {
  toJSON: { getters: true, virtuals: true },
});
