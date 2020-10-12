import type { Document } from 'mongoose';
import type { EPostStatus, EPostType } from '@enums';
import type { IConnection, IMedia } from '@interfaces';

export interface IPost extends Document {
  id: string;
  post_connection: Partial<IConnection>;
  post_date: string;
  post_date_time: Date;
  post_media?: IMedia['id'][];
  post_message: string;
  post_status: EPostStatus;
  post_type: EPostType;
  post_user_id: string;
}
