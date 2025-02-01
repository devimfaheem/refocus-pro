import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User, UserStatus } from '../entities/users.entity';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResponseUserDto } from '../dto/users.dto';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;

  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    skip: jest.fn().mockReturnThis(),
    createQueryBuilder: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
    take: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
  };

  const mockUser = {
    id: 'uuid',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    status: UserStatus.ACTIVE,
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a paginated list of users', async () => {
      mockUserRepository.getManyAndCount.mockResolvedValue([ [mockUser], 1 ]);

      const result = await service.findAll(1, 10);
      expect(result).toEqual({
        data: [mockUser],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });

    it('should filter users by status', async () => {
      mockUserRepository.getManyAndCount.mockResolvedValue([ [mockUser], 1 ]);

      const result = await service.findAll(1, 10, UserStatus.ACTIVE);
      expect(mockUserRepository.createQueryBuilder).toHaveBeenCalled();
      expect(result.data).toEqual([mockUser]);
    });

    it('should handle pagination and return 1 page when there are no users', async () => {
      mockUserRepository.getManyAndCount.mockResolvedValue([ [], 0 ]);

      const result = await service.findAll(1, 10);
      expect(result).toEqual({
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findOne('uuid');
      expect(result).toEqual({
        id: 'uuid',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        status: UserStatus.ACTIVE,
      });
    });

    it('should throw NotFoundException if user does not exist', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('non-existent-uuid')).rejects.toThrowError(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return a new user', async () => {
      const user: User = {
        ...mockUser,
        id: 'new-uuid',
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'jane.doe@example.com',
        status: UserStatus.ACTIVE,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockUserRepository.create.mockReturnValue(user);
      mockUserRepository.save.mockResolvedValue(user);

      const result = await service.create(user);
      expect(result).toEqual(user);
      expect(mockUserRepository.save).toHaveBeenCalledWith(user);
    });
  });

  describe('update', () => {
    it('should update and return the updated user', async () => {
      const updatedUser: User = {
        ...mockUser,
        first_name: 'Updated Name',
        last_name: 'Doe',
        email: 'updated.email@example.com',
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.update.mockResolvedValue({ affected: 1 });
      mockUserRepository.findOne.mockResolvedValue(updatedUser);

      const result = await service.update(updatedUser, 'uuid');
      expect(result.first_name).toEqual('Updated Name');
      expect(result.email).toEqual('updated.email@example.com');
    });

    it('should throw NotFoundException if user does not exist', async () => {
      const updatedUser: User = {
        ...mockUser,
        first_name: 'Updated Name',
        last_name: 'Doe',
        email: 'updated.email@example.com',
      };

      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.update(updatedUser, 'non-existent-uuid')).rejects.toThrowError(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should deactivate a user', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.remove('uuid');
      expect(result).toEqual({
        id: 'uuid',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        status: UserStatus.DEACTIVATED,
      });
    });

    it('should throw NotFoundException if user does not exist', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('non-existent-uuid')).rejects.toThrowError(NotFoundException);
    });
  });
});