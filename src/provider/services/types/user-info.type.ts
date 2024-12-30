export type TypeUserInfo = {
  id: string;
  name: string;
  email: string;
  picture: string;
  access_token?: string | null;
  refresh_token?: string;
  expires_at?: number;
  provider: string;
};
