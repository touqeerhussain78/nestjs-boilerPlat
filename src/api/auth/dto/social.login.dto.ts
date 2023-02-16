import { IsEnum, IsNotEmpty, ValidateIf } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SocialAuthEnum } from '@/api/auth/enums/social-auth.enum';

export class SocialLoginDto {
  @ApiPropertyOptional()
  @IsNotEmpty()
  @ValidateIf((o: SocialLoginDto) => o.platform == SocialAuthEnum.FACEBOOK)
  id: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    required: true,
    enum: SocialAuthEnum,
  })
  @IsEnum(SocialAuthEnum)
  platform: SocialAuthEnum;
}
