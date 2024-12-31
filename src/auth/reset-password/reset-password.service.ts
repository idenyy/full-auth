import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { UserService } from "@/user/user.service";
import { MailService } from "@/libs/mail/mail.service";
import { v4 as uuid } from "uuid";
import { TokenType } from "@prisma/__generated__";
import { ResetPasswordDto } from "@/auth/reset-password/dto/reset-password.dto";
import { NewPasswordDto } from "@/auth/reset-password/dto/new-password.dto";
import { hash } from "argon2";

@Injectable()
export class ResetPasswordService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
    private readonly mailService: MailService,
  ) {}

  public async resetPassword(dto: ResetPasswordDto) {
    const existingUser = await this.userService.findByEmail(dto.email);

    if (!existingUser)
      throw new NotFoundException(
        `User with email ${dto.email} does not exist. Please check the email and try again`,
      );

    const resetPasswordToken = await this.generateResetPasswordToken(
      existingUser.email,
    );

    await this.mailService.sendResetPassword(
      resetPasswordToken.email,
      resetPasswordToken.token,
    );

    return true;
  }

  public async newPassword(dto: NewPasswordDto, token: string) {
    const existingToken = await this.prismaService.token.findFirst({
      where: {
        token,
        type: TokenType.PASSWORD_RESET,
      },
    });
    if (!existingToken)
      throw new NotFoundException(
        "Invalid or expired token provided. Please request a new password reset",
      );

    const hasExpired = new Date(existingToken.expiresIn) < new Date();
    if (hasExpired)
      throw new BadRequestException(
        "Your token has expired. Please request a new one",
      );

    const existingUser = await this.userService.findByEmail(
      existingToken.email,
    );
    if (!existingUser) {
      throw new NotFoundException(
        `User with email ${existingUser.email} not found`,
      );
    }

    await this.prismaService.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        password: await hash(dto.password),
      },
    });

    await this.prismaService.token.delete({
      where: {
        id: existingToken.id,
        type: TokenType.PASSWORD_RESET,
      },
    });

    return true;
  }

  private async generateResetPasswordToken(email: string) {
    const token = uuid();
    const expiresIn = new Date(new Date().getTime() + 1800 * 1000);

    const existingToken = await this.prismaService.token.findFirst({
      where: { email, type: TokenType.PASSWORD_RESET },
    });

    if (existingToken) {
      await this.prismaService.token.delete({
        where: { id: existingToken.id, type: TokenType.PASSWORD_RESET },
      });
    }

    const resetPasswordToken = await this.prismaService.token.create({
      data: {
        email,
        token,
        expiresIn,
        type: TokenType.PASSWORD_RESET,
      },
    });

    return resetPasswordToken;
  }
}
