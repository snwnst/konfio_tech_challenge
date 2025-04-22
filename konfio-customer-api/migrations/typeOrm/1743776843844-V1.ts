import { MigrationInterface, QueryRunner } from 'typeorm';

export class V11743776843844 implements MigrationInterface {
  name = 'V11743776843844';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`customers\` DROP COLUMN \`email\``);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`customers\` ADD \`email\` varchar(255) NOT NULL`,
    );
  }
}
