import type { Document } from 'mongoose';

export interface IMedia extends Document {
  id: string;
  media_mime_type: string;
  media_name: string;
  media_size: string;
  media_type: string;
  media_url: string;
}
