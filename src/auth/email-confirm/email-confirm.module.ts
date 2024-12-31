import { forwardRef, Module } from "@nestjs/common";
import { EmailConfirmService } from "./email-confirm.service";
import { EmailConfirmController } from "./email-confirm.controller";
import { MailModule } from "@/libs/mail/mail.module";
import { AuthModule } from "@/auth/auth.module";
import { UserService } from "@/user/user.service";
import { MailService } from "@/libs/mail/mail.service";

@Module({
  imports: [MailModule, forwardRef(() => AuthModule)],
  controllers: [EmailConfirmController],
  providers: [EmailConfirmService, UserService, MailService],
  exports: [EmailConfirmService],
})
export class EmailConfirmModule {}
