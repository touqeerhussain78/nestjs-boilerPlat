import { define } from 'typeorm-seeding';
import { roleData } from '@/utility/data';
import { Role } from '../entities/role.entity';

define(Role, () => roleData());
