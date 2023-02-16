import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '@/api/user/user.service';
import { MailService } from '@/mail.service';
import { User } from '@/api/user/entities/user.entity';
import { UserEmailVerification } from './entities/user-email-verification.entity';
import { EmailVerificationDto } from './dto/email-verification.dto';

@Injectable()
export class EmailVerificationService {
  constructor(
    @InjectRepository(UserEmailVerification)
    protected repository: Repository<UserEmailVerification>,
    protected readonly mailService: MailService,
    protected userService: UserService,
  ) {}

  async sentEmail(user: User) {
    let data = {};
    const verification = await this.repository.save(
      this.repository.create({ user: { id: user.id } }),
    );

    data = {
      ...data,
      userName: user.name,
      verificationLink: verification.verificationLink,
    };

    await this.mailService.sendMail(
      user.email,
      'Email Verification',
      'email-verification',
      data,
    );

    return verification;
  }

  async verify(emailVerificationDto: EmailVerificationDto) {
    const verification = await this.repository.findOne({
      where: { token: emailVerificationDto.token },
      relations: { user: true },
    });

    await this.userService.verifyEmail(+verification.user.id);
    await this.repository.remove(verification);

    return verification;
  }

  getRepository() {
    return this.repository;
  }
}
