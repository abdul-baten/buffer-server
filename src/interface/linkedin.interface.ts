import type { EPostType } from '@enums';

export interface ILnTokenResponse {
  access_token: string;
  expires_in: number;
}

export interface ILnSuccess {
  id?: string;
}

export interface ILnMediaRegisterPayload {
  connection_id: string;
  connection_token: string;
  post_media: string[];
  post_type: EPostType;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface ILnHeaders { Authorization: string, 'X-Restli-Protocol-Version': string }
