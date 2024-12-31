import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { ConfigService } from "@nestjs/config";
import { render } from "@react-email/components";
import { ConfirmationTemplate } from "@/libs/mail/templates/confirmation.template";

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  public async sendConfirmationEmail(email: string, token: string) {
    const domain = this.configService.getOrThrow<string>("ALLOWED_ORIGIN");
    const html = await render(ConfirmationTemplate({ domain, token }));

    return this.sendMail(email, "Mail Confirmation", html);
  }

  private sendMail(email: string, subject: string, html: string) {
    return this.mailerService.sendMail({
      from: {
        name: "Vetra",
        address: this.configService.getOrThrow<string>("MAIL_LOGIN"),
      },
      to: email,
      subject,
      html,
    });
  }
}
