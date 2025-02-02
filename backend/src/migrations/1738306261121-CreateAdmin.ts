import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';

export class CreateAdminAndUserTables1738306261121 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create `user` table
    await queryRunner.query(`
      CREATE TABLE \`user\` (
        \`id\` varchar(36) NOT NULL,
        \`first_name\` varchar(255) NOT NULL,
        \`last_name\` varchar(255) NOT NULL,
        \`email\` varchar(255) NOT NULL,
        \`status\` enum('active', 'inactive', 'deactivated') NOT NULL DEFAULT 'active',
        \`created_at\` DATE NOT NULL,
        \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        UNIQUE INDEX \`IDX_user_email\` (\`email\`)
      ) ENGINE=InnoDB
    `);    

    // Create `admins` table
    await queryRunner.query(`
      CREATE TABLE \`admins\` (
        \`id\` varchar(36) NOT NULL,
        \`username\` varchar(255) NOT NULL,
        \`password\` varchar(255) NOT NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE INDEX \`IDX_admins_username\` (\`username\`)
      ) ENGINE=InnoDB
    `);

    const hashedPassword = await bcrypt.hash('admin', 10);
    await queryRunner.query(`
      INSERT INTO admins (id, username, password)
      VALUES (uuid(), 'admin', '${hashedPassword}')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop `user` and `admins` tables in reverse order
    await queryRunner.query(`DROP TABLE \`admins\``);
    await queryRunner.query(`DROP TABLE \`user\``);
  }
}
