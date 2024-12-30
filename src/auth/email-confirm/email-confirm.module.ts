import { forwardRef, Module } from "@nestjs/common";
import { EmailConfirmService } from "./email-confirm.service";
import { EmailConfirmController } from "./email-confirm.controller";
import { MailModule } from "@/libs/mail/mail.module";
import { AuthModule } from "@/auth/auth.module";

@Module({
  imports: [MailModule, forwardRef(() => AuthModule)],
  controllers: [EmailConfirmController],
  providers: [EmailConfirmService],
  exports: [EmailConfirmService],
})
export class EmailConfirmModule {}
