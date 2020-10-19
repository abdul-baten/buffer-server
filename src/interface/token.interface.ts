export interface IJwtToken {
  aud: string;
  exp: number;
  iat: number;
  iss: string;
  sub: string;
  user_email: string;
  user_id: string;
}
