import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtUserStrategy } from '../jwt.strategy';
import * as dotenv from 'dotenv';
dotenv.config();
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from '../entities/admins.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Admin]),
  JwtModule.register({
    secret: process.env.JWT_SECRET_KEY || 'secretKey',
    signOptions: { expiresIn: '4h' },
  }),],
  controllers: [AdminController],
  providers: [AdminService, JwtUserStrategy],
})
export class AdminModule {}
