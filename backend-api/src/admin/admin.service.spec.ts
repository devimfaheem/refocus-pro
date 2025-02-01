import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Admin } from '../entities/admins.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

describe('AdminService', () => {
  let service: AdminService;
  let adminRepository: Repository<Admin>;
  let jwtService: JwtService;

  const mockAdminRepository = {
    findOne: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockAdmin = {
    id: '1',
    username: 'admin',
    password: '$2b$10$y1z44EjfnKK2pZm6pqW1jOtAlX.SS4AKsA6X3A9s/UdlYk04eHndy', // bcrypt hash of 'admin123'
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: getRepositoryToken(Admin),
          useValue: mockAdminRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
    adminRepository = module.get<Repository<Admin>>(getRepositoryToken(Admin));
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should throw UnauthorizedException if admin not found', async () => {
      mockAdminRepository.findOne.mockResolvedValue(null);

      await expect(service.login('admin', 'admin123')).rejects.toThrowError(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      mockAdminRepository.findOne.mockResolvedValue(mockAdmin);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(service.login('admin', 'wrongPassword')).rejects.toThrowError(
        UnauthorizedException,
      );
    });

    it('should return a token if login is successful', async () => {
      mockAdminRepository.findOne.mockResolvedValue(mockAdmin);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue('jwt-token');

      const result = await service.login('admin', 'admin123');

      expect(result).toEqual({ token: 'jwt-token' });
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        username: mockAdmin.username,
        sub: mockAdmin.id,
      });
    });
  });
});