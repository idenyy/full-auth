import { forwardRef, Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserService } from "@/user/user.service";
import { GoogleRecaptchaModule } from "@nestlab/google-recaptcha";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { getRecaptchaConfig } from "@/config/recaptcha.config";
import { ProviderModule } from "@/provider/provider.module";
import { getProvidersConfig } from "@/config/providers.config";
import { EmailConfirmModule } from "@/auth/email-confirm/email-confirm.module";
import { MailService } from "@/libs/mail/mail.service";
import { TwoFactorService } from "@/auth/two-factor/two-factor.service";

@Module({
  imports: [
    ProviderModule.signupAsync({
      imports: [ConfigModule],
      useFactory: getProvidersConfig,
      inject: [ConfigService],
    }),
    GoogleRecaptchaModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getRecaptchaConfig,
      inject: [ConfigService],
    }),
    forwardRef(() => EmailConfirmModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, MailService, TwoFactorService],
  exports: [AuthService],
})
export class AuthModule {}
