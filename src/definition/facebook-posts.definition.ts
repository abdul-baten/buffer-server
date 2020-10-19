/* eslint-disable max-lines */
import { SchemaDefinition, Types } from 'mongoose';

export const FacebookPostsDefinition: SchemaDefinition = {
  categories: {
    required: true,
    type: [String]
  },
  engaged_fans: {
    required: true,
    type: [Number]
  },
  engaged_users: {
    required: true,
    type: [Number]
  },
  hash_tags: Number,
  insight_added: {
    default: Date.now(),
    type: Date
  },
  insight_connection_id: {
    required: [true, 'Connection ID is required!'],
    type: Types.ObjectId
  },
  insight_since: {
    required: [true, 'Since is required!'],
    type: Date
  },
  insight_until: {
    required: [true, 'Until is required!'],
    type: Date
  },
  insight_updated: {
    default: Date.now(),
    type: Date
  },
  insight_user_id: {
    required: [true, 'Connection User ID is required!'],
    type: Types.ObjectId
  },
  post_clicks: {
    required: true,
    type: [Number]
  },
  post_impressions: {
    required: true,
    type: [Number]
  },
  post_reach: {
    required: true,
    type: [Number]
  },
  posts: {
    categories: {
      required: true,
      type: [String]
    },
    response: {
      required: true,
      type: [Number]
    },
    total: Number
  },
  posts_table: [
    {
      attachment: [String],
      created_time: Date,
      hash_tags: [[String]],
      id: String,
      insights: [
        {
          engaged_fans: Number,
          engaged_users: Number,
          negative_feedbacks: Number,
          post_clicks: Number,
          post_impressions: Number,
          post_impressions_organic: Number,
          post_impressions_paid: Number,
          post_reach: Number
        }
      ],
      status: String,
      total_comments: Number,
      total_likes: Number,
      total_reactions: Number,
      total_shares: Number,
      url: String
    }
  ],
  total_comments: {
    required: true,
    type: [Number]
  },
  total_likes: {
    required: true,
    type: [Number]
  },
  total_reactions: {
    required: true,
    type: [Number]
  },
  total_shares: {
    required: true,
    type: [Number]
  }
};
