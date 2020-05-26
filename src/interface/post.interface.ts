export enum EPostType {
  IMAGE = 'image',
  TEXT = 'text',
  VIDEO = 'video',
}

export enum EPostStatus {
  DELETED = 'deleted',
  PUBLISHED = 'published',
  SAVED = 'saved',
  SCHEDULED = 'scheduled',
}

export interface IPostMedia {
  fileMimeType: string;
  fileName: string;
  fileThumbnailURL: string;
  fileType: string;
  fileURL: string;
}

export interface IPostConnection {
  socialAvatar: string;
  socialId: string;
  socialName: string;
  socialType: string;
  socialURL: string;
}

export interface IPost {
  _id: string;
  postCaption: string;
  postConnection: IPostConnection[];
  postDate: string;
  postMedia?: IPostMedia[];
  postLink?: string;
  postLocation?: string;
  postScheduleDate: Date;
  postStatus: EPostStatus;
  postTime: string;
  postType: EPostType;
  postURL: string;
  userId: string;
}
