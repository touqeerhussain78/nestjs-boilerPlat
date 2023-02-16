import { PermissionService } from '@/api/permission/permission.service';
import { Roles } from '@/api/user/enums/role.enum';
import { testingModule } from '@/utility/app';
import { classToJson } from '@/utility/common';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { strict as assert } from 'node:assert';
import request from 'supertest';
import {
  getItem,
  getItemsWithOutBaseService,
  getPermissionData,
  getToken,
} from './utils';
import PermissionSeeder from '@/api/permission/seeders/permission.seeder';
import { UserService } from '@/api/user/user.service';
import UserSeeder from '@/api/user/seeders/user.seeder';

describe('PermissionController (e2e)', () => {
  let token: string;
  let app: INestApplication;
  let service: PermissionService;
  let userService: UserService;
  const url = '/api/permission';

  beforeAll(async () => {
    const { testingApp, moduleFixture } = await testingModule();
    app = testingApp;
    service = moduleFixture.get(PermissionService);
    userService = moduleFixture.get(UserService);
    token = await getToken(moduleFixture, Roles.ADMIN);
  });

  it(`${url} (GET)`, async () => {
    return request(app.getHttpServer())
      .get(`${url}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(async ({ body }) => {
        assert.deepEqual(body.data, classToJson(await service.findAll()));
      });
  });

  it(`${url} (POST)`, async () => {
    const permissionData = getPermissionData();
    return request(app.getHttpServer())
      .post(`${url}`)
      .set('Authorization', `Bearer ${token}`)
      .send(permissionData)
      .expect(201)
      .then(async ({ body }) => {
        assert.deepEqual(
          body.data,
          classToJson(await service.findOne(body.data.id)),
        );
      });
  });

  it(`${url}/{id} (GET)`, async () => {
    const id = await getItemsWithOutBaseService(service, PermissionSeeder);
    return request(app.getHttpServer())
      .get(`${url}/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(async ({ body }) => {
        assert.deepEqual(body.data, classToJson(await service.findOne(id)));
      });
  });

  it(`${url}/{id} (PATCH)`, async () => {
    const id = await getItemsWithOutBaseService(service, PermissionSeeder);
    const permissionData = getPermissionData();
    return request(app.getHttpServer())
      .patch(`${url}/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(permissionData)
      .expect(200)
      .then(async ({ body }) => {
        assert.deepEqual(body.message, 'OK');
      });
  });

  it(`${url}/{id} (DELETE)`, async () => {
    const id = await getItemsWithOutBaseService(service, PermissionSeeder);
    return request(app.getHttpServer())
      .delete(`${url}/${id}`)
      .expect(HttpStatus.OK)
      .then(async ({ body }) => {
        assert.deepEqual(body.message, 'OK');
      });
  });

  it(`${url}/{userId}/{permissionId} (POST)`, async () => {
    const permissioinId = await getItemsWithOutBaseService(
      service,
      PermissionSeeder,
    );
    const userId = await getItem(userService, UserSeeder);
    return request(app.getHttpServer())
      .post(`${url}/user-custom-permission/${userId}/${permissioinId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.CREATED)
      .then(async ({ body }) => {
        assert.deepEqual(body.message, 'OK');
      });
  });

  it(`${url}/role-custom-permissioin/{roleId}/{permissionId} (POST)`, async () => {
    const permissioinId = await getItemsWithOutBaseService(
      service,
      PermissionSeeder,
    );
    const roles = ['1', '2'];
    return request(app.getHttpServer())
      .post(`${url}/role-custom-permissioin/${roles}/${permissioinId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.CREATED)
      .then(async ({ body }) => {
        assert.deepEqual(body.message, 'OK');
      });
  });
});
