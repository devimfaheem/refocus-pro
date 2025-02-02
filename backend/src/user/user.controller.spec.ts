import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { User, UserStatus } from '../entities/users.entity';
import { ResponseUserDto, CreateUserDto, UpdateUserDto } from '../dto/users.dto';
import { NotFoundException } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUserService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockUser = {
    id: '1',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    status: UserStatus.ACTIVE,
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true }) // Mocking JwtAuthGuard to allow all requests
      .compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUsers', () => {
    it('should return paginated list of users', async () => {
      const users = [mockUser];
      mockUserService.findAll.mockResolvedValue({
        data: users,
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });

      const result = await controller.getUsers(1, 10);
      expect(result).toEqual({
        data: users,
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
      expect(mockUserService.findAll).toHaveBeenCalledWith(1, 10, undefined);
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      mockUserService.findOne.mockResolvedValue(mockUser);

      const result = await controller.findOne('1');
      expect(result).toEqual(mockUser);
      expect(mockUserService.findOne).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserService.findOne.mockRejectedValue(new NotFoundException('User not found'));

      await expect(controller.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {

      mockUserService.create.mockResolvedValue(mockUser);

      const result = await controller.create(mockUser);
      expect(result).toEqual(mockUser);
      expect(mockUserService.create).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('update', () => {
    it('should update the user', async () => {
      const updatedUser = { ...mockUser, first_name: 'Updated' };

      mockUserService.update.mockResolvedValue(mockUser);

      const result = await controller.update('1', updatedUser);
      expect(result).toEqual(mockUser);
      expect(mockUserService.update).toHaveBeenCalledWith(updatedUser, '1');
    });

    it('should throw NotFoundException if user not found during update', async () => {
      const updatedUser = { ...mockUser, first_name: 'Updated' };
      mockUserService.update.mockRejectedValue(new NotFoundException('User not found'));

      await expect(controller.update('999', updatedUser)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should deactivate a user and return the updated user', async () => {
      mockUserService.remove.mockResolvedValue(mockUser);

      const result = await controller.remove('1');
      expect(result).toEqual(mockUser);
      expect(mockUserService.remove).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if user not found during remove', async () => {
      mockUserService.remove.mockRejectedValue(new NotFoundException('User not found'));

      await expect(controller.remove('999')).rejects.toThrow(NotFoundException);
    });
  });
});