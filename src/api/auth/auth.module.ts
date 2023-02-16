import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from '@/api/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordReset } from './entities/password-reset.entity';
import { MailService } from '@/mail.service';
import { ForgotPasswordService } from './forgot-password.service';
import { ProfileController } from './profile.controller';
import { SocialAuthController } from './social-auth.controller';
import { UserSocialAuth } from './entities/user-social-auth.entity';
import { SocialAuthService } from './social-auth.service';
import { EmailVerificationService } from './email-verification.service';
import { UserEmailVerification } from './entities/user-email-verification.entity';
import { RolesService } from '../roles/roles.service';
import { Role } from '../roles/entities/role.entity';

@Module({
  imports: [
    forwardRef(() => UserModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: { expiresIn: '30d' },
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      PasswordReset,
      UserSocialAuth,
      UserEmailVerification,
      Role,
    ]),
  ],
  controllers: [AuthController, SocialAuthController, ProfileController],
  providers: [
    AuthService,
    SocialAuthService,
    JwtStrategy,
    MailService,
    ForgotPasswordService,
    EmailVerificationService,
    RolesService,
  ],
  exports: [AuthService, ForgotPasswordService],
})
export class AuthModule {}
