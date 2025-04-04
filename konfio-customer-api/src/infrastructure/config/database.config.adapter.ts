import { Injectable } from '@nestjs/common';
import { DatabaseConfigPort } from '../../application/ports/database.config.port';

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

  getMigrationsTableName(): string {
    return process.env.DB_MIGRATIONS_TABLE_NAME || 'db_migrations';
  }

  getMigrations(path: string): string[] {
    return process.env.DB_MIGRATIONS?.split(',') || [`migrations/${path}/*.ts`];
  }

  shouldSynchronize(): boolean {
    return process.env.DB_MIGRATE === 'true';
  }

  shouldLog(): boolean {
    return process.env.DB_LOG === 'true';
  }
}
