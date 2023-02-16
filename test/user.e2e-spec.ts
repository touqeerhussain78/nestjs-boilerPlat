import request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { UserService } from '@/api/user/user.service';
import { getItem, getToken, getUserData } from './utils';
import { testingModule } from '@/utility/app';
import UserSeeder from '@/api/user/seeders/user.seeder';
import { strict as assert } from 'node:assert';
import { classToJson } from '@/utility/common';
import { Roles } from '@/api/user/enums/role.enum';

describe('UserController (e2e)', () => {
  let token: string;
  let app: INestApplication;
  let service: UserService;
  const url = '/api/user';

  beforeAll(async () => {
    const { testingApp, moduleFixture } = await testingModule();
    app = testingApp;
    service = moduleFixture.get(UserService);
    token = await getToken(moduleFixture, Roles.ADMIN);
  });

  it(`${url} (GET)`, async () => {
    return request(app.getHttpServer())
      .get(`${url}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.OK)
      .then(async ({ body }) => {
        assert.deepEqual(
          body.data,
          classToJson((await service.findAll()).data),
        );
      });
  });

  it(`${url} (POST)`, async () => {
    const userData = await getUserData(service);
    return request(app.getHttpServer())
      .post(`${url}`)
      .set('Authorization', `Bearer ${token}`)
      .send(userData)
      .expect(HttpStatus.CREATED)
      .then(async ({ body }) => {
        assert.deepEqual(body.statusCode, HttpStatus.CREATED);
      });
  });

  it(`${url}/{id} (GET)`, async () => {
    const id = await getItem(service, UserSeeder);
    return request(app.getHttpServer())
      .get(`${url}/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.OK)
      .then(async ({ body }) => {
        assert.deepEqual(body.data, classToJson(await service.findOne(id)));
      });
  });

  it(`${url}/{id} (PUT)`, async () => {
    const id = await getItem(service, UserSeeder);
    const userData = await getUserData(service);
    return request(app.getHttpServer())
      .put(`${url}/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(userData)
      .expect(HttpStatus.OK)
      .then(async ({ body }) => {
        assert.deepEqual(body.data, classToJson(await service.findOne(id)));
      });
  });
});
