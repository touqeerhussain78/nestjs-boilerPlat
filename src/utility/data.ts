import { Permission } from '@/api/permission/entities/permission.entity';
import { Role } from '@/api/roles/entities/role.entity';
import { User } from '@/api/user/entities/user.entity';
import { Gender } from '@/api/user/enums/gender.enum';
import { faker } from '@faker-js/faker';
import { randomEnumValue } from './common';
import { formatDate } from './date';
import * as bcrypt from 'bcrypt';

const password = bcrypt.hashSync('password@123', 10);

export const userData = () => {
  const user = new User();
  user.gender = randomEnumValue(Gender);
  user.name = faker.random.words();
  user.email = faker.internet.email();
  user.password = password;
  user.address = faker.address.streetAddress();
  user.dateOfBirth = formatDate(faker.date.past());
  user.phoneNumber = faker.datatype.number().toString();
  user.isActive = faker.datatype.boolean();
  user.emailVerifiedAt = faker.date.past();
  user.roles = null;
  user.profileImage = null;
  return user;
};

export const roleData = () => {
  const role = new Role();
  role.name = faker.random.words();
  role.slug = role.name
    .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-');
  role.level = faker.datatype.number();

  return role;
};

export const permissionData = () => {
  const permission = new Permission();
  permission.name = faker.random.words();
  permission.description = faker.random.words();
  permission.entity = 'permission';
  return permission;
};
