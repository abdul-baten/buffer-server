import { FacebookVideoDefinition } from '@definitions';
import { Schema } from 'mongoose';

export const FacebookVideoSchema = new Schema(FacebookVideoDefinition, {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  toJSON: {
    getters: true,
    virtuals: true
  }
});
