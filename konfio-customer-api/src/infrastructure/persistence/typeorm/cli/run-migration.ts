import { exec } from 'child_process';
import { readdirSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

// eslint-disable-next-line no-control-regex
const removeAnsi = (str: string) => str.replace(/\x1b\[[0-9;]*m/g, '');
const isSqlLine = (line: string) => line.trim().startsWith('query:');
const removeDbName = (line: string) =>
  line.replace(/`[a-zA-Z0-9_]+`\.`([a-zA-Z0-9_]+)`/g, '`$1`'); // Remueve `db`.`table`

const sqlDir = 'migrations/sql';
mkdirSync(sqlDir, { recursive: true });

const existingVersions = readdirSync(sqlDir)
  .map((file) => {
    const match = file.match(/^V(\d+).*\.sql$/);
    return match ? parseInt(match[1], 10) : null;
  })
  .filter((v): v is number => v !== null);

const nextVersion =
  (existingVersions.length ? Math.max(...existingVersions) : 0) + 1;

const filename = `V${nextVersion}.sql`;
const outputPath = join(sqlDir, filename);

const command = `npx typeorm-ts-node-commonjs migration:run -d src/infrastructure/persistence/typeorm/cli/typeorm-cli.config.ts`;

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Migration error:\n', stderr);
    process.exit(1);
  }

  const sqlLines = removeAnsi(stdout)
    .split('\n')
    .filter((line) => isSqlLine(line))
    .map((line) => line.replace(/^query:\s*/, '').trim())
    .map(removeDbName);

  const finalSql = sqlLines.join(';\n') + ';';

  writeFileSync(outputPath, finalSql);
  console.log(`✅ Clean SQL saved to: ${outputPath}`);
});
