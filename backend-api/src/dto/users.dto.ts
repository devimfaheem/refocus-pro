import { ApiProperty } from '@nestjs/swagger';
import { UserStatus } from '../entities/users.entity';

export class CreateUserDto {
  @ApiProperty()
  first_name: string;

  @ApiProperty()
  last_name: string;

  @ApiProperty()
  email: string;
}

export class UpdateUserDto {
  @ApiProperty()
  first_name: string;

  @ApiProperty()
  last_name: string;

  @ApiProperty()
  email: string;
}

export class ResponseUserDto {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  status: UserStatus;
}
