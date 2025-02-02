import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { User, UserStatus } from '../entities/users.entity';
import { ResponseUserDto } from '../dto/users.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async findAll(page: number = 1, limit: number = 10, status?: UserStatus) {
    page = page > 0 ? page : 1;
    limit = limit > 0 ? limit : 10;

    const queryBuilder = this.userRepository.createQueryBuilder('user');

    if (status) {
      queryBuilder.andWhere('user.status = :status', { status });
    }

    queryBuilder.skip((page - 1) * limit).take(limit);

    const [users, total] = await queryBuilder.getManyAndCount();

    return {
      data: users,
      total,
      page,
      limit,
      totalPages: total > 0 ? Math.ceil(total / limit) : 1,
    };
  }

  async findOne(id: string): Promise<ResponseUserDto> {
    const user = await this.userRepository.findOne({ where: { id: id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.mapper(user);
  }

  async create(user: User): Promise<User> {
    const existingUser = await this.userRepository.findOne({ where: { email: user.email } });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
    user.created_at = new Date();
    const newUser = await this.userRepository.create(user);
    return await this.userRepository.save(newUser);
  }

  async update(user: User, id: string): Promise<ResponseUserDto> {
    await this.findOne(id);
    const existingUser = await this.userRepository.findOne({ where: { email: user.email, id: Not(id), } });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
    await this.userRepository.update(id, user);
    return await this.findOne(id);
  }

  async remove(id: string): Promise<ResponseUserDto> {
    const user = await this.findOne(id);
    user.status = UserStatus.DEACTIVATED;
    await this.userRepository.update(id, { status: user.status });
    return user;
  }

  mapper(user: User): ResponseUserDto {
    return {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      status: user.status,
    };
  }
}
