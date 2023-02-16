import { ApiProperty } from '@nestjs/swagger';
import { MinLength, MaxLength, IsNotEmpty } from 'class-validator';

export class PasswordDto {
  @ApiProperty({
    required: true,
    minLength: 8,
    maxLength: 255,
    example: 'string123',
  })
  @MinLength(8)
  @MaxLength(255)
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({
    required: true,
    minLength: 8,
    maxLength: 255,
    example: 'string123',
  })
  @MinLength(8)
  @MaxLength(255)
  @IsNotEmpty()
  newPassword: string;
}
