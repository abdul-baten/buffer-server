/* eslint-disable max-lines */
import { Schema, SchemaDefinition, Types } from 'mongoose';

export const FacebookPerformancetDefinition: SchemaDefinition = {
  categories: {
    required: true,
    type: [String]
  },
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
  page_call_phone_clicks_logged_in_unique: {
    response: {
      required: true,
      type: Schema.Types.Mixed
    },
    total: Schema.Types.Mixed
  },
  page_get_directions_clicks_logged_in_unique: {
    response: {
      required: true,
      type: Schema.Types.Mixed
    },
    total: Schema.Types.Mixed
  },
  page_tab_views_login_top: {
    response: {
      required: true,
      type: Schema.Types.Mixed
    },
    total: Schema.Types.Mixed
  },
  page_total_actions: {
    response: {
      required: true,
      type: Schema.Types.Mixed
    },
    total: Schema.Types.Mixed
  },
  page_views_logged_in_total: {
    response: {
      required: true,
      type: Schema.Types.Mixed
    },
    total: Schema.Types.Mixed
  },
  page_views_logout: {
    response: {
      required: false,
      type: Schema.Types.Mixed
    },
    total: Schema.Types.Mixed
  },
  page_website_clicks_logged_in_unique: {
    response: {
      required: true,
      type: Schema.Types.Mixed
    },
    total: Schema.Types.Mixed
  }
};
