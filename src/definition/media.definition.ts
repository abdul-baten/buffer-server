import { SchemaDefinition, Types } from 'mongoose';

export const MediaDefinition: SchemaDefinition = {
  mediaMimeType: {
    required: [true, 'Media Mime Type is required!'],
    trim: true,
    type: String,
  },
  mediaName: {
    required: [true, 'Media Name Type is required!'],
    trim: true,
    type: String,
  },
  mediaType: {
    required: [true, 'Media Type is required!'],
    trim: true,
    type: String,
  },
  mediaSize: {
    required: [true, 'Media Size is required!'],
    trim: true,
    type: String,
  },
  mediaURL: {
    required: [true, 'Media URL is required!'],
    trim: true,
    type: String,
  },
  userID: {
    type: Types.ObjectId,
    ref: 'User',
    required: [true, 'Media User ID is required!'],
  },
};
