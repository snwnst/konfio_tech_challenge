import { DataSource } from 'typeorm';
import { CustomerEntity } from '../entities/customer.entity';
import { PartyEntity } from '../entities/party.entity';
import { ContactInfoEntity } from '../entities/contact-info.entity';

const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_DATABASE || 'konfio_customer',
  migrationsTableName: process.env.DB_MIGRATIONS_TABLE_NAME || 'migrations',
  entities: [CustomerEntity, ContactInfoEntity, PartyEntity],
  migrations: ['migrations/typeOrm/*.ts'],
  synchronize: false,
});

export default dataSource;
