import { Factory, Seeder } from 'typeorm-seeding';
import { User } from '@/api/user/entities/user.entity';
//when you want to save user in database you need to change makeMany to createMany
export class UserSeeder implements Seeder {
  public async run(factory: Factory) {
    await factory(User)().makeMany(10);
  }
}
export default UserSeeder;
