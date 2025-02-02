import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AdminController', () => {
  let controller: AdminController;
  let adminService: AdminService;

  const mockAdminService = {
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        {
          provide: AdminService,
          useValue: mockAdminService,
        },
      ],
    }).compile();

    controller = module.get<AdminController>(AdminController);
    adminService = module.get<AdminService>(AdminService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should call AdminService.login and return token', async () => {
      const mockBody = { username: 'admin', password: 'admin123' };
      const mockToken = { token: 'jwt-token' };

      // Mocking the login method to return a valid token
      mockAdminService.login.mockResolvedValue(mockToken);

      const result = await controller.login(mockBody);

      expect(result).toEqual(mockToken); // Check that the token returned matches the mock
      expect(mockAdminService.login).toHaveBeenCalledWith('admin', 'admin123'); // Verify the service method is called with correct arguments
    });

    it('should throw UnauthorizedException if AdminService.login fails', async () => {
      const mockBody = { username: 'admin', password: 'wrongpassword' };

      // Mocking the login method to throw UnauthorizedException
      mockAdminService.login.mockRejectedValue(new UnauthorizedException('Invalid credentials'));

      await expect(controller.login(mockBody)).rejects.toThrowError(UnauthorizedException);
    });
  });
});