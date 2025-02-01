import { Controller, Post, Body } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiTags, ApiBody, ApiProperty } from '@nestjs/swagger';

export class loginDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;
}

@Controller('admin')
@ApiTags('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('login')
  @ApiBody({ description: 'Create a new user', type: loginDto })
  async login(@Body() body: { username: string; password: string }) {
    return this.adminService.login(body.username, body.password);
  }
}
