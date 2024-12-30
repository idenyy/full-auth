import { IsEmail, IsNotEmpty, IsString, MinLength, Validate } from 'class-validator';
import { IsPasswordsMatch } from '@/libs/common/decorators/is-passwords-match';

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  name: string
  
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string
  
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password: string
  
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'The password for confirmation must be at least 8 characters long' })
  @Validate(IsPasswordsMatch, {
    message: 'Passwords do not match'
  })
  passwordConfirm: string
  
}