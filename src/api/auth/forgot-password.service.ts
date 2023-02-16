import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { PasswordReset } from './entities/password-reset.entity';

@Injectable()
export class ForgotPasswordService {
  constructor(
    @InjectRepository(PasswordReset)
    private passwordResetRepository: Repository<PasswordReset>,
  ) {}

  create(forgotPasswordDto: ForgotPasswordDto) {
    return this.passwordResetRepository.save(
      this.passwordResetRepository.create(forgotPasswordDto),
    );
  }

  find(query: object) {
    return this.passwordResetRepository.findOne(query);
  }

  remove(email: string) {
    return this.passwordResetRepository.delete({ email: email });
  }

  getRepository() {
    return this.passwordResetRepository;
  }
}
