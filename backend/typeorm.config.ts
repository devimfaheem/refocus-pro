import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

const config: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DATABASE_HOST || 'localhost',
  port: +process.env.DATABASE_PORT || 3306,
  username: process.env.DATABASE_USER || 'admin',
  password: process.env.DATABASE_PASSWORD || 'admin',
  database: process.env.DATABASE_NAME || 'admin',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: ['src/migration/*.ts'],
  synchronize: false, // Set to false in production
  logging: true, // This will log SQL queries
};
export default config;
