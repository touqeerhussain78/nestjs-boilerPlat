import { Unique } from '@/decorator/unique.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { Permission } from '../entities/permission.entity';

export class CreatePermissionDto {
  @ApiProperty()
  @Unique({
    entity: Permission,
    column: 'name',
  })
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsOptional()
  entity: string;
}
