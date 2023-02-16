import { Role } from '@/api/roles/entities/role.entity';
import DefaultRoleSeeder from '@/api/roles/seeders/default-role.seeder';

import { DataSource, QueryFailedError } from 'typeorm';
import { Factory, runSeeder, Seeder } from 'typeorm-seeding';
import { Permission } from '../entities/permission.entity';
const permissionData1 = require('@/utility/permission.json');

export class DefaultPermissionSeeder implements Seeder {
  public async run(factory: Factory, connection: DataSource) {
    await runSeeder(DefaultRoleSeeder);

    const permissionRepository = connection.getRepository(Permission);
    const roleRepo = connection.getRepository(Role);

    for (const key in permissionData1) {
      const roleBind = [];
      const permission = permissionData1[key];
      const name = permission.name;
      const slug = permission.slug;
      const description = permission.description;
      const entity = permission.model;
      const permissionRole = permission.role;
      for (const key1 in permissionRole) {
        const role = await roleRepo.findOneBy({ slug: permissionRole[key1] });
        roleBind.push(role);
      }

      let preRepo = await permissionRepository.findOneBy({ slug });
      const permissionData = await factory(Permission)().make({
        name,
        slug,
        description,
        entity,
      });
      if (preRepo) {
        preRepo = permissionRepository.create({
          ...Object.assign(preRepo, permissionData),
          roles: roleBind,
        });
      } else {
        preRepo = permissionRepository.create({
          ...permissionData,
          roles: roleBind,
        });
      }
      await permissionRepository
        .save(preRepo)
        .catch((error: QueryFailedError) => {
          console.log(error.message);
        });
    }
  }
}
export default DefaultPermissionSeeder;
