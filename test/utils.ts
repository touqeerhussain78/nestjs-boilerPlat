import { AuthService } from '@/api/auth/auth.service';
import { User } from '@/api/user/entities/user.entity';
import { UserService } from '@/api/user/user.service';
import { BaseServiceInterface } from '@/base/base.service.interface';
import { BaseEntity } from '@/base/entities/base.entity';
import { TestingModule } from '@nestjs/testing';
import { runSeeder } from 'typeorm-seeding';
import { SeederConstructor } from 'typeorm-seeding/dist/types';
import { DeepPartial } from 'typeorm';
import { permissionData, userData } from '@/utility/data';
import { Roles } from '@/api/user/enums/role.enum';
import { Exception } from 'handlebars';
import { Permission } from '@/api/permission/entities/permission.entity';
import { PermissionService } from '@/api/permission/permission.service';
import { RolesService } from '@/api/roles/roles.service';

const generateToken = async (moduleFixture: TestingModule, email: string) => {
  const userService = moduleFixture.get(UserService);
  const authService = moduleFixture.get(AuthService);
  const user = await userService.findOneByEmail(email);

  if (!user) {
    throw new Exception('please run defaultseeder then run the test command.');
  }
  return authService.login(user);
};

export const getToken = (moduleFixture: TestingModule, role: Roles) =>
  generateToken(moduleFixture, `${role}@mailinator.com`);

export const getItem = async <T extends BaseEntity>(
  service: BaseServiceInterface<T>,
  seeder: SeederConstructor,
) => {
  const items = (await service.findAll()).data;
  if (items.length < 1) {
    await runSeeder(seeder);
    getItem(service, seeder);
  }
  return items[0].id;
};

export const getItemsWithOutBaseService = async (
  service: PermissionService,
  seeder: SeederConstructor,
) => {
  const items = await service.findAll();
  if (items.length < 1) {
    await runSeeder(seeder);
    getItemsWithOutBaseService(service, seeder);
  }
  return items[0].id;
};

export const getRoleItem = async (
  service: RolesService,
  seeder: SeederConstructor,
) => {
  const items = await service.findAll();
  if (items.length < 1) {
    await runSeeder(seeder);
    getRoleItem(service, seeder);
  }
  return items[0].id;
};

export const getUserData = async (
  service: UserService,
): Promise<DeepPartial<User>> => {
  const data = userData();
  const { email, phoneNumber } = data;
  if (
    (await service.findOneByEmail(email)) ||
    (await service.getRespository().findOneBy({ phoneNumber }))
  ) {
    getUserData(service);
  }
  return data;
};

export const getPermissionData = (): DeepPartial<Permission> => {
  return permissionData();
};
