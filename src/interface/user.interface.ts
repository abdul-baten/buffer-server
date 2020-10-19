import type { Document } from 'mongoose';
import type { ESubscriptionPlan } from '@enums';

export interface ISubscriptionPlan {
  is_trial: boolean;
  subscription_added: Date;
  subscription_expires: Date;
  subscription_plan: ESubscriptionPlan;
  trial_ends: Date;
}

export interface IUser extends Document {
  id: string;
  user_created: Date;
  user_email: string;
  user_full_name: string;
  user_is_suspended: boolean;
  user_password: string;
  user_subscription_plan: ISubscriptionPlan;
  user_updated: Date;
}
