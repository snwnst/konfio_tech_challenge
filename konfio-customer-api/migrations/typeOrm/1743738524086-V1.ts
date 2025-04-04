import { MigrationInterface, QueryRunner } from "typeorm";

export class V11743738524086 implements MigrationInterface {
    name = 'V11743738524086'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`customers\` ADD \`isDeleted\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`customers\` DROP COLUMN \`isDeleted\``);
    }

}
