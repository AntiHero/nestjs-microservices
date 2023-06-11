import { MigrationInterface, QueryRunner } from "typeorm";

export class PasswordWithoutHash1686504953966 implements MigrationInterface {
    name = 'PasswordWithoutHash1686504953966'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admins" RENAME COLUMN "passwordHash" TO "password"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admins" RENAME COLUMN "password" TO "passwordHash"`);
    }

}
