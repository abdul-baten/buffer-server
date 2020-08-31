import { E_SUBSCRIPTION_PLAN } from '@enums';
import { REG_EX_PATTERNS } from '@utils';
import { SchemaDefinition } from 'mongoose';

export const UserDefinition: SchemaDefinition = {
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  email: {
    createIndexes: { unique: true },
    lowercase: true,
    required: [true, 'Work email is required!'],
    trim: true,
    type: String,
    unique: true,
    match: [REG_EX_PATTERNS.EMAIL, 'Work email address is not valid.'],
  },
  fullName: {
    maxlength: 50,
    minlength: 3,
    required: [true, 'Full name is required!'],
    trim: true,
    type: String,
    match: [REG_EX_PATTERNS.ALPHA_NUMERIC_WITH_SPACE, 'Full name is not valid.'],
  },
  password: {
    type: String,
    required: [true, 'Password is required!'],
  },
  subscription: {
    isTrial: {
      type: Boolean,
      default: true,
    },
    subscriptionPlan: {
      enum: [E_SUBSCRIPTION_PLAN.PROFESSIONAL, E_SUBSCRIPTION_PLAN.ADVANCED, E_SUBSCRIPTION_PLAN.AGENCY],
      type: String,
      trim: true,
    },
    subscriptionPlanAdded: {
      type: Date,
    },
    subscriptionPlanEnds: {
      type: Date,
    },
    trialEnds: {
      type: Date,
    },
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
  userSuspended: {
    type: Boolean,
    default: false,
  },
};
