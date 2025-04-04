export interface DatabaseConfigPort {
  getHost(): string;
  getPort(): number;
  getUsername(): string;
  getPassword(): string;
  getDatabase(): string;
  getEntities(): any[];
  getMigrations(): string[];
  shouldSynchronize(): boolean;
  shouldLog(): boolean;
}
