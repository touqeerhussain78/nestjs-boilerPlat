import { User } from '@/api/user/entities/user.entity';
import { PasswordReset } from '@/api/auth/entities/password-reset.entity';
import { UserSocialAuth } from '@/api/auth/entities/user-social-auth.entity';
import { UserEmailVerification } from '@/api/auth/entities/user-email-verification.entity';
import { Media } from './api/media/entities/media.entity';
import { Role } from './api/roles/entities/role.entity';
import { Permission } from './api/permission/entities/permission.entity';

export const entities = [
  Media,
  User,
  PasswordReset,
  UserSocialAuth,
  UserEmailVerification,
  Role,
  Permission,
];
