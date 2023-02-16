import { Roles } from '@/api/user/enums/role.enum';
import { SetMetadata } from '@nestjs/common';

export const HasRoles = (...roles: Roles[]) => SetMetadata('roles', roles);
