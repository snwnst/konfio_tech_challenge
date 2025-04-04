export interface DatabaseConfigPort {
  getHost(): string;
  getPort(): number;
  getUsername(): string;
  getPassword(): string;
  getDatabase(): string;
  getMigrations(path: string): string[];
  getMigrationsTableName(): string;
  shouldSynchronize(): boolean;
  shouldLog(): boolean;
}
