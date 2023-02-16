import { DataSource, QueryFailedError } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { Role } from '../entities/role.entity';
import { Roles } from '@/api/user/enums/role.enum';

export class DefaultRoleSeeder implements Seeder {
  public async run(factory: Factory, connection: DataSource) {
    const roleRepository = connection.getRepository(Role);
    for (const key in Roles) {
      const role = Roles[key];
      const name = role;
      const slug = role;
      const level = 1;
      let rolerepo = await roleRepository.findOneBy({ name });
      const roleData = await factory(Role)().make({
        name,
        slug,
        level,
      });
      if (rolerepo) {
        rolerepo = roleRepository.create(Object.assign(rolerepo, roleData));
      } else {
        rolerepo = roleRepository.create(roleData);
      }
      await roleRepository.save(rolerepo).catch((error: QueryFailedError) => {
        console.log(error.message);
      });
    }
  }
}

export default DefaultRoleSeeder;
