import { Entity, Column, AfterLoad } from 'typeorm';
import { BaseEntity } from '@/base/entities/base.entity';

@Entity('medias')
export class Media extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  link: string;

  @Column({ name: 'mime_type', type: 'varchar' })
  mimeType: string;

  @Column({ type: 'integer' })
  size: number;

  @Column({ nullable: true, type: 'varchar' })
  extension: string;

  @AfterLoad()
  updateImageUrl() {
    const appUrl: string = process.env.APP_URL;
    this.link = `${appUrl}${this.link}`;
  }
}
