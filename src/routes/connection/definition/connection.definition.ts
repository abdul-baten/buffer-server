import { E_CONNECTION_STATUS, E_CONNECTION_TYPE } from '@app/enum';
import { SchemaDefinition, Types } from 'mongoose';

export const ConnectionDefinition: SchemaDefinition = {
  connectionType: {
    enum: [
      E_CONNECTION_TYPE.FACEBOOK_PAGE,
      E_CONNECTION_TYPE.FACEBOOK_GROUP,
      E_CONNECTION_TYPE.INSTAGRAM_BUSINESS,
      E_CONNECTION_TYPE.INSTAGRAM_PERSONAL,
      E_CONNECTION_TYPE.LINKEDIN_PAGE,
      E_CONNECTION_TYPE.LINKEDIN_PROFILE,
      E_CONNECTION_TYPE.PINTEREST,
      E_CONNECTION_TYPE.TWITTER,
    ],
    trim: true,
    type: String,
    required: [true, 'Connection Type is required.'],
  },
  connectionID: {
    type: String,
    required: [true, 'Connection ID is required.'],
  },
  connectionName: {
    type: String,
    required: [true, 'Connection Name is required.'],
  },
  connectionCategory: {
    type: String,
    required: [true, 'Connection Category is required.'],
  },
  connectionStatus: {
    enum: [E_CONNECTION_STATUS.DISABLED, E_CONNECTION_STATUS.ENABLED],
    type: String,
    required: [true, 'Connection Status is required.'],
  },
  connectionPicture: {
    type: String,
    required: [true, 'Connection Picture is required.'],
  },
  connectionToken: {
    type: String,
    required: [true, 'Connection Token is required.'],
  },
  connectionUserID: {
    type: Types.ObjectId,
    required: [true, 'Connection User ID is required.'],
  },
  connectionAdded: {
    type: Date,
    default: Date.now(),
  },
  connectionUpdated: {
    type: Date,
    default: Date.now(),
  },
};
