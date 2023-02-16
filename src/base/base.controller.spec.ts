import { Test, TestingModule } from '@nestjs/testing';
import { BaseService } from './base.service';
import { BaseController } from './base.controller';
import { BaseEntity } from './entities/base.entity';

describe('BaseController', () => {
  let controller: BaseController<BaseEntity, BaseService<BaseEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BaseController],
    }).compile();

    controller =
      module.get<BaseController<BaseEntity, BaseService<BaseEntity>>>(
        BaseController,
      );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
