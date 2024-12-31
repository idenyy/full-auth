import { Module } from "@nestjs/common";
import { ResetPasswordService } from "./reset-password.service";
import { ResetPasswordController } from "./reset-password.controller";
import { UserService } from "@/user/user.service";
import { MailService } from "@/libs/mail/mail.service";

@Module({
  controllers: [ResetPasswordController],
  providers: [ResetPasswordService, UserService, MailService],
})
export class ResetPasswordModule {}
