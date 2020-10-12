import { EPostStatus, EPostType, EConnectionType } from '@enums';
import { SchemaDefinition, Types } from 'mongoose';

export const PostDefinition: SchemaDefinition = {
  id: {
    required: [true, 'Post Connection ID is required!'],
    type: Types.ObjectId
  },
  post_connection: {
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
      required: [true, 'Post Connection Type is required!'],
      trim: true,
      type: String
    }
  },
  post_date_time: {
    required: [true, 'Post Date is required!'],
    type: String
  },
  post_media: [
    {
      required: true,
      trim: true,
      type: String
    }
  ],
  post_message: {
    required: [true, 'Post Caption is required!'],
    trim: true,
    type: String
  },
  post_status: {
    enum: [EPostStatus.DELETED, EPostStatus.PUBLISHED, EPostStatus.SAVED, EPostStatus.SCHEDULED],
    required: [true, 'Post Status is required!'],
    trim: true,
    type: String
  },
  post_type: {
    enum: [EPostType.IMAGE, EPostType.TEXT, EPostType.VIDEO],
    required: [true, 'Post Type is required!'],
    trim: true,
    type: String
  },
  post_user_id: {
    required: [true, 'Post User ID is required!'],
    type: Types.ObjectId
  }
};
