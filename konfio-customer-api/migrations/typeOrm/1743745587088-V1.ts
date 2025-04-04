import { MigrationInterface, QueryRunner } from "typeorm";

export class V11743745587088 implements MigrationInterface {
    name = 'V11743745587088'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`parties\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`role\` enum ('ADMIN', 'EMPLOYEE', 'READ_ONLY') NOT NULL DEFAULT 'READ_ONLY', \`customerId\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`contact_info\` (\`id\` varchar(36) NOT NULL, \`email\` varchar(255) NOT NULL, \`phone\` varchar(255) NULL, \`address\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`customers\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`taxId\` varchar(255) NOT NULL, \`type\` enum ('ENTERPRISE', 'INDIVIDUAL') NOT NULL DEFAULT 'INDIVIDUAL', \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`contactInfoId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`parties\` ADD CONSTRAINT \`FK_4802403ec96bcde9f00e7bbd7e0\` FOREIGN KEY (\`customerId\`) REFERENCES \`customers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`customers\` ADD CONSTRAINT \`FK_88304b7ca2a06c32bf3802db626\` FOREIGN KEY (\`contactInfoId\`) REFERENCES \`contact_info\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`customers\` DROP FOREIGN KEY \`FK_88304b7ca2a06c32bf3802db626\``);
        await queryRunner.query(`ALTER TABLE \`parties\` DROP FOREIGN KEY \`FK_4802403ec96bcde9f00e7bbd7e0\``);
        await queryRunner.query(`DROP TABLE \`customers\``);
        await queryRunner.query(`DROP TABLE \`contact_info\``);
        await queryRunner.query(`DROP TABLE \`parties\``);
    }

}
