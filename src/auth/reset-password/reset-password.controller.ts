import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from "@nestjs/common";
import { ResetPasswordService } from "./reset-password.service";
import { ResetPasswordDto } from "@/auth/reset-password/dto/reset-password.dto";
import { Recaptcha } from "@nestlab/google-recaptcha";
import { NewPasswordDto } from "@/auth/reset-password/dto/new-password.dto";

@Controller("auth/reset-password")
export class ResetPasswordController {
  constructor(private readonly resetPasswordService: ResetPasswordService) {}

  @Recaptcha()
  @Post()
  @HttpCode(HttpStatus.OK)
  public async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.resetPasswordService.resetPassword(dto);
  }

  @Recaptcha()
  @Post("new/:token")
  @HttpCode(HttpStatus.OK)
  public async newPassword(
    @Body() dto: NewPasswordDto,
    @Param("token") token: string,
  ) {
    return this.resetPasswordService.newPassword(dto, token);
  }
}
