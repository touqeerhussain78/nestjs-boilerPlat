import { Module } from '@nestjs/common';
import { AuthModule } from '@/api/auth/auth.module';
import { UserModule } from '@/api/user/user.module';
import { BaseModule } from '@/base/base.module';
import { MediaModule } from './media/media.module';
import { RolesModule } from './roles/roles.module';
import { PermissionModule } from './permission/permission.module';

@Module({
  imports: [
    MediaModule,
    BaseModule,
    AuthModule,
    UserModule,
    RolesModule,
    PermissionModule,
  ],
})
export class ApiModule {}
