import { SchemaDefinition, Types } from 'mongoose';

export const MediaDefinition: SchemaDefinition = {
  media_mime_type: {
    required: [true, 'Media Mime Type is required!'],
    trim: true,
    type: String
  },
  media_name: {
    required: [true, 'Media Name Type is required!'],
    trim: true,
    type: String
  },
  media_size: {
    required: [true, 'Media Size is required!'],
    trim: true,
    type: String
  },
  media_type: {
    required: [true, 'Media Type is required!'],
    trim: true,
    type: String
  },
  media_uri: {
    required: [true, 'Media URL is required!'],
    trim: true,
    type: String
  },
  media_user_id: {
    ref: 'User',
    required: [true, 'Media User ID is required!'],
    type: Types.ObjectId
  }
};
