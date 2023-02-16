import { IsEmail, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { Match } from '@/decorator/match.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { Exists } from '@/decorator/exists.decorator';
import { ForgotToken } from '@/decorator/forgot-token.decorator';
import { User } from '@/api/user/entities/user.entity';

export class ResetPasswordDto {
  @ApiProperty({
    required: true,
    example: 'test@mailinator.com',
  })
  @IsNotEmpty()
  @IsEmail()
  @Exists(
    {
      entity: User,
      column: 'email',
    },
    {
      message: "We can't find a user with that email address.",
    },
  )
  email: string;

  @ApiProperty({
    required: true,
    minLength: 8,
    maxLength: 255,
    example: 'string123',
  })
  @MinLength(8)
  @MaxLength(255)
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    required: true,
    minLength: 8,
    maxLength: 255,
    example: 'string123',
  })
  @Match('password', {
    message: 'The password confirmation does not match',
  })
  @IsNotEmpty()
  confirmPassword: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @ForgotToken('invalid')
  @ForgotToken('expire', {
    message: 'Token is expire',
  })
  token: string;
}
