import { FacebookOverviewDefinition } from '@definitions';
import { Schema } from 'mongoose';

export const FacebookOverviewSchema = new Schema(FacebookOverviewDefinition, {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  toJSON: {
    getters: true,
    virtuals: true
  }
});
