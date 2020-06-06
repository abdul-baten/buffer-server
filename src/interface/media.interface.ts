import { Document } from 'mongoose';

export interface I_MEDIA extends Document {
  id: string;
  mediaMimeType: string;
  mediaName: string;
  mediaSize: string;
  mediaType: string;
  mediaURL: string;
}
