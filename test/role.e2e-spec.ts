import request from 'supertest';
import { getRoleItem, getToken } from './utils';
import { testingModule } from '@/utility/app';
import { JwtService } from '@nestjs/jwt';
import { User } from '@/api/user/entities/user.entity';
import { Roles } from '@/api/user/enums/role.enum';
import { HttpStatus } from '@nestjs/common';
import { RolesService } from '@/api/roles/roles.service';
import RoleSeeder from '@/api/roles/seeders/role.seeder';

const url = '/api/roles';

export const initialize = async () => {
  const { testingApp, moduleFixture } = await testingModule();
  const service = moduleFixture.get(RolesService);
  const jwtService = moduleFixture.get(JwtService);
  const token = await getToken(moduleFixture, Roles.ADMIN);
  const user = jwtService.decode(token) as User;
  return { testingApp, moduleFixture, service, token, user };
};

export const getRole = async () => {
  const { testingApp, token } = await initialize();
  const { body } = await request(testingApp.getHttpServer())
    .get(`${url}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(HttpStatus.OK);
  return body;
};

export const createRole = async () => {
  const { testingApp, token } = await initialize();
  const data = {
    name: 'test1',
    level: 100,
  };
  const { body } = await request(testingApp.getHttpServer())
    .post(`${url}`)
    .set('Authorization', `Bearer ${token}`)
    .send(data)
    .expect(HttpStatus.CREATED);
  return body;
};

export const getRoleById = async () => {
  const { testingApp, token, service } = await initialize();

  const id = await getRoleItem(service, RoleSeeder);
  const { body } = await request(testingApp.getHttpServer())
    .get(`${url}/${id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(HttpStatus.OK);
  return body;
};

export const updateRole = async () => {
  const { testingApp, token, service } = await initialize();

  const id = await getRoleItem(service, RoleSeeder);
  const data = {
    name: 'Can View Users',
    slug: 'view.users',
    description: 'Can view users',
    model: 'Permission',
  };
  const { body } = await request(testingApp.getHttpServer())
    .patch(`${url}/${id}`)
    .set('Authorization', `Bearer ${token}`)
    .send(data)
    .expect(HttpStatus.OK);
  return body;
};

export const deleteRole = async () => {
  const { testingApp, service } = await initialize();

  const id = await getRoleItem(service, RoleSeeder);

  const { body } = await request(testingApp.getHttpServer())
    .delete(`${url}/${id}`)
    .expect(HttpStatus.OK);
  return body;
};

describe('RoleController (e2e)', () => {
  it(`${url} (GET)`, getRole);

  it(`${url} (POST)`, createRole);

  it(`${url}/{id} (GET)`, getRoleById);

  it(`${url}/{id} (PATCH)`, updateRole);

  it(`${url}/{id} (DELETE)`, deleteRole);
});
