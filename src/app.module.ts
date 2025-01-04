import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { IS_DEV_ENV } from "@/libs/common/utils/is-dev.util";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { ProviderModule } from "./provider/provider.module";

import { EmailConfirmModule } from "@/auth/email-confirm/email-confirm.module";
import { MailModule } from "@/libs/mail/mail.module";
import { ResetPasswordModule } from "@/auth/reset-password/reset-password.module";
import { TwoFactorModule } from "@/auth/two-factor/two-factor.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: !IS_DEV_ENV,
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    ProviderModule,
    MailModule,
    EmailConfirmModule,
    ResetPasswordModule,
    TwoFactorModule,
  ],
})
export class AppModule {}
