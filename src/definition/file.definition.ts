import { SchemaDefinition, Types } from 'mongoose';

export const FileDefinition: SchemaDefinition = {
  fileMimeType: {
    required: [true, 'File Mime Type is required!'],
    trim: true,
    type: String,
  },
  fileName: {
    required: [true, 'File Name Type is required!'],
    trim: true,
    type: String,
  },
  fileType: {
    required: [true, 'File Type is required!'],
    trim: true,
    type: String,
  },
  fileURL: {
    required: [true, 'File URL is required!'],
    trim: true,
    type: String,
  },
  userID: {
    type: Types.ObjectId,
    required: [true, 'File User ID is required!'],
  },
};
