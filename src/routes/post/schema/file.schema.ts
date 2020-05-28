import { FileDefinition } from '../definition/file.definition';
import { Schema } from 'mongoose';

export const FileSchema = new Schema(FileDefinition, {
  toJSON: { getters: true, virtuals: true },
});
