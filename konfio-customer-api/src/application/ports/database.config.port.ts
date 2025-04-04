export interface DatabaseConfigPort {
  getHost(): string;
  getPort(): number;
  getUsername(): string;
  getPassword(): string;
  getDatabase(): string;
  getEntities(): any[];
  getMigrations(): string[];
  getMigrationsTableName(): string;
  shouldSynchronize(): boolean;
  shouldLog(): boolean;
}
