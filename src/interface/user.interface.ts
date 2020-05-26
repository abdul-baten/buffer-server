import { Document } from 'mongoose';
import {
  E_SUBSCRIPTION_PLAN,
  E_ATTRIBUTION,
  E_BUSINESS_TYPE,
  E_COMPANY_SIZE,
} from '@app/enum';

export interface I_SUBSCRIPTION_PLAN {
  isTrial: boolean;
  subscriptionPlan: E_SUBSCRIPTION_PLAN;
  subscriptionPlanAdded: Date;
  subscriptionPlanEnds: Date;
  trialEnds: Date;
}

export interface I_USER extends Document {
  _id: string;
  attribution: E_ATTRIBUTION;
  businessType: E_BUSINESS_TYPE;
  companyName: string;
  companySize: E_COMPANY_SIZE;
  createdAt: Date;
  email: string;
  fullName: string;
  password: string;
  subscription: I_SUBSCRIPTION_PLAN;
  updatedAt: Date;
  userSuspended: boolean;
}
