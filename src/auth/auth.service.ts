import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { SignupDto } from "@/auth/dto/signup.dto";
import { UserService } from "@/user/user.service";
import { AuthMethod, User } from "@prisma/__generated__";
import { Request, Response } from "express";
import { ConfigService } from "@nestjs/config";
import { LoginDto } from "@/auth/dto/login.dto";
import { verify } from "argon2";
import { ProviderService } from "@/provider/provider.service";
import { PrismaService } from "@/prisma/prisma.service";
import { EmailConfirmService } from "@/auth/email-confirm/email-confirm.service";

@Injectable()
export class AuthService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly providerService: ProviderService,
    private readonly emailConfirmService: EmailConfirmService,
  ) {}

  public async signup(req: Request, dto: SignupDto) {
    const isExists = await this.userService.findByEmail(dto.email);
    if (isExists)
      throw new ConflictException("The email you provided is already in use");

    const user = await this.userService.create(
      dto.name,
      dto.email,
      dto.password,
      "",
      AuthMethod.CREDENTIALS,
      false,
    );

    await this.emailConfirmService.sendVerificationToken(user);

    return {
      message:
        "Registration successful! Check your email to confirm your account",
    };
  }

  public async login(req: Request, dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email);
    if (!user || !user.password) throw new NotFoundException("User not found");

    const isValid = await verify(user.password, dto.password);
    if (!isValid) throw new UnauthorizedException("Invalid password");

    return this.saveSession(req, user);
  }

  public async extractProfileFromCode(
    req: Request,
    provider: string,
    code: string,
  ) {
    const providerInstance = this.providerService.findByService(provider);
    const profile = await providerInstance.findUserByCode(code);

    const account = await this.prismaService.account.findFirst({
      where: {
        id: profile.id,
        provider: profile.provider,
      },
    });

    let user = account?.userId
      ? await this.userService.findById(account.userId)
      : null;

    if (user) return this.saveSession(req, user);

    user = await this.userService.create(
      profile.name,
      profile.email,
      "",
      profile.picture,
      AuthMethod[profile.provider.toUpperCase()],
      true,
    );

    if (!account)
      await this.prismaService.account.create({
        data: {
          userId: user.id,
          type: "oauth",
          provider: profile.provider,
          accessToken: profile.access_token,
          refreshToken: profile.refresh_token,
          expiresAt: profile.expires_at || +new Date(Date.now() + 3600 * 1000),
        },
      });

    return this.saveSession(req, user);
  }

  public async logout(req: Request, res: Response): Promise<void> {
    return new Promise((resolve, reject) => {
      req.session.destroy((error) => {
        if (error)
          return reject(
            new InternalServerErrorException("Failed to destroy session"),
          );

        res.clearCookie(this.configService.getOrThrow<string>("SESSION_NAME"));
        resolve();
      });
    });
  }

  public async saveSession(req: Request, user: User) {
    return new Promise((resolve, reject) => {
      req.session.userId = user.id;

      req.session.save((error) => {
        if (error)
          return reject(
            new InternalServerErrorException("Failed to save session"),
          );

        resolve({ user });
      });
    });
  }
}
