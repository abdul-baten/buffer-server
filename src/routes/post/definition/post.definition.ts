import { E_POST_STATUS, E_POST_TYPE } from '@app/enum';
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
  postDate: {
    required: [true, 'Post Date is required!'],
    type: Date,
    default: Date.now(),
  },
  postLink: {
    trim: true,
    type: String,
  },
  //   postMedia: {},
  //   postScheduleDate: {},
  postStatus: {
    enum: [
      E_POST_STATUS.DELETED,
      E_POST_STATUS.PUBLISHED,
      E_POST_STATUS.SAVED,
      E_POST_STATUS.SCHEDULED,
    ],
    trim: true,
    type: String,
    required: [true, 'Post Status is required.'],
  },
  postTime: {
    trim: true,
    type: String,
  },
  postType: {
    enum: [E_POST_TYPE.IMAGE, E_POST_TYPE.TEXT, E_POST_TYPE.VIDEO],
    trim: true,
    type: String,
    required: [true, 'Post Type is required.'],
  },
  userID: {
    type: Types.ObjectId,
    required: [true, 'Post User ID is required.'],
  },
};
