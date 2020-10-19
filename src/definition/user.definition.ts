import { ESubscriptionPlan } from '@enums';
import { RegexPatterns } from '@utils';
import type { SchemaDefinition } from 'mongoose';

export const UserDefinition: SchemaDefinition = {
  user_created: {
    default: Date.now(),
    type: Date
  },
  user_email: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    createIndexes: { unique: true },
    lowercase: true,
    match: [RegexPatterns.EMAIL, 'Work email address is not valid.'],
    required: [true, 'Work email is required!'],
    trim: true,
    type: String,
    unique: true
  },
  user_full_name: {
    match: [RegexPatterns.ALPHA_NUMERIC_WITH_SPACE, 'Full name is not valid.'],
    maxlength: 50,
    minlength: 3,
    required: [true, 'Full name is required!'],
    trim: true,
    type: String
  },
  user_is_suspended: {
    default: false,
    type: Boolean
  },
  user_password: {
    required: [true, 'Password is required!'],
    type: String
  },
  user_subscription_plan: {
    is_trial: {
      default: true,
      type: Boolean
    },
    subscription_added: {
      type: Date
    },
    subscription_expires: {
      type: Date
    },
    subscription_plan: {
      enum: [ESubscriptionPlan.PROFESSIONAL, ESubscriptionPlan.ADVANCED, ESubscriptionPlan.AGENCY],
      trim: true,
      type: String
    },
    trial_ends: {
      type: Date
    }
  },
  user_updated: {
    default: Date.now(),
    type: Date
  }
};
