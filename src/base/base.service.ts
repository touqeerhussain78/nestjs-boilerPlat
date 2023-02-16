import {
  DeepPartial,
  FindManyOptions,
  Repository,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOneOptions,
  FindOptionsWhere,
} from 'typeorm';
import { merge } from 'lodash';
import { BaseEntity } from './entities/base.entity';
import { FindType, Query } from '@/utility/types';
import { BaseServiceInterface } from './base.service.interface';
import { Request } from 'express';

export class BaseService<EntityType extends BaseEntity>
  implements BaseServiceInterface<EntityType>
{
  addOptionsInMany(_options: FindManyOptions<EntityType>, _query: Query): void {
    throw new Error('Method not implemented.');
  }
  protected repository: Repository<EntityType>;

  protected select: {
    [K in FindType]?: FindOptionsSelect<EntityType>;
  };

  protected relations: {
    [K in FindType]?: FindOptionsRelations<EntityType>;
  };

  protected where: {
    [K in FindType]?: FindOptionsWhere<EntityType>;
  };

  setSelect(select: {
    [K in FindType]?: FindOptionsSelect<EntityType>;
  }) {
    this.select = select;
  }

  setWhere(where: {
    [K in FindType]?: FindOptionsWhere<EntityType>;
  }) {
    this.where = where;
  }

  setRelations(relations: {
    [K in FindType]?: FindOptionsRelations<EntityType>;
  }) {
    this.relations = relations;
  }

  addRelation(options: FindManyOptions<EntityType>, type: FindType) {
    if (this.relations) {
      if (this.relations[type]) {
        options.relations = this.relations[type];
      } else if (this.relations.both) {
        options.relations = this.relations.both;
      }
    }
  }

  addSelect(options: FindManyOptions<EntityType>, type: FindType) {
    if (this.select) {
      if (this.select[type]) {
        options.select = this.select[type];
      } else if (this.select.both) {
        options.select = this.select.both;
      }
    }
  }

  addWhere(options: FindManyOptions<EntityType>, type: FindType) {
    if (this.where) {
      if (this.where[type]) {
        options.where = this.where[type];
      } else if (this.where.both) {
        options.where = this.where.both;
      }
    }
  }

  findManyOptions(req?: Query) {
    const options: FindManyOptions<EntityType> = {};

    const orderBy = req?.orderBy || 'createdAt';
    const orderType = req?.orderType || 'desc';
    let pageNumber = parseInt(req?.pageNumber || '1');
    pageNumber = pageNumber > 0 ? pageNumber : 1;
    const pageSize = parseInt(req?.pageSize || '10');
    const offset = pageSize * (pageNumber - 1);

    options.order = {};
    options.relations = {};
    options.order[orderBy] = orderType;
    options.take = pageSize;
    options.skip = offset;

    this.addWhere(options, 'many');
    this.addSelect(options, 'many');
    this.addRelation(options, 'many');

    return options;
  }

  findOneOptions(_query?: Query) {
    const options: FindOneOptions<EntityType> = {};

    this.addWhere(options, 'one');
    this.addSelect(options, 'one');
    this.addRelation(options, 'one');

    return options;
  }

  async findAll(
    req?: Request,
    overrideOptions: FindManyOptions<EntityType> = null,
  ) {
    let options = this.findManyOptions(req?.query);
    if (overrideOptions) {
      options = merge(options, overrideOptions);
    }
    const [data, total] = await this.repository.findAndCount(options);
    return { data, total };
  }

  async create(data: DeepPartial<EntityType>) {
    const item = await this.repository.save(this.repository.create(data));
    return this.findOne(item.id);
  }

  findOne(id: number, overrideOptions: FindOneOptions<EntityType> = null) {
    let options = this.findOneOptions();
    if (!options.where) {
      options.where = {};
    }
    options.where['id'] = id;

    if (overrideOptions) {
      options = merge(options, overrideOptions);
    }

    return this.repository.findOneOrFail(options);
  }

  async update(
    id: number,
    data: DeepPartial<EntityType>,
    overrideOptions: FindOneOptions<EntityType> = null,
  ) {
    const item = await this.findOne(id, overrideOptions);
    await this.repository.save(Object.assign(item, data));
    return this.findOne(id);
  }

  async remove(id: number, overrideOptions: FindOneOptions<EntityType> = null) {
    const item = await this.findOne(id, overrideOptions);
    await this.repository.remove(item);
    return item;
  }

  getRespository() {
    return this.repository;
  }
}
