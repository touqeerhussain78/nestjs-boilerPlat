import { Injectable } from '@nestjs/common';
import { Repository, DeepPartial } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Media } from './entities/media.entity';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    protected repository: Repository<Media>,
  ) {}

  findOne(id: any) {
    return this.repository.findOneByOrFail({ id });
  }

  async create(data: DeepPartial<Media>) {
    const item = await this.repository.save(this.repository.create(data));
    return this.findOne(item.id);
  }
}
