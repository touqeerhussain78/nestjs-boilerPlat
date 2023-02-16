import { DataSource, QueryFailedError } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { User } from '@/api/user/entities/user.entity';
import { Roles } from '../enums/role.enum';
import { Role } from '@/api/roles/entities/role.entity';

export class DefaultUserSeeder implements Seeder {
  public async run(factory: Factory, connection: DataSource) {
    const userRepository = connection.getRepository(User);
    const roleRepository = connection.getRepository(Role);
    for (const key in Roles) {
      const role = Roles[key];
      const name = role;
      const email = `${role}@mailinator.com`;
      const password = `${role}@123`;
      const isActive = true;
      let user = await userRepository.findOneBy({ email });
      const roleInput = await roleRepository.findOneBy({ name: role });

      const userData = await factory(User)().make({
        name,
        email,
        password,
        isActive,
      });

      if (user) {
        user = userRepository.create({
          ...Object.assign(user, userData),
          roles: [roleInput],
        });
      } else {
        user = userRepository.create({ ...userData, roles: [roleInput] });
      }
      await userRepository.save(user).catch((error: QueryFailedError) => {
        console.log(error.message);
      });
    }
  }
}
export default DefaultUserSeeder;
