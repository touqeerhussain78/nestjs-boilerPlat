import { compare } from 'bcrypt';
import { DeepPartial, FindManyOptions, Repository } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { BaseService } from '@/base/base.service';
import { ForgotPasswordService } from '@/api/auth/forgot-password.service';
import { Roles } from './enums/role.enum';
import { Query as BaseQuery } from '@/utility/types';
interface Query extends BaseQuery {
  role?: Roles;
}
@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    protected repository: Repository<User>,
    protected forgotPasswordService: ForgotPasswordService,
  ) {
    super();
    this.setRelations({
      both: { profileImage: true },
    });
  }

  addOptionsInMany(options: FindManyOptions<User>, query: Query) {
    if (!options.where) {
      options.where = {};
    }
    if (query.role) {
      options.where['role'] = query.role;
    }
  }

  findOneWithPassword(id: number) {
    return this.repository.findOneOrFail({
      where: { id },
      select: ['id', 'email', 'password'],
    });
  }

  findOneUser(email: string) {
    return this.repository.findOne({
      where: { email: email },
      relations: { roles: true },
    });
  }

  findOneByEmail(email: string): Promise<User | undefined> {
    return this.repository.findOne({
      where: { email: email },
      relations: { profileImage: true, roles: true },
    });
  }

  findOneByEmailAndRole(
    email: string,
    role: Array<string>,
  ): Promise<User | undefined> {
    return this.repository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email: email })
      .andWhere('user.password IS NOT NULL')
      .getOne();
  }

  async resetPassword(email: string, password: string) {
    const passwordDto = this.repository.create({
      password: password,
      passwordResetAt: new Date(),
    });

    const update = await this.repository.update(
      {
        email: email,
      },
      passwordDto,
    );

    if (update.affected) {
      await this.forgotPasswordService.remove(email);
    }

    return update;
  }

  async updatePassword(id: number, oldPassword: string, newPassword: string) {
    const user = await this.findOneWithPassword(id);
    const validateUser = await compare(oldPassword, user.password);
    if (!validateUser) {
      throw new HttpException(
        'The old password is not valid',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (oldPassword == newPassword) {
      throw new HttpException(
        'The new password must be different from old password',
        HttpStatus.BAD_REQUEST,
      );
    }
    this.update(id, {
      password: newPassword,
      passwordResetAt: new Date(),
    });
    return this.findOne(id);
  }

  verifyEmail(id: number) {
    return this.update(id, {
      emailVerifiedAt: new Date(),
    });
  }

  create(data: DeepPartial<User>) {
    if (!data.passwordResetAt && data.passwordResetAt !== null) {
      data.passwordResetAt = new Date();
    }
    return super.create(data);
  }
}
