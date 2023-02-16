import { define } from 'typeorm-seeding';
import { User } from '@/api/user/entities/user.entity';
import { userData } from '@/utility/data';

define(User, () => userData());
