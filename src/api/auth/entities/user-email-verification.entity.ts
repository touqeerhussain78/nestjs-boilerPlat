import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  BeforeInsert,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { makeToken } from '@/utility/token';
import { User } from '@/api/user/entities/user.entity';

@Entity('user_email_verifications')
export class UserEmailVerification {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.emailVerification, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar' })
  token: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @BeforeInsert()
  async hashToken() {
    this.token = `${makeToken(64)}${this.user.id}`;
  }

  public get verificationLink(): string {
    return `${process.env.WEB_URL}/${
      process.env.EMAIL_VERIFICATION_PATH || ''
    }?token=${this.token}`;
  }
}
