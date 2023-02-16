import { Permission } from '@/api/permission/entities/permission.entity';
import {
  CanActivate,
  ExecutionContext,
  Type,
  mixin,
  Inject,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { IsEmpty } from 'class-validator';
import { DataSource } from 'typeorm';
import { JwtAuthGuard } from './jwt-auth.guard';

export const PermissionGuard = (slug: string): Type<CanActivate> => {
  class PermissionGuardMixin extends JwtAuthGuard {
    constructor(@Inject(DataSource) private readonly dataSource: DataSource) {
      super();
    }

    async canActivate(context: ExecutionContext) {
      await super.canActivate(context);

      const request = context.switchToHttp().getRequest();
      const user = request.user;

      //get permission that assign to particular with assign role and custom user.
      const permission = await this.dataSource
        .getRepository(Permission)
        .findOne({
          where: { slug: slug },
          relations: { roles: true, userRole: true },
        });

      //when didn't assigned permission to any role or user.
      if (permission.roles === null && permission.userRole === null) {
        return false;
      } else if (
        permission.roles.some((x) => x.name == user.role) ||
        permission.userRole.some((x) => x.id == user.id)
      ) {
        return true;
      }
      throw new HttpException(
        `You aren't permission to access this request. Please contact to admin.`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  return mixin(PermissionGuardMixin);
};
