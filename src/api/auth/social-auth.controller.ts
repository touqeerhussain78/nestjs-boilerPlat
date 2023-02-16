import {
  Controller,
  Post,
  Body,
  UseGuards,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { GuestGuard } from '@/api/user/guards/guest.guard';
import { SocialAuthService } from './social-auth.service';
import { SocialRegisterDto } from './dto/social-register.dto';
import { SocialLoginDto } from './dto/social.login.dto';
import { formatDate } from '@/utility/date';
import { SocialAuthEnum } from '@/api/auth/enums/social-auth.enum';
import { EntityNotFoundError } from 'typeorm';
import { throwError } from 'rxjs';
import { SocialRegisterWithoutLoginDto } from './dto/social-register-without-login.dto';

@ApiTags('social-auth')
@Controller('auth/social')
@UseGuards(GuestGuard)
export class SocialAuthController {
  constructor(
    private authService: AuthService,
    private service: SocialAuthService,
  ) {}

  private async facebookLogin(id: string, token: string) {
    const validatedUser = await this.service.validateFacebookUser(id);
    const validToken = await this.service.validateFacebookToken(id, token);
    if (!validToken) {
      throw new UnauthorizedException();
    }
    return this.authService.loginData(validatedUser);
  }

  private async tiktokLogin(token: string) {
    const { result: validToken, data } = await this.service.validateTiktokToken(
      token,
    );
    if (!validToken) {
      throw new UnauthorizedException();
    }
    const { access_token: accessToken, open_id: id } = data;
    const validatedUser = await this.service.validateTiktokUser(
      id,
      accessToken,
    );
    return this.authService.loginData(validatedUser);
  }

  @Post('login')
  @ApiOperation({ summary: 'User Social Login' })
  async login(@Body() body: SocialLoginDto) {
    const { platform, id, token } = body;
    if (platform == SocialAuthEnum.FACEBOOK) {
      return this.facebookLogin(id, token);
    }
    if (platform == SocialAuthEnum.TIKTOK) {
      return this.tiktokLogin(token);
    }
  }

  private async registerUser(
    id: string,
    platform: SocialAuthEnum,
    register: SocialRegisterWithoutLoginDto,
  ) {
    const data = {
      ...register,
      profileImage: register.profileImage
        ? { id: register.profileImage }
        : null,
    };
    const user = await this.authService.register(data);
    await this.service.create({
      platform,
      socialUserId: id,
      user,
      lastLoggedIn: formatDate(new Date()),
    });
    return user;
  }

  private async facebookRegister(
    id: string,
    token: string,
    register: SocialRegisterWithoutLoginDto,
  ) {
    await this.service.validateFacebookToken(id, token);
    try {
      await this.service.validateFacebookUser(id);
    } catch (error) {
      if (!(error instanceof EntityNotFoundError)) {
        throwError(() => error);
      } else {
        return this.registerUser(id, SocialAuthEnum.FACEBOOK, register);
      }
    }
  }

  private async tiktokRegister(
    id: string,
    register: SocialRegisterWithoutLoginDto,
  ) {
    try {
      await this.service.validateTiktokUser(id);
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        throwError(() => error);
      } else {
        return this.registerUser(id, SocialAuthEnum.TIKTOK, register);
      }
    }
  }

  @Post('register')
  async register(@Body() body: SocialRegisterDto) {
    const { platform, id, token, ...register } = body;
    if (platform == SocialAuthEnum.FACEBOOK) {
      await this.facebookRegister(id, token, register);
      return this.facebookLogin(id, token);
    }
    if (platform == SocialAuthEnum.TIKTOK) {
      const validatedUser = await this.tiktokRegister(id, register);
      return this.authService.loginData(validatedUser);
    }
  }
}
