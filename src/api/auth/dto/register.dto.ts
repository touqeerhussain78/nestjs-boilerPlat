import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsOptional,
  IsEnum,
  IsNumberString,
  MaxDate,
  IsDate,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Exists } from '@/decorator/exists.decorator';
import { Unique } from '@/decorator/unique.decorator';
import { User } from '@/api/user/entities/user.entity';
import { Type } from 'class-transformer';
import { Match } from '@/decorator/match.decorator';
import { Gender } from '@/api/user/enums/gender.enum';
import { Media } from '@/api/media/entities/media.entity';
import { Role } from '@/api/roles/entities/role.entity';

export class RegisterDto {
  @ApiProperty({
    required: true,
    maxLength: 255,
    default: 'Test User',
  })
  @IsNotEmpty()
  @Matches(/^[A-Za-z ]+$/i, {
    message: 'Name must contain letters only',
  })
  @MaxLength(255)
  name: string;

  @ApiProperty({
    required: true,
    maxLength: 255,
    default: 'test@mailinator.com',
  })
  @IsNotEmpty()
  @MaxLength(255)
  @IsEmail()
  @Unique({
    entity: User,
    column: 'email',
  })
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
    maxLength: 255,
  })
  @IsNotEmpty()
  @MaxLength(255)
  address: string;

  @ApiProperty({
    default: '1995-02-12',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @MaxDate(new Date())
  dateOfBirth: string;

  @ApiProperty({
    required: true,
    enum: Gender,
  })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({
    required: true,
    maxLength: 12,
    default: '923920283',
  })
  @IsNotEmpty()
  @IsNumberString()
  @MaxLength(12)
  phoneNumber: string;

  @ApiProperty({
    example: 2,
  })
  @IsOptional()
  @Exists({
    entity: Media,
    column: 'id',
  })
  profileImage: number;

  @ApiProperty({
    required: true,
    default: 'user',
  })
  @Exists({
    entity: Role,
    column: 'slug',
  })
  role: string;
}
