import { E_POST_STATUS, E_POST_TYPE } from '@enums';
import { SchemaDefinition, Types } from 'mongoose';

export const PostDefinition: SchemaDefinition = {
  postCaption: {
    required: [true, 'Post Caption is required!'],
    trim: true,
    type: String,
  },
  postConnection: [
    {
      type: Types.ObjectId,
      ref: 'Connection',
    },
  ],
  postScheduleDate: {
    required: [true, 'Post Date is required!'],
    type: Date,
    default: Date.now(),
  },
  //   postMedia: {},
  postStatus: {
    enum: [
      E_POST_STATUS.DELETED,
      E_POST_STATUS.PUBLISHED,
      E_POST_STATUS.SAVED,
      E_POST_STATUS.SCHEDULED,
    ],
    trim: true,
    type: String,
    required: [true, 'Post Status is required!'],
  },
  postScheduleTime: {
    trim: true,
    type: String,
    required: [true, 'Post Time is required!'],
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
