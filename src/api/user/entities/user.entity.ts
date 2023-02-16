import * as bcrypt from 'bcrypt';
import {
  Entity,
  Column,
  BeforeInsert,
  BeforeUpdate,
  ManyToOne,
  JoinColumn,
  OneToOne,
  AfterLoad,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { BaseEntity } from '@/base/entities/base.entity';
import { UserEmailVerification } from '@/api/auth/entities/user-email-verification.entity';
import { Gender } from '../enums/gender.enum';
import { UserSocialAuth } from '@/api/auth/entities/user-social-auth.entity';
import { Media } from '@/api/media/entities/media.entity';
import { Role } from '@/api/roles/entities/role.entity';
import { Permission } from '@/api/permission/entities/permission.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column()
  name: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column({ name: 'email_verified_at', type: 'datetime', nullable: true })
  emailVerifiedAt: Date;

  @Column()
  address: string;

  @Column({ name: 'date_of_birth', type: 'date', nullable: true })
  dateOfBirth: string;

  @Column({
    type: 'simple-enum',
    enum: Gender,
    default: Gender.MALE,
  })
  gender: Gender;

  @Column({ name: 'phone_number' })
  phoneNumber: string;

  @ManyToOne(() => Media, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'profile_image_id' })
  profileImage: Media;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @OneToOne(() => UserSocialAuth, (socialAuth) => socialAuth.user, {
    onDelete: 'CASCADE',
  })
  userSocialAuth: UserSocialAuth;

  @Column({
    name: 'password_reset_at',
    type: 'datetime',
    nullable: true,
  })
  passwordResetAt: Date;

  @Column({ select: true, nullable: true })
  password: string;
  private tempPassword: string;
  @AfterLoad()
  loadTempPassword(): void {
    this.tempPassword = this.password;
  }
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.tempPassword != this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  @OneToOne(
    () => UserEmailVerification,
    (emailVerification) => emailVerification.user,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  emailVerification: UserEmailVerification;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToMany(() => Role, (role) => role.users, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Role[];

  @ManyToMany(() => Permission, (permissions) => permissions.userRole, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  permissions: Permission[];
}
