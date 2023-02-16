import request from 'supertest';
import { testingModule } from '@/utility/app';
import { UserService } from '@/api/user/user.service';
import { getUserData } from './utils';
import { formatDate } from '@/utility/date';
import { MailerService } from '@nestjs-modules/mailer';
import { ForgotPasswordService } from '@/api/auth/forgot-password.service';
import { IsNull, Not } from 'typeorm';
import { EmailVerificationService } from '@/api/auth/email-verification.service';
import { HttpStatus } from '@nestjs/common';
import { RolesService } from '@/api/roles/roles.service';
import axios from 'axios';

const url = '/api/auth';

export const initialize = async () => {
  const { testingApp, moduleFixture } = await testingModule();

  const mailerService = moduleFixture.get(MailerService);
  const forgotPasswordService = moduleFixture.get(ForgotPasswordService);
  const emailVerifitionService = moduleFixture.get(EmailVerificationService);
  vi.spyOn(mailerService, 'sendMail').mockImplementation(vi.fn());
  vi.spyOn(axios, 'post').mockImplementation(
    vi.fn((url) => {
      if (
        url ==
        `https://verify.twilio.com/v2/Services/${process.env.TWILIO_VERIFICATION_SERVICE_ID}/VerificationCheck`
      ) {
        return Promise.resolve({
          data: {
            status: 'approved',
          },
        });
      }
    }),
  );
  return {
    testingApp,
    moduleFixture,
    forgotPasswordService,
    emailVerifitionService,
  };
};

export const register = async ({ nest: { httpServer, moduleFixture } }) => {
  const service = moduleFixture.get(UserService);
  const roleService = moduleFixture.get(RolesService);
  const roles = await roleService.findOne(2);
  const data = await getUserData(service);
  const { body } = await request(httpServer)
    .post(`${url}/register`)
    .send({
      ...data,
      confirmPassword: data.password,
      roles: roles,
      role: 'user',
    })
    .expect(201);
  const {
    data: { id },
  } = body;

  await service.update(id, {
    emailVerifiedAt: formatDate(new Date(), 'yyyy-mm-dd hh-ii-ss'),
  });
  return { body, data };
};

export const loginWithNotAssignRole = async ({ nest: { httpServer } }) => {
  const {
    data: { email, password, roles },
  } = await register();
  const data = { email, password, roles };
  const { body } = await request(httpServer)
    .post(`${url}/login`)
    .send(data)
    .expect(400);
  return body;
};

export const loginWithAssignRole = async () => {
  const { testingApp } = await initialize();
  const {
    data: { email, password },
  } = await register();
  const data = { email, password, role: 'user' };
  const { body } = await request(testingApp.getHttpServer())
    .post(`${url}/login`)
    .send(data);
  expect(HttpStatus.OK);
  return body;
};

export const forgotPassword = async () => {
  const { testingApp } = await initialize();
  const {
    data: { email },
  } = await register();
  const data = { email };
  const { body } = await request(testingApp.getHttpServer())
    .post(`${url}/forgot-password`)
    .send(data)
    .expect(200);
  return { body, data };
};

export const resetPassword = async () => {
  const { testingApp, forgotPasswordService } = await initialize();
  const {
    data: { email },
  } = await forgotPassword();
  const { token } = await forgotPasswordService.getRepository().findOne({
    where: { createdAt: Not(IsNull()) },
    order: { createdAt: 'DESC' },
  });
  const password = 'Password@123';
  const data = { email, token, password, confirmPassword: password };
  const { body } = await request(testingApp.getHttpServer())
    .post(`${url}/reset-password`)
    .send(data)
    .expect(200);
  return body;
};

export const emailVerifition = async () => {
  const { testingApp, emailVerifitionService } = await initialize();
  await register();
  const { token } = await emailVerifitionService.getRepository().findOne({
    where: { createdAt: Not(IsNull()) },
    order: { createdAt: 'DESC' },
  });
  const data = { token };
  const { body } = await request(testingApp.getHttpServer())
    .post(`${url}/email-verification`)
    .send(data)
    .expect(200);
  return body;
};

describe('AuthController (e2e)', () => {
  it(`${url}/register (POST)`, register);

  it.skip(`${url}/login (POST)`, loginWithAssignRole);

  it.skip(`${url}/forgot-password (POST)`, forgotPassword);

  it.skip(`${url}/reset-password (POST)`, resetPassword);
});
