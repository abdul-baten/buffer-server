import { Document } from 'mongoose';
import { E_CONNECTION_STATUS, E_CONNECTION_TYPE } from '@enums';

export interface I_CONNECTION extends Document {
  connectionAdded?: Date;
  connectionCategory?: string;
  connectionID: string;
  connectionName: string;
  connectionPicture: string;
  connectionStatus: E_CONNECTION_STATUS;
  connectionToken: string;
  connectionType: E_CONNECTION_TYPE;
  connectionUserID: string;
  id: string;
}
