import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from '@/api/user/entities/user.entity';
import { BaseEntity } from '@/base/entities/base.entity';
import { SocialAuthEnum } from '@/api/auth/enums/social-auth.enum';

@Entity('user_social_logins')
export class UserSocialAuth extends BaseEntity {
  @OneToOne(() => User, (user) => user, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'simple-enum',
    enum: SocialAuthEnum,
  })
  platform: SocialAuthEnum;

  @Column({ name: 'social_user_id', unique: true, type: 'varchar' })
  socialUserId: string;

  @Column({ name: 'last_logged_in', type: 'datetime' })
  lastLoggedIn: string;
}
