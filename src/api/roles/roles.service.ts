import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const role: Role = this.roleRepository.create();
    const { name } = createRoleDto;

    await this.roleRepository.save({
      ...createRoleDto,
      slug: name.split(' ').join('-'),
    });
    return role;
  }

  findAll() {
    return this.roleRepository.find();
  }

  findOne(id: number) {
    return this.roleRepository.findOneBy({ id: id });
  }

  findBySlug(slug: string) {
    if (slug !== undefined || slug !== null) {
      return this.roleRepository.findOneByOrFail({ slug });
    }
    return null;
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    const { name } = updateRoleDto;
    return this.roleRepository.update(id, {
      ...updateRoleDto,
      slug: name.split(' ').join('-'),
    });
  }

  async remove(id: number) {
    const role: Role = await this.findOne(id);
    return this.roleRepository.remove(role);
  }
}
