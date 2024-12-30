import { BaseOAuthService } from "@/provider/services/base-oauth.service";
import { TypeProviderOptions } from "@/provider/services/types/provider-options.type";
import { TypeUserInfo } from "@/provider/services/types/user-info.type";

interface GoogleProfile extends Record<string, any> {
  aud: string;
  azp: string;
  email: string;
  email_verified: string;
  exp: string;
  family_name?: string;
  given_name: string;
  hd?: string;
  iat: string;
  iss: string;
  jti?: string;
  locale?: string;
  name: string;
  nbf?: string;
  picture: string;
  sub: string;
  access_token?: string;
  refresh_token?: string;
}

export class GoogleProvider extends BaseOAuthService {
  constructor(options: TypeProviderOptions) {
    super({
      name: "google",
      authorize_url: "https://accounts.google.com/o/oauth2/v2/auth",
      access_url: "https://oauth2.googleapis.com/token",
      profile_url: "https://www.googleapis.com/oauth2/v3/userinfo",
      scopes: options.scopes || ["openid", "profile", "email"],
      client_id: options.client_id,
      client_secret: options.client_secret,
    });
  }

  public async extractUserInfo(data: GoogleProfile): Promise<TypeUserInfo> {
    return super.extractUserInfo({
      name: data.name,
      email: data.email,
      picture: data.picture,
    });
  }
}
