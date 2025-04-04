import { DataSource } from 'typeorm';
import { CustomerEntity } from '../entities/customer.entity';
import { DatabaseConfigAdapter } from '../../../config/database.config.adapter';

const configAdapter = new DatabaseConfigAdapter();

export const dataSourceConfig = new DataSource({
  type: 'mysql',
  host: configAdapter.getHost(),
  port: configAdapter.getPort(),
  username: configAdapter.getUsername(),
  password: configAdapter.getPassword(),
  database: configAdapter.getDatabase(),
  entities: [CustomerEntity],
  migrations: configAdapter.getMigrations('typeOrm'),
  synchronize: false,
});
