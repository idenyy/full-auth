import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsBoolean()
  isTwoFactorEnabled: boolean;
}
