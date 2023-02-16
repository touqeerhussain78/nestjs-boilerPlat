import { Get, Delete, Param, Req } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { Request } from 'express';
import { BaseService } from './base.service';
import { BaseEntity } from './entities/base.entity';

export class BaseController<
  EntityType extends BaseEntity,
  ServiceType extends BaseService<EntityType>,
> {
  protected service: ServiceType;

  @Get('/')
  @ApiQuery({ name: 'pageNumber', type: 'number', required: false })
  @ApiQuery({ name: 'pageSize', type: 'number', required: false })
  @ApiQuery({ name: 'orderBy', type: 'string', required: false })
  @ApiQuery({ name: 'orderType', type: 'string', required: false })
  findAll(@Req() req?: Request) {
    return this.service.findAll(req);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
