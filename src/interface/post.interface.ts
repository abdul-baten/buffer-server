import { Document } from 'mongoose';
import { E_POST_STATUS, E_POST_TYPE } from '@enums';
import { I_CONNECTION, I_MEDIA } from '@interfaces';

export interface I_POST extends Document {
  id: string;
  postCaption: string;
  postConnection: I_CONNECTION['id'];
  postDate: string;
  postMedia?: I_MEDIA['id'][];
  postScheduleDate: Date;
  postStatus: E_POST_STATUS;
  postTime: string;
  postType: E_POST_TYPE;
  userID: string;
}
