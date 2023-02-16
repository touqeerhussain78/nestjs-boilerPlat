import {
  DeepPartial,
  FindManyOptions,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOneOptions,
  FindOptionsWhere,
} from 'typeorm';
import { FindType, Query } from '@/utility/types';
import { Request } from 'express';

export interface BaseServiceInterface<EntityType> {
  setSelect(select: {
    [K in FindType]?: FindOptionsSelect<EntityType>;
  }): void;

  setWhere(where: {
    [K in FindType]?: FindOptionsWhere<EntityType>;
  }): void;

  setRelations(relations: {
    [K in FindType]?: FindOptionsRelations<EntityType>;
  }): void;

  addRelation(options: FindManyOptions<EntityType>, type: FindType): void;

  addSelect(options: FindManyOptions<EntityType>, type: FindType): void;

  addWhere(options: FindManyOptions<EntityType>, type: FindType): void;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  addOptionsInMany(_options: FindManyOptions<EntityType>, _query: Query): void;

  findManyOptions(query: Query): FindManyOptions<EntityType>;

  findOneOptions(_query?: Query): FindOneOptions<EntityType>;

  findAll(
    req?: Request,
    overrideOptions?: FindManyOptions<EntityType>,
  ): Promise<{ data: EntityType[]; total: number }>;

  create(data: DeepPartial<EntityType>): Promise<EntityType>;

  findOne(
    id: number,
    overrideOptions?: FindOneOptions<EntityType>,
  ): Promise<EntityType>;

  update(
    id: number,
    data: DeepPartial<EntityType>,
    overrideOptions: FindOneOptions<EntityType>,
  ): Promise<EntityType>;

  remove(
    id: number,
    overrideOptions: FindOneOptions<EntityType>,
  ): Promise<EntityType>;
}
