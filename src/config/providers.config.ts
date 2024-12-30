import { ConfigService } from "@nestjs/config";
import { TypeOptions } from "@/provider/provider.constans";
import { GoogleProvider } from "@/provider/services/google.provider";

export const getProvidersConfig = async (
  configService: ConfigService,
): Promise<TypeOptions> => ({
  baseUrl: configService.getOrThrow<string>("APPLICATION_URL"),
  services: [
    new GoogleProvider({
      client_id: configService.getOrThrow<string>("GOOGLE_CLIENT_ID"),
      client_secret: configService.getOrThrow<string>(
        "GOOGLE_CLIENT_SECRET_KEY",
      ),
      scopes: ["email", "profile"],
    }),
  ],
});
