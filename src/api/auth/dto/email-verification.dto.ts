import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Exists } from '@/decorator/exists.decorator';
import { UserEmailVerification } from '../entities/user-email-verification.entity';

export class EmailVerificationDto {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @Exists(
    {
      entity: UserEmailVerification,
      column: 'token',
    },
    {
      message: 'Invalid token.',
    },
  )
  token: string;
}
