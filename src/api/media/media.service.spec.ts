import { Test, TestingModule } from '@nestjs/testing';
import { MediaService } from './media.service';
import { Media } from './entities/media.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('MediaService', () => {
  let service: MediaService;
  let repo: Repository<Media>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MediaService,
        {
          provide: getRepositoryToken(Media),
          useValue: {
            create: vi.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MediaService>(MediaService);
    repo = module.get<Repository<Media>>(getRepositoryToken(Media));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repo).toBeDefined();
  });
});
