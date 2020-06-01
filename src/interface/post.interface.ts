import { Document } from 'mongoose';
import { E_POST_STATUS, E_POST_TYPE } from '@enums';

export interface I_POST_FILE extends Document {
  id: string;
  fileMimeType: string;
  fileName: string;
  fileType: string;
  fileURL: string;
}

export interface I_POST extends Document {
  id: string;
  postCaption: string;
  postConnection: string[];
  postDate: string;
  postMedia?: I_POST_FILE[];
  postScheduleDate: Date;
  postStatus: E_POST_STATUS;
  postTime: string;
  postType: E_POST_TYPE;
  userID: string;
}
