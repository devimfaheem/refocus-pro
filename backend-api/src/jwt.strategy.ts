import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './jwt-payload.interface'; // You'll define this interface
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from './entities/admins.entity';
import { Repository } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class JwtUserStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {
    super({
      secretOrKey: process.env.JWT_SECRET_KEY,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload) {
    const { sub } = payload;

    const admin = await this.adminRepository.findOne({ where: { id: sub } });
    
    if (!admin) {
      throw new Error('admin not found');
    }
    
    return admin;
  }
}