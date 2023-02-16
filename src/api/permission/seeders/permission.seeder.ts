import { Factory, Seeder } from 'typeorm-seeding';
import { Permission } from '../entities/permission.entity';
//when you want to save user in database you need to change makeMany to createMany
export class PermissionSeeder implements Seeder {
  public async run(factory: Factory) {
    await factory(Permission)().makeMany(10);
  }
}
export default PermissionSeeder;
