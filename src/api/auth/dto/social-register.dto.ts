import { Unique } from '@/decorator/unique.decorator';
import { IntersectionType, OmitType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { UserSocialAuth } from '../entities/user-social-auth.entity';
import { RegisterDto } from './register.dto';
import { SocialLoginDto } from './social.login.dto';

export class SocialRegisterDto extends IntersectionType(
  OmitType(SocialLoginDto, ['id']),
  OmitType(RegisterDto, ['password', 'confirmPassword']),
) {
  @IsNotEmpty()
  @Unique({
    entity: UserSocialAuth,
    column: 'social_user_id',
  })
  id: string;
}
