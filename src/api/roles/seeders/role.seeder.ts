import { Factory, Seeder } from 'typeorm-seeding';
import { Role } from '../entities/role.entity';
//when you want to save user in database you need to change makeMany to createMany
export class RoleSeeder implements Seeder {
  public async run(factory: Factory) {
    await factory(Role)().makeMany(10);
  }
}
export default RoleSeeder;
