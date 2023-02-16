import request from 'supertest';
import { getToken, getUserData } from './utils';
import { testingModule } from '@/utility/app';
import { UserService } from '@/api/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@/api/user/entities/user.entity';
import { Roles } from '@/api/user/enums/role.enum';
import { HttpStatus } from '@nestjs/common';

const url = '/api/me';

export const initialize = async (role?: Roles) => {
  const { testingApp, moduleFixture } = await testingModule();
  const service = moduleFixture.get(UserService);
  const jwtService = moduleFixture.get(JwtService);
  const token = await getToken(moduleFixture, role ? role : Roles.USER);
  const user = jwtService.decode(token) as User;
  return { testingApp, moduleFixture, service, token, user };
};

export const getProfile = async () => {
  const { testingApp, token } = await initialize();
  const { body } = await request(testingApp.getHttpServer())
    .get(`${url}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(HttpStatus.OK);
  return body;
};

export const putProfile = async () => {
  const {
    testingApp,
    token,
    service,
    user: { roles },
  } = await initialize(Roles.USER);
  const data = {
    ...(await getUserData(service)),
    roles,
  };
  const { body } = await request(testingApp.getHttpServer())
    .put(`${url}`)
    .set('Authorization', `Bearer ${token}`)
    .send(data)
    .expect(HttpStatus.OK);

  return body;
};

export const postLogout = async () => {
  const { testingApp, token } = await initialize();
  const { body } = await request(testingApp.getHttpServer())
    .post(`${url}/logout`)
    .set('Authorization', `Bearer ${token}`)
    .expect(HttpStatus.CREATED);
  return body;
};

export const updatePasswordWithDifferentOldOne = async () => {
  const { testingApp, token } = await initialize();
  const data = {
    oldPassword: 'password@123',
    newPassword: 'password@123',
  };

  const { body } = await request(testingApp.getHttpServer())
    .put(`${url}/password`)
    .set('Authorization', `Bearer ${token}`)
    .send(data)
    .expect(HttpStatus.BAD_REQUEST);
  return body;
};

export const updatePasswordWithCorrectPassword = async () => {
  const { testingApp, token } = await initialize();
  const data = {
    oldPassword: 'password@123',
    newPassword: 'password@123',
  };

  const { body } = await request(testingApp.getHttpServer())
    .put(`${url}/password`)
    .set('Authorization', `Bearer ${token}`)
    .send(data)
    .expect(HttpStatus.BAD_REQUEST);
  return body;
};

describe('ProfileController (e2e)', () => {
  it(`${url} (GET)`, getProfile);

  it(`${url} (PUT)`, putProfile);

  it(`${url}/logout (POST)`, postLogout);

  it(`${url}/password (PUT)`, updatePasswordWithDifferentOldOne);
});
