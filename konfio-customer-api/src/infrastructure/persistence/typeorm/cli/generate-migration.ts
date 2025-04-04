import { execSync } from 'child_process';
import { readdirSync, mkdirSync } from 'fs';
import { join } from 'path';

const migrationDir = 'migrations/typeorm';

mkdirSync(migrationDir, { recursive: true });

const existingVersions = readdirSync(migrationDir)
  .map((file) => {
    const match = file.match(/^V(\d+).*\.ts$/);
    return match ? parseInt(match[1], 10) : null;
  })
  .filter((v): v is number => v !== null);

const nextVersion =
  (existingVersions.length ? Math.max(...existingVersions) : 0) + 1;

const filename = `V${nextVersion}`;
const filepath = join(migrationDir, filename);

console.log(`🚧 Generating migration: ${filename}.ts`);
execSync(
  `npx typeorm-ts-node-commonjs migration:generate -d src/infrastructure/persistence/typeorm/cli/typeorm-cli.config.ts ${filepath}`,
  { stdio: 'inherit' },
);
