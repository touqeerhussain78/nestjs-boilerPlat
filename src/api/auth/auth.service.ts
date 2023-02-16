import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { PasswordReset } from './entities/password-reset.entity';
import { MailService } from '@/mail.service';
import { ForgotPasswordService } from './forgot-password.service';
import { compare } from 'bcrypt';
import { User } from '@/api/user/entities/user.entity';
import { EmailVerificationService } from './email-verification.service';
import { Roles } from '../user/enums/role.enum';
import { Role } from '../roles/entities/role.entity';

type Register = DeepPartial<User>;
@Injectable()
export class AuthService {
  constructor(
    protected userService: UserService,
    private jwtService: JwtService,
    @InjectRepository(PasswordReset)
    protected passwordResetRepository: Repository<PasswordReset>,
    protected readonly mailService: MailService,
    protected readonly forgotPasswordService: ForgotPasswordService,
    protected emailVerificationService: EmailVerificationService,
  ) {}

  async register(data: Register) {
    const user = await this.userService.create(data);
    await this.emailVerificationService.sentEmail(user);

    return this.userService.findOne(user.id, { relations: { roles: true } });
  }

  async loginData(validatedUser: User) {
    const token = await this.login(validatedUser);
    const user = await this.userService.findOne(validatedUser.id, {
      relations: { roles: true },
    });

    return { data: user, token };
  }

  async validateUser(email: string, pass: string) {
    const user = await this.userService.findOneUser(email);

    if (!user || !(await compare(pass, user.password))) {
      throw new HttpException(
        'These credentials do not match our records.',
        HttpStatus.BAD_REQUEST,
      );
    } else if (!user.isActive) {
      throw new HttpException(
        'This user has been disabled by an administrator.',
        HttpStatus.BAD_REQUEST,
      );
    } else if (!user.emailVerifiedAt) {
      throw new HttpException(
        'Your email address is not verified.',
        HttpStatus.BAD_REQUEST,
      );
    }
    return user;
  }

  async login(user) {
    const { ...payload } = user;
    return this.jwtService.sign(payload);
  }

  async logout(user: User) {
    const { id } = user;
    return id;
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    let data = {};
    const forgotToken = await this.forgotPasswordService.find({
      where: { email: forgotPasswordDto.email },
    });
    if (forgotToken) {
      await this.forgotPasswordService.remove(forgotToken.email);
    }

    const created = await this.forgotPasswordService.create(forgotPasswordDto);
    const user = await this.userService.findOneByEmail(forgotPasswordDto.email);
    data = { ...data, userName: user.name, resetLink: created.resetLink };

    await this.mailService.sendMail(
      forgotPasswordDto.email,
      'Reset Your Password',
      'forgot-password',
      data,
    );

    return HttpStatus.OK;
  }

  resetPassword(resetPasswordDto: ResetPasswordDto) {
    return this.userService.resetPassword(
      resetPasswordDto.email,
      resetPasswordDto.password,
    );
  }
}
