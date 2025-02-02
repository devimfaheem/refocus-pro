import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User, UserStatus } from '../entities/users.entity';
import { Repository } from 'typeorm';
import { NotFoundException, ConflictException } from '@nestjs/common';

const mockUserRepository = () => ({
  createQueryBuilder: jest.fn().mockReturnValue({
    andWhere: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn().mockResolvedValue([[{ id: '1', email: 'test@test.com' }], 1]),
  }),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
});

describe('UserService', () => {
  let service: UserService;
  let userRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useFactory: mockUserRepository },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('findAll', () => {
    it('should return paginated users', async () => {
      const result = await service.findAll(1, 10);
      expect(result).toEqual({
        data: [{ id: '1', email: 'test@test.com' }],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      userRepository.findOne.mockResolvedValue({ id: '1', email: 'test@test.com' });
      const result = await service.findOne('1');
      expect(result).toEqual({ id: '1', first_name: undefined, last_name: undefined, email: 'test@test.com', status: undefined });
    });

    it('should throw NotFoundException if user not found', async () => {
      userRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      userRepository.findOne.mockResolvedValue(null);
      userRepository.create.mockReturnValue({ id: '1', email: 'test@test.com' });
      userRepository.save.mockResolvedValue({ id: '1', email: 'test@test.com' });

      const result = await service.create({ email: 'test@test.com' } as User);
      expect(result).toEqual({ id: '1', email: 'test@test.com' });
    });

    it('should throw ConflictException if email already exists', async () => {
      userRepository.findOne.mockResolvedValue({ id: '1', email: 'test@test.com' });
      await expect(service.create({ email: 'test@test.com' } as User)).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      userRepository.findOne.mockResolvedValueOnce({ id: '1', email: 'test@test.com' });
      userRepository.findOne.mockResolvedValueOnce(null);
      userRepository.update.mockResolvedValue({});

      const updatedUser = { id: '1', email: 'updated@test.com', first_name: 'Updated', last_name: 'User', status: UserStatus.ACTIVE };
      userRepository.findOne.mockResolvedValueOnce(updatedUser);

      const result = await service.update({ email: 'updated@test.com', first_name: 'Updated', last_name: 'User' } as User, '1');
      expect(result).toEqual(updatedUser);
    });

    it('should throw ConflictException if email already exists', async () => {
      userRepository.findOne.mockResolvedValueOnce({ id: '1', email: 'test@test.com' });
      userRepository.findOne.mockResolvedValueOnce({ id: '2', email: 'test@test.com' });
      await expect(service.update({ email: 'test@test.com' } as User, '1')).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('should deactivate a user', async () => {
      userRepository.findOne.mockResolvedValue({ id: '1', email: 'test@test.com', status: UserStatus.ACTIVE });
      userRepository.update.mockResolvedValue({});

      const result = await service.remove('1');
      expect(result).toEqual({ id: '1', first_name: undefined, last_name: undefined, email: 'test@test.com', status: UserStatus.DEACTIVATED });
    });
  });
});