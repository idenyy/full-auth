import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from "@nestjs/common";
import { EmailConfirmService } from "./email-confirm.service";
import { Request } from "express";
import { ConfirmationDto } from "@/auth/email-confirm/dto/confirmation.dto";

@Controller("/auth/email-confirm")
export class EmailConfirmController {
  constructor(private readonly emailConfirmService: EmailConfirmService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async verification(@Req() req: Request, @Body() dto: ConfirmationDto) {
    return this.emailConfirmService.verification(req, dto);
  }
}
