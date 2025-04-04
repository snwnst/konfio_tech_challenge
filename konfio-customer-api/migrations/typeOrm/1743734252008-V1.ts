import { MigrationInterface, QueryRunner } from "typeorm";

export class V11743734252008 implements MigrationInterface {
    name = 'V11743734252008'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`customers\` ADD \`contactInfoId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`customers\` ADD CONSTRAINT \`FK_88304b7ca2a06c32bf3802db626\` FOREIGN KEY (\`contactInfoId\`) REFERENCES \`contact_info\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`customers\` DROP FOREIGN KEY \`FK_88304b7ca2a06c32bf3802db626\``);
        await queryRunner.query(`ALTER TABLE \`customers\` DROP COLUMN \`contactInfoId\``);
    }

}
