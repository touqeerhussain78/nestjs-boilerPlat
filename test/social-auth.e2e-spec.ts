import request from 'supertest';
import { testingModule } from '@/utility/app';
import { UserService } from '@/api/user/user.service';
import { getUserData } from './utils';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailVerificationService } from '@/api/auth/email-verification.service';
import { faker } from '@faker-js/faker';
import axios from 'axios';
import { SocialAuthEnum } from '@/api/user/enums/social-auth.enum';
import { INestApplication } from '@nestjs/common';
import { SocialAuthService } from '@/api/auth/social-auth.service';

const url = '/api/auth/social';

const getSocialId = async (socialAuthService: SocialAuthService) => {
  const socialUserId = faker.random.word();
  if (await socialAuthService.getRepository().findOneBy({ socialUserId })) {
    getSocialId(socialAuthService);
  }
  return socialUserId;
};
const getProviderSocialId = async (
  socialAuthService: SocialAuthService,
  tiktokId?: string,
) => {
  if (!tiktokId) {
    tiktokId = await getSocialId(socialAuthService);
  }
  const facebookId = await getSocialId(socialAuthService);
  if (tiktokId == facebookId) {
    return getProviderSocialId(socialAuthService, tiktokId);
  }
  return { facebookId, tiktokId };
};

export const initialize = async () => {
  const { testingApp, moduleFixture } = await testingModule();
  const service = moduleFixture.get(UserService);
  const mailerService = moduleFixture.get(MailerService);
  const socialAuthService = moduleFixture.get(SocialAuthService);
  const emailVerifitionService = moduleFixture.get(EmailVerificationService);
  const { facebookId, tiktokId } = await getProviderSocialId(socialAuthService);
  vi.spyOn(axios, 'get').mockImplementation(
    vi.fn((url) => {
      if (url == 'https://graph.facebook.com/debug_token') {
        return Promise.resolve({
          data: {
            data: {
              is_valid: true,
              user_id: facebookId,
              scopes: ['public_profile', 'user_posts'],
            },
          },
        });
      } else if (url == 'https://graph.facebook.com/oauth/access_token') {
        return Promise.resolve({
          data: {
            access_token: faker.random.word(),
          },
        });
      }
    }),
  );
  vi.spyOn(axios, 'post').mockImplementation(
    vi.fn((url) => {
      if (url == 'https://open-api.tiktok.com/oauth/access_token') {
        return Promise.resolve({
          data: {
            data: {
              access_token: faker.random.word(),
              open_id: tiktokId,
              refresh_token: faker.random.word(),
              scope: 'user.info.basic,video.list',
            },
            message: 'success',
          },
        });
      }
    }),
  );
  vi.spyOn(mailerService, 'sendMail').mockImplementation(vi.fn());
  return {
    testingApp,
    moduleFixture,
    service,
    tiktokId,
    facebookId,
    emailVerifitionService,
  };
};

export const register = async (
  testingApp: INestApplication,
  service: UserService,
  socialId: string,
  platform: SocialAuthEnum,
) => {
  const data = {
    ...(await getUserData(service)),
    token: faker.random.word(),
    id: socialId,
    platform,
    role: ['user'],
  };
  const { body } = await request(testingApp.getHttpServer())
    .post(`${url}/register`)
    .send({ ...data })
    .expect(401); //when you add the facebook key then change into 201
  return { data, body };
};
export const tiktokRegister = async () => {
  const { testingApp, service, tiktokId } = await initialize();
  return register(testingApp, service, tiktokId, SocialAuthEnum.TIKTOK);
};
export const facebookRegister = async () => {
  const { testingApp, service, facebookId } = await initialize();
  return register(testingApp, service, facebookId, SocialAuthEnum.FACEBOOK);
};

export const login = async (data: Record<string, unknown>) => {
  const { testingApp } = await initialize();
  const { body } = await request(testingApp.getHttpServer())
    .post(`${url}/login`)
    .send(data)
    .expect(201);
  return body;
};
export const facebookLogin = async () => {
  const {
    data: { token, id, platform },
  } = await facebookRegister();
  return login({ token, id, platform });
};

describe('SocialAuthController (e2e)', () => {
  it.skip(`${url}/register (TIKTOK POST)`, tiktokRegister);

  it(`${url}/register (FACEBOOK POST)`, facebookRegister);

  it.skip(`${url}/login (FACEBOOK POST)`, facebookLogin);
});
