import { Schema, SchemaDefinition, Types } from 'mongoose';
/* eslint-disable max-lines */

export const FacebookVideoDefinition: SchemaDefinition = {
  categories: {
    required: true,
    type: [String]
  },
  insight_added: {
    default: Date.now(),
    select: false,
    type: Date
  },
  insight_connection_id: {
    required: [true, 'Connection ID is required!'],
    type: Types.ObjectId
  },
  insight_since: {
    required: [true, 'Since is required!'],
    select: false,
    type: Date
  },
  insight_until: {
    required: [true, 'Until is required!'],
    select: false,
    type: Date
  },
  insight_updated: {
    default: Date.now(),
    select: false,
    type: Date
  },
  insight_user_id: {
    required: [true, 'Connection User ID is required!'],
    type: Schema.Types.ObjectId
  },
  page_video_complete_views_30s: {
    response: {
      required: true,
      type: [Number]
    },
    total: Number
  },
  page_video_complete_views_30s_autoplayed: {
    response: {
      required: true,
      type: [Number]
    },
    total: Number
  },
  page_video_complete_views_30s_click_to_play: {
    response: {
      required: true,
      type: [Number]
    },
    total: Number
  },
  page_video_complete_views_30s_organic: {
    response: {
      required: true,
      type: [Number]
    },
    total: Number
  },
  page_video_complete_views_30s_paid: {
    response: {
      required: true,
      type: [Number]
    },
    total: Number
  },
  page_video_complete_views_30s_repeat_views: {
    response: {
      required: true,
      type: [Number]
    },
    total: Number
  },
  page_video_complete_views_30s_unique: {
    response: {
      required: true,
      type: [Number]
    },
    total: Number
  },
  page_video_repeat_views: {
    response: {
      required: true,
      type: [Number]
    },
    total: Number
  },
  page_video_views: {
    response: {
      required: true,
      type: [Number]
    },
    total: Number
  },
  page_video_views_10s: {
    response: {
      required: true,
      type: [Number]
    },
    total: Number
  },
  page_video_views_10s_autoplayed: {
    response: {
      required: true,
      type: [Number]
    },
    total: Number
  },
  page_video_views_10s_click_to_play: {
    response: {
      required: true,
      type: [Number]
    },
    total: Number
  },
  page_video_views_10s_organic: {
    response: {
      required: true,
      type: [Number]
    },
    total: Number
  },
  page_video_views_10s_paid: {
    response: {
      required: true,
      type: [Number]
    },
    total: Number
  },
  page_video_views_10s_repeat: {
    response: {
      required: true,
      type: [Number]
    },
    total: Number
  },
  page_video_views_10s_unique: {
    response: {
      required: true,
      type: [Number]
    },
    total: Number
  },
  page_video_views_autoplayed: {
    response: {
      required: true,
      type: [Number]
    },
    total: Number
  },
  page_video_views_click_to_play: {
    response: {
      required: true,
      type: [Number]
    },
    total: Number
  },
  page_video_views_organic: {
    response: {
      required: true,
      type: [Number]
    },
    total: Number
  },
  page_video_views_paid: {
    response: {
      required: true,
      type: [Number]
    },
    total: Number
  },
  page_video_views_unique: {
    response: {
      required: true,
      type: [Number]
    },
    total: Number
  }
};
