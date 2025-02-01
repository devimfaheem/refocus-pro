import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
  Delete
} from '@nestjs/common';
import { UserService } from './user.service';
import { User, UserStatus } from '../entities/users.entity';
import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto, ResponseUserDto } from '../dto/users.dto';
import { JwtAuthGuard } from '../jwt-auth.guard'; 

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBody({ description: 'Get all user' })
  @ApiResponse({
    status: 200,
  })
  async getUsers(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
    @Query('status') status?: UserStatus,
  ) {
    return this.userService.findAll(page, limit, status);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBody({ description: 'Get a user' })
  @ApiResponse({
    status: 200,
  })
  async findOne(@Param('id') id: string): Promise<ResponseUserDto> {
    return this.userService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBody({ description: 'Create a new user', type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'The new user has been successfully created.',
  })
  async create(@Body() user: User): Promise<User> {
    return this.userService.create(user);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBody({ description: 'Update a user', type: CreateUserDto })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
  })
  async update(
    @Param('id') id: string,
    @Body() user: User,
  ): Promise<ResponseUserDto> {
    return this.userService.update(user, id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully deleted.',
  })
  async remove(@Param('id') id: string): Promise<ResponseUserDto> {
    return this.userService.remove(id);
  }
}
