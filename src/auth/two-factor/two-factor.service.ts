import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { MailService } from "@/libs/mail/mail.service";
import { TokenType } from "@prisma/__generated__";

@Injectable()
export class TwoFactorService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService,
  ) {}

  public async validate(email: string, code: string) {
    const existingToken = await this.prismaService.token.findFirst({
      where: { email, type: TokenType.TWO_FACTOR },
    });
    if (!existingToken) throw new NotFoundException("2FA Token not found");
    if (existingToken.token !== code)
      throw new BadRequestException(
        `Invalid 2FA code. Please check the code and try again`,
      );

    const hasExpired = new Date(existingToken.expiresIn) < new Date();
    if (hasExpired)
      throw new BadRequestException(
        "Your 2FA token has expired. Please request a new one to continue",
      );

    await this.prismaService.token.delete({
      where: {
        id: existingToken.id,
        type: TokenType.TWO_FACTOR,
      },
    });

    return true;
  }

  public async sendTwoFactorToken(email: string) {
    const twoFactorToken = await this.generateTwoFactorToken(email);

    await this.mailService.sendTwoFactorToken(
      twoFactorToken.email,
      twoFactorToken.token,
    );

    return true;
  }

  private async generateTwoFactorToken(email: string) {
    const token = Math.floor(
      Math.random() * (1000000 - 100000) + 100000,
    ).toString();
    const expiresIn = new Date(new Date().getTime() + 300000);

    const existingToken = await this.prismaService.token.findFirst({
      where: { email, type: TokenType.TWO_FACTOR },
    });
    if (existingToken) {
      await this.prismaService.token.delete({
        where: { id: existingToken.id, type: TokenType.TWO_FACTOR },
      });
    }

    const twoFactorToken = await this.prismaService.token.create({
      data: {
        email,
        token,
        expiresIn,
        type: TokenType.TWO_FACTOR,
      },
    });

    return twoFactorToken;
  }
}
