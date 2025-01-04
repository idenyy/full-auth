import { Module } from "@nestjs/common";
import { TwoFactorService } from "./two-factor.service";
import { MailService } from "@/libs/mail/mail.service";

@Module({
  providers: [TwoFactorService, MailService],
})
export class TwoFactorModule {}
