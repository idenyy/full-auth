import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { v4 as uuid } from "uuid";
import { TokenType, User } from "@prisma/__generated__";
import { Request } from "express";
import { ConfirmationDto } from "@/auth/email-confirm/dto/confirmation.dto";
import { MailService } from "@/libs/mail/mail.service";
import { UserService } from "@/user/user.service";
import { AuthService } from "@/auth/auth.service";

@Injectable()
export class EmailConfirmService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService,
    private readonly userService: UserService,

    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  public async verification(req: Request, dto: ConfirmationDto) {
    const existingToken = await this.prismaService.token.findUnique({
      where: { token: dto.token, type: TokenType.VERIFICATION },
    });
    if (!existingToken)
      throw new NotFoundException(`Token ${dto.token} not found`);

    const hasExpired = new Date(existingToken.expiresIn) < new Date();
    if (hasExpired)
      throw new BadRequestException(
        "Your token has expired. Please request a new one to continue",
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
        isVerified: true,
      },
    });

    await this.prismaService.token.delete({
      where: {
        id: existingToken.id,
        type: TokenType.VERIFICATION,
      },
    });

    return this.authService.saveSession(req, existingUser);
  }

  public async sendVerificationToken(user: User) {
    const verificationToken = await this.generateVerificationToken(user.email);

    await this.mailService.sendConfirmationEmail(
      verificationToken.email,
      verificationToken.token,
    );

    return true;
  }

  private async generateVerificationToken(email: string) {
    const token = uuid();
    const expiresIn = new Date(new Date().getTime() + 1800 * 1000);

    const existingToken = await this.prismaService.token.findFirst({
      where: { email, type: TokenType.VERIFICATION },
    });

    if (existingToken) {
      await this.prismaService.token.delete({
        where: { id: existingToken.id, type: TokenType.VERIFICATION },
      });
    }

    const verificationToken = await this.prismaService.token.create({
      data: {
        email,
        token,
        expiresIn,
        type: TokenType.VERIFICATION,
      },
    });

    return verificationToken;
  }
}
