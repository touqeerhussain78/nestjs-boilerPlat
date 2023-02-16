import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Injectable,
  HttpStatus,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { UserSocialAuth } from './entities/user-social-auth.entity';
import { SocialAuthEnum } from '@/api/auth/enums/social-auth.enum';
import { ConfigService } from '@nestjs/config';
import { validate as validateFacebook } from '@/utility/facebook';
import { user, validate as validateTiktok } from '@/utility/tiktok';

@Injectable()
export class SocialAuthService {
  constructor(
    @InjectRepository(UserSocialAuth)
    protected repository: Repository<UserSocialAuth>,
    protected configService: ConfigService,
  ) {}

  async validateFacebookToken(id: string, token: string) {
    const clientId = this.configService.get<string>('FACEBOOK_CLIENT_ID');
    const clientSecret = this.configService.get<string>(
      'FACEBOOK_CLIENT_SECRET',
    );
    return validateFacebook(id, token, clientId, clientSecret);
  }

  async validateFacebookUser(id: string) {
    const socialAuth = await this.repository.findOneOrFail({
      where: {
        socialUserId: id,
        platform: SocialAuthEnum.FACEBOOK,
      },
      relations: { user: true },
    });

    if (!socialAuth.user.isActive) {
      throw new HttpException(
        'This user has been disabled by an administrator',
        HttpStatus.BAD_REQUEST,
      );
    }
    return socialAuth.user;
  }

  async validateTiktokToken(token: string) {
    const clientKey = this.configService.get<string>('TIKTOK_CLIENT_KEY');
    const clientSecret = this.configService.get<string>('TIKTOK_CLIENT_SECRET');
    return validateTiktok(token, clientKey, clientSecret);
  }

  async validateTiktokUser(id: string, token: string = null) {
    const socialAuth = await this.repository.findOne({
      where: {
        socialUserId: id,
        platform: SocialAuthEnum.TIKTOK,
      },
      relations: { user: true },
    });
    if (!socialAuth) {
      if (token) {
        const { data } = await user(token);
        throw new NotFoundException({
          statusCode: 404,
          message: 'Not Found',
          data,
        });
      } else {
        throw new NotFoundException();
      }
    }

    if (!socialAuth.user.isActive) {
      throw new HttpException(
        'This user has been disabled by an administrator',
        HttpStatus.BAD_REQUEST,
      );
    }
    return socialAuth.user;
  }

  create(data: DeepPartial<UserSocialAuth>) {
    return this.repository.save(this.repository.create(data));
  }

  getRepository() {
    return this.repository;
  }
}
