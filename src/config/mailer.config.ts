import { ConfigService } from "@nestjs/config";
import { isDev } from "@/libs/common/utils/is-dev.util";
import { MailerOptions } from "@nestjs-modules/mailer";

export const getMailerConfig = async (
  configService: ConfigService,
): Promise<MailerOptions> => ({
  transport: {
    host: configService.getOrThrow<string>("MAIL_HOST"),
    port: configService.getOrThrow<string>("MAIL_PORT"),
    secure: !isDev(configService),
    auth: {
      user: configService.getOrThrow<string>("MAIL_LOGIN"),
      password: configService.getOrThrow<string>("MAIL_PASSWORD"),
    },
  },
  defaults: {
    from: `"Vetra" ${configService.getOrThrow<string>("MAIL_LOGIN")}`,
  },
});
