import { Document } from 'mongoose';
import { E_POST_STATUS, E_POST_TYPE } from '@app/enum';
import { I_CONNECTION } from './connection.interface';

export interface I_POST_FILE extends Document {
  _id: string;
  fileMimeType: string;
  fileName: string;
  fileType: string;
  fileURL: string;
}

export interface I_POST extends Document {
  _id: string;
  postCaption: string;
  postConnection: I_CONNECTION[];
  postDate: string;
  postMedia?: I_POST_FILE[];
  postScheduleDate: Date;
  postStatus: E_POST_STATUS;
  postTime: string;
  postType: E_POST_TYPE;
  userID: string;
}
