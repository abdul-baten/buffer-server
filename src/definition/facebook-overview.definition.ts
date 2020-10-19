/* eslint-disable max-lines */
import { Schema, SchemaDefinition, Types } from 'mongoose';

export const FacebookOverviewDefinition: SchemaDefinition = {
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
  page_actions_post_reactions_anger_total: {
    response: {
      required: true,
      type: [Number]
    },
    total: Number
  },
  page_actions_post_reactions_haha_total: {
    response: {
      required: true,
      type: [Number]
    },
    total: Number
  },
  page_actions_post_reactions_like_total: {
    response: {
      required: true,
      type: [Number]
    },
    total: Number
  },
  page_actions_post_reactions_love_total: {
    response: {
      required: true,
      type: [Number]
    },
    total: Number
  },
  page_actions_post_reactions_sorry_total: {
    response: {
      required: true,
      type: [Number]
    },
    total: Number
  },
  page_actions_post_reactions_total: {
    categories: {
      required: true,
      type: [String]
    },
    response: {
      required: true,
      type: Schema.Types.Mixed
    }
  },
  page_actions_post_reactions_wow_total: {
    response: {
      required: true,
      type: [Number]
    },
    total: Number
  },
  page_engaged_users: {
    response: {
      required: true,
      type: [Number]
    },
    total: Number
  },
  page_fan_adds: {
    response: {
      required: true,
      type: [Number]
    },
    total: Number
  },
  page_fan_removes: {
    response: {
      required: true,
      type: [Number]
    },
    total: Number
  },
  page_impressions: {
    response: {
      required: true,
      type: [Number]
    },
    total: Number
  },
  page_impressions_unique: {
    response: {
      required: true,
      type: [Number]
    },
    total: Number
  },
  page_views_total: {
    response: {
      required: true,
      type: [Number]
    },
    total: Number
  }
};
