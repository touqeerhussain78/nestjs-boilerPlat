import {
  IsEmail,
  IsNotEmpty,
  MaxLength,
  IsDate,
  IsEnum,
  IsOptional,
  IsNumberString,
  MaxDate,
  Matches,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Unique } from '@/decorator/unique.decorator';
import { User } from '@/api/user/entities/user.entity';
import { Exists } from '@/decorator/exists.decorator';
import { Media } from '@/api/media/entities/media.entity';
import { Type } from 'class-transformer';
import { Gender } from '@/api/user/enums/gender.enum';

export class CreateUserDto {
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
    maxLength: 255,
  })
  @IsNotEmpty()
  @MaxLength(255)
  address: string;

  @ApiProperty({
    required: true,
    default: '1995-02-12',
  })
  @IsNotEmpty()
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
  })
  role: string;

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
    required: false,
    example: 2,
  })
  @IsOptional()
  @Exists({
    entity: Media,
    column: 'id',
  })
  profileImage: number;

  @IsBoolean()
  isActive: boolean;

  @ApiProperty({
    readOnly: true,
  })
  editId: any;
}
