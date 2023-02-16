import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  BeforeInsert,
} from 'typeorm';
import { makeToken } from '@/utility/token';

@Entity('password_resets')
export class PasswordReset {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar' })
  token: string;

  @Column({ type: 'datetime', nullable: true })
  expireAt: Date;
  expireTime: '15m';

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @BeforeInsert()
  async hashToken() {
    this.token = makeToken(64);
    this.expireAt = new Date(Date.now() + 15 * 60 * 1000);
  }

  public get resetLink(): string {
    return `${process.env.WEB_URL}/${
      process.env.RESET_PASSWORD_PATH || ''
    }?token=${this.token}&email=${this.email}`;
  }
}
