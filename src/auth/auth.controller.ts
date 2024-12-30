import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignupDto } from "@/auth/dto/signup.dto";
import { Request, Response } from "express";
import { LoginDto } from "@/auth/dto/login.dto";
import { Recaptcha } from "@nestlab/google-recaptcha";
import { AuthProviderGuard } from "@/auth/guards/provider.guard";
import { ConfigService } from "@nestjs/config";
import { ProviderService } from "@/provider/provider.service";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly providerService: ProviderService,
  ) {}

  @Recaptcha()
  @Post("signup")
  @HttpCode(HttpStatus.CREATED)
  public async signup(@Req() req: Request, @Body() dto: SignupDto) {
    return this.authService.signup(req, dto);
  }

  @Recaptcha()
  @Post("login")
  @HttpCode(HttpStatus.OK)
  public async login(@Req() req: Request, @Body() dto: LoginDto) {
    return this.authService.login(req, dto);
  }

  @Get("/oauth/callback/:provider")
  @UseGuards(AuthProviderGuard)
  @HttpCode(HttpStatus.OK)
  public async callback(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Query("code") code: string,
    @Param("provider") provider: string,
  ) {
    if (!code) throw new BadRequestException("No code provided");

    await this.authService.extractProfileFromCode(req, provider, code);

    return res.redirect(
      `${this.configService.getOrThrow<string>("ALLOWED_ORIGIN")}/user/settings`,
    );
  }

  @Get("/oauth/connect/:provider")
  @UseGuards(AuthProviderGuard)
  @HttpCode(HttpStatus.OK)
  public async connect(@Param("provider") provider: string) {
    const providerInstance = this.providerService.findByService(provider);

    return {
      url: providerInstance.getAuthUrl(),
    };
  }

  @Post("logout")
  @HttpCode(HttpStatus.OK)
  public async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.logout(req, res);
  }
}
