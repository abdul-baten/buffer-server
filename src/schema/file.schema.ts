import { FileDefinition } from '@definitions';
import { Schema } from 'mongoose';

export const FileSchema = new Schema(FileDefinition, {
  toJSON: { getters: true, virtuals: true },
});
