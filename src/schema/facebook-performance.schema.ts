import { FacebookPerformancetDefinition } from '@definitions';
import { Schema } from 'mongoose';

export const FacebookPerformanceSchema = new Schema(FacebookPerformancetDefinition, {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  toJSON: {
    getters: true,
    virtuals: true
  }
});
