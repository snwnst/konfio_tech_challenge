import { MigrationInterface, QueryRunner } from "typeorm";

export class V11743733487514 implements MigrationInterface {
    name = 'V11743733487514'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`parties\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`role\` enum ('ADMIN', 'EMPLOYEE', 'READ_ONLY') NOT NULL DEFAULT 'READ_ONLY', \`customerId\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`contact_info\` (\`id\` varchar(36) NOT NULL, \`email\` varchar(255) NOT NULL, \`phone\` varchar(255) NULL, \`address\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`customers\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`taxId\` varchar(255) NOT NULL, \`type\` enum ('ENTERPRISE', 'INDIVIDUAL') NOT NULL DEFAULT 'INDIVIDUAL', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`parties\` ADD CONSTRAINT \`FK_4802403ec96bcde9f00e7bbd7e0\` FOREIGN KEY (\`customerId\`) REFERENCES \`customers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`parties\` DROP FOREIGN KEY \`FK_4802403ec96bcde9f00e7bbd7e0\``);
        await queryRunner.query(`DROP TABLE \`customers\``);
        await queryRunner.query(`DROP TABLE \`contact_info\``);
        await queryRunner.query(`DROP TABLE \`parties\``);
    }

}
