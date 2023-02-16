import { Module } from '@nestjs/common';
import { BaseService } from './base.service';
import { BaseController } from './base.controller';
import { BaseEntity } from './entities/base.entity';

@Module({
  providers: [BaseService, BaseController, BaseEntity],
  exports: [BaseService, BaseController, BaseEntity],
})
export class BaseModule {}
