export interface IFbPage {
  access_token: string;
  category: string;
  id: string;
  name: string;
  picture: string;
}

export interface IFbCommonResponse<T> {
  data: [T]
}

export interface IFbGroup {
  access_token: string;
  id: string;
  name: string;
  picture: string;
  privacy: string;
}

