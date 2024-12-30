import { Controller } from '@nestjs/common';
import { EmailConfirmService } from './email-confirm.service';

@Controller('email-confirm')
export class EmailConfirmController {
  constructor(private readonly emailConfirmService: EmailConfirmService) {}
}
