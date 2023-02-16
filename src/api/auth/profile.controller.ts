import { Controller, Get, Put, Body, UseGuards, Post } from '@nestjs/common';
import { ApiOperation, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProfileDto } from './dto/profile.dto';
import { PasswordDto } from './dto/password.dto';
import { UserService } from '@/api/user/user.service';
import { JwtAuthGuard } from '@/api/user/guards/jwt-auth.guard';
import { CurrentUser } from '@/decorator/current-user.decorator';
import { User } from '@/api/user/entities/user.entity';
import { AuthService } from './auth.service';

@ApiTags('me')
@Controller('me')
@ApiBearerAuth('user')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get current authenticated user.' })
  getUser(@CurrentUser() user: User) {
    return this.userService.findOne(user.id, {
      relations: { userSocialAuth: true },
    });
  }

  @Put()
  @ApiOperation({ summary: 'Update current authenticated user.' })
  async updateUser(@Body() data: ProfileDto, @CurrentUser() user: User) {
    const userId = user.id;
    await this.userService.update(userId, {
      ...data,
      profileImage: data.profileImage ? { id: data.profileImage } : null,
    });
    await this.userService.findOne(userId);

    return this.userService.findOne(userId, {
      relations: { profileImage: true },
    });
  }

  @Put('password')
  @ApiOperation({ summary: "Update current authenticated user's password." })
  async updatePassword(@Body() data: PasswordDto, @CurrentUser() user) {
    const userId = user.id;
    await this.userService.updatePassword(
      userId,
      data.oldPassword,
      data.newPassword,
    );
    return this.userService.findOne(userId);
  }

  @Post('logout')
  @ApiBearerAuth('user')
  @UseGuards(JwtAuthGuard)
  logout(@CurrentUser() user: User) {
    return this.authService.logout(user);
  }
}
