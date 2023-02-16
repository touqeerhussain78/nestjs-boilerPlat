import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Exists } from '@/decorator/exists.decorator';
import { User } from '@/api/user/entities/user.entity';
import { IsNull, Not } from 'typeorm';

export class ForgotPasswordDto {
  @ApiProperty({
    required: true,
    example: 'test@mailinator.com',
  })
  @IsNotEmpty()
  @IsEmail()
  @Exists({
    entity: User,
    column: 'email',
    where: {
      password: Not(IsNull()),
    },
  })
  email: string;
}
