import { Document } from 'mongoose';
import { E_ATTRIBUTION, E_BUSINESS_TYPE, E_COMPANY_SIZE, E_SUBSCRIPTION_PLAN } from '@enums';

export interface I_SUBSCRIPTION_PLAN {
  isTrial: boolean;
  subscriptionPlan: E_SUBSCRIPTION_PLAN;
  subscriptionPlanAdded: Date;
  subscriptionPlanEnds: Date;
  trialEnds: Date;
}

export interface I_USER extends Document {
  id: string;
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
