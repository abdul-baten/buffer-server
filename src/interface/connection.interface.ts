import type { Document } from 'mongoose';
import type { EConnectionStatus, EConnectionType } from '@enums';

export interface IConnection extends Document {
  connection_added?: Date;
  connection_category?: string;
  connection_id: string;
  connection_name: string;
  connection_picture: string;
  connection_status: EConnectionStatus;
  connection_token: string;
  connection_type: EConnectionType;
  connection_user_id: string;
  id: string;
}

export interface IRedirectResponse {
  redirect_uri: string;
}
