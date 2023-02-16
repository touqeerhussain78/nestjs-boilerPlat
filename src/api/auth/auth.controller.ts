import {
  Controller,
  Post,
  Body,
  HttpStatus,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { GuestGuard } from '@/api/user/guards/guest.guard';
import { EmailVerificationService } from './email-verification.service';
import { EmailVerificationDto } from './dto/email-verification.dto';
import { Roles } from '../user/enums/role.enum';
import { RolesService } from '../roles/roles.service';

@ApiTags('auth')
@Controller('auth')
@UseGuards(GuestGuard)
export class AuthController {
  constructor(
    private authService: AuthService,
    private emailVerificationService: EmailVerificationService,
    protected roleService: RolesService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'User Login' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User login',
  })
  async login(@Body() loginDto: LoginDto) {
    const validatedUser = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    return this.authService.loginData(validatedUser);
  }

  @Post('admin/login')
  @ApiOperation({ summary: 'Admin Login' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Admin login',
  })
  async adminLogin(@Body() loginDto: LoginDto) {
    const validatedUser = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    return this.authService.loginData(validatedUser);
  }

  @Post('register')
  async register(@Body() body: RegisterDto) {
    const data = {
      ...body,
      profileImage: body.profileImage ? { id: body.profileImage } : null,
    };
    const roleInput = await this.roleService.findBySlug(data.role);
    return this.authService.register({ ...data, roles: [roleInput] });
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Forgot password' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User forgot password',
  })
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    await this.authService.forgotPassword(forgotPasswordDto);

    return {};
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'reset password' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User reset password',
  })
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.authService.resetPassword(resetPasswordDto);

    return {};
  }

  @Post('email-verification')
  @ApiOperation({ summary: 'User email verification' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User email verification',
  })
  @HttpCode(HttpStatus.OK)
  async emailVerification(@Body() emailVerificationDto: EmailVerificationDto) {
    await this.emailVerificationService.verify(emailVerificationDto);

    return {};
  }
}
