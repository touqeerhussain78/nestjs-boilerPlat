import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    protected configService: ConfigService,
    private mailerService: MailerService,
  ) {}

  async sendMail(
    toEmail: string,
    subject: string,
    template: string,
    data?: object,
  ) {
    try {
      const mailUser = this.configService.get<string>('MAIL_USER');
      const mailPass = this.configService.get<string>('MAIL_PASSWORD');
      if (mailUser && mailPass) {
        await this.mailerService.sendMail({
          to: toEmail,
          subject: subject,
          template: template,
          context: data,
        });
      }
    } catch (error) {
      console.trace(error);
    }
  }
}
