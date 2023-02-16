import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from '@/api/user/dto/create-user.dto';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['role']),
) {}
