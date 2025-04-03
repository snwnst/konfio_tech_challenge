import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CustomerEntity } from './entities/customer.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_DATABASE || 'konfio_customer',
  entities: [CustomerEntity],
  migrations: ['src/infrastructure/persistence/typeorm/migrations/*.ts'],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV !== 'production',
};
