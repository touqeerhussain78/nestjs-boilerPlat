import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    required: true,
    example: 'test@mailinator.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    required: true,
    minLength: 8,
    maxLength: 255,
    example: 'string@123',
  })
  @IsNotEmpty()
  password: string;
}
