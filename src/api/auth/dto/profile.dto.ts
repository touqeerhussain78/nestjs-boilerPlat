import { OmitType, PartialType } from '@nestjs/swagger';
import { RegisterDto } from './register.dto';

export class ProfileDto extends PartialType(
  OmitType(RegisterDto, ['email', 'password', 'confirmPassword']),
) {}
