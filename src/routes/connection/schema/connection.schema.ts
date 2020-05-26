import { ConnectionDefinition } from '../definition/connection.definition';
import { Schema } from 'mongoose';

export const ConnectionSchema = new Schema(ConnectionDefinition, {
  toJSON: { getters: true, virtuals: true },
});
