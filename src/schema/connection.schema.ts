import { ConnectionDefinition } from '@definitions';
import { Schema } from 'mongoose';

export const ConnectionSchema = new Schema(ConnectionDefinition, {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  toJSON: {
    getters: true,
    virtuals: true
  }
});
