import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  Get,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BaseController } from '@/base/base.controller';
import { DeepPartial } from 'typeorm';
import { Roles } from './enums/role.enum';
import { makeToken } from '@/utility/token';
import { MailService } from '@/mail.service';
import { SetParamRequestInterceptor } from '@/interceptors/setParam.request.interceptor';

@ApiTags('user')
@Controller('user')
@ApiBearerAuth('admin')
export class UserController extends BaseController<User, UserService> {
  constructor(
    protected readonly service: UserService,
    protected mailService: MailService,
  ) {
    super();
  }

  @Get('/')
  @ApiQuery({ name: 'pageNumber', type: 'number', required: false })
  @ApiQuery({ name: 'pageSize', type: 'number', required: false })
  @ApiQuery({ name: 'role', enum: Roles, required: false })
  @ApiQuery({ name: 'orderBy', type: 'string', required: false })
  @ApiQuery({ name: 'orderType', type: 'string', required: false })
  findAll(@Req() req?: Request) {
    return super.findAll(req);
  }

  @Post()
  async create(@Body() body: CreateUserDto) {
    const password = makeToken(10);
    const data: DeepPartial<User> = {
      ...body,
      profileImage: body.profileImage ? { id: body.profileImage } : null,
      password,
      passwordResetAt: null,
      emailVerifiedAt: new Date(),
    };

    const userCreate = await this.service.create({ ...data });

    const user = { ...userCreate, password, webUrl: process.env.WEB_URL };

    await this.mailService.sendMail(
      user.email,
      'Welcome to projectname',
      'welcome',
      user,
    );

    return userCreate;
  }

  @Put(':id')
  @UseInterceptors(new SetParamRequestInterceptor())
  update(@Param('id') id: string, @Body() data: UpdateUserDto) {
    return this.service.update(+id, {
      ...data,
      profileImage: data.profileImage ? { id: data.profileImage } : null,
    });
  }
}
