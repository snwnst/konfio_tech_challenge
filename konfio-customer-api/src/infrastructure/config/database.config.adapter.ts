import { Injectable } from '@nestjs/common';
import { DatabaseConfigPort } from '../../application/ports/database.config.port';
import { CustomerEntity } from '../persistence/typeorm/entities/customer.entity';

@Injectable()
export class DatabaseConfigAdapter implements DatabaseConfigPort {
  getHost(): string {
    return process.env.DB_HOST || 'localhost';
  }

  getPort(): number {
    return parseInt(process.env.DB_PORT || '3306');
  }

  getUsername(): string {
    return process.env.DB_USERNAME || 'root';
  }

  getPassword(): string {
    return process.env.DB_PASSWORD || '123456';
  }

  getDatabase(): string {
    return process.env.DB_DATABASE || 'konfio_customer';
  }

  getEntities(): any[] {
    return [CustomerEntity];
  }

  getMigrations(): string[] {
    return process.env.DB_MIGRATIONS?.split(',') || ['migrations/*.ts'];
  }

  shouldSynchronize(): boolean {
    return process.env.DB_MIGRATE === 'false';
  }

  shouldLog(): boolean {
    return process.env.DB_LOG === 'true';
  }
}
