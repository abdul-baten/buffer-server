import { EConnectionStatus, EConnectionType } from '@enums';
import { SchemaDefinition, Types } from 'mongoose';

export const ConnectionDefinition: SchemaDefinition = {
  connection_added: {
    default: Date.now(),
    type: Date
  },
  connection_category: {
    required: false,
    type: String
  },
  connection_id: {
    required: [true, 'Connection ID is required!'],
    type: String
  },
  connection_name: {
    required: [true, 'Connection Name is required!'],
    type: String
  },
  connection_picture: {
    required: [false, 'Connection Picture is required!'],
    type: String
  },
  connection_status: {
    enum: [EConnectionStatus.DISABLED, EConnectionStatus.ENABLED],
    required: [true, 'Connection Status is required!'],
    type: String
  },
  connection_token: {
    required: [true, 'Connection Token is required!'],
    type: String
  },
  connection_type: {
    enum: [
      EConnectionType.FACEBOOK_PAGE,
      EConnectionType.FACEBOOK_GROUP,
      EConnectionType.INSTAGRAM_BUSINESS,
      EConnectionType.INSTAGRAM_PERSONAL,
      EConnectionType.LINKEDIN_PAGE,
      EConnectionType.LINKEDIN_PROFILE,
      EConnectionType.PINTEREST,
      EConnectionType.TWITTER
    ],
    required: [true, 'Connection Type is required!'],
    trim: true,
    type: String
  },
  connection_updated: {
    default: Date.now(),
    type: Date
  },
  connection_user_id: {
    required: [true, 'Connection User ID is required!'],
    type: Types.ObjectId
  }
};
