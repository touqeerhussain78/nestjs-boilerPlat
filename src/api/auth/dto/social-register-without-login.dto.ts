import { OmitType } from '@nestjs/swagger';
import { RegisterDto } from './register.dto';

export class SocialRegisterWithoutLoginDto extends OmitType(RegisterDto, [
  'password',
  'confirmPassword',
]) {}
