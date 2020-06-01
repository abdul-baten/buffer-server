import {
  E_ATTRIBUTION,
  E_BUSINESS_TYPE,
  E_COMPANY_SIZE,
  E_SUBSCRIPTION_PLAN,
} from '@enums';
import { REG_EX_PATTERNS } from '@utils';
import { SchemaDefinition } from 'mongoose';

export const UserDefinition: SchemaDefinition = {
  attribution: {
    enum: [
      E_ATTRIBUTION.ACQUIANTANCE,
      E_ATTRIBUTION.ADVERTISEMENT,
      E_ATTRIBUTION.BLOG,
      E_ATTRIBUTION.OTHER,
      E_ATTRIBUTION.SEARCH,
      E_ATTRIBUTION.SOCIAL_MEDIA,
    ],
    trim: true,
    type: String,
  },
  businessType: {
    enum: [
      E_BUSINESS_TYPE.AGENCY,
      E_BUSINESS_TYPE.B2B,
      E_BUSINESS_TYPE.ONLINE_STORE,
      E_BUSINESS_TYPE.PERSONAL,
      E_BUSINESS_TYPE.PHYSICAL_STORE,
      E_BUSINESS_TYPE.PUBLISHER,
      E_BUSINESS_TYPE.SAAS,
    ],
    trim: true,
    type: String,
  },
  companyName: {
    trim: true,
    type: String,
  },
  companySize: {
    enum: [
      E_COMPANY_SIZE.FIFTY_ONE_TO_FIVE_HUNDRED,
      E_COMPANY_SIZE.FIVE_TO_FIFTY,
      E_COMPANY_SIZE.LESS_THAN_FIVE,
      E_COMPANY_SIZE.MORE_THAN_FIVE_HUNDRED,
    ],
    trim: true,
    type: String,
  },
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
    match: [
      REG_EX_PATTERNS.ALPHA_NUMERIC_WITH_SPACE,
      'Full name is not valid.',
    ],
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
      enum: [
        E_SUBSCRIPTION_PLAN.PROFESSIONAL,
        E_SUBSCRIPTION_PLAN.ADVANCED,
        E_SUBSCRIPTION_PLAN.AGENCY,
      ],
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
