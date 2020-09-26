import { E_POST_STATUS, E_POST_TYPE, E_CONNECTION_TYPE } from '@enums';
import { SchemaDefinition, Types } from 'mongoose';

export const PostDefinition: SchemaDefinition = {
  postCaption: {
    required: [true, 'Post Caption is required!'],
    trim: true,
    type: String,
  },
  postConnection: {
    id: {
      type: Types.ObjectId,
      required: [true, 'Post Connection ID is required!'],
    },
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
      required: [true, 'Post Connection Type is required!'],
    },
  },
  postScheduleDateTime: {
    required: [true, 'Post Date is required!'],
    type: String,
  },
  postMedia: [
    {
      type: String,
      trim: true,
      required: true,
    },
  ],
  postStatus: {
    enum: [E_POST_STATUS.DELETED, E_POST_STATUS.PUBLISHED, E_POST_STATUS.SAVED, E_POST_STATUS.SCHEDULED],
    trim: true,
    type: String,
    required: [true, 'Post Status is required!'],
  },
  postType: {
    enum: [E_POST_TYPE.IMAGE, E_POST_TYPE.TEXT, E_POST_TYPE.VIDEO],
    trim: true,
    type: String,
    required: [true, 'Post Type is required!'],
  },
  userID: {
    type: Types.ObjectId,
    required: [true, 'Post User ID is required!'],
  },
};
