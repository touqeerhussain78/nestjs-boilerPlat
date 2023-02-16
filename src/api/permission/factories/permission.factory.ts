import { define } from 'typeorm-seeding';
import { permissionData } from '@/utility/data';
import { Permission } from '../entities/permission.entity';

define(Permission, () => permissionData());
