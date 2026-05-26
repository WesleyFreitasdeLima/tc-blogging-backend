import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1779748545908 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,

        name VARCHAR(255) NOT NULL,

        username VARCHAR(255) NOT NULL,

        password VARCHAR(255) NOT NULL,

        email VARCHAR(255) NOT NULL,

        created_at TIMESTAMP WITHOUT TIME ZONE
          NOT NULL
          DEFAULT CURRENT_TIMESTAMP,

        is_active BOOLEAN NOT NULL DEFAULT TRUE
      );

      CREATE TABLE post (
        id SERIAL PRIMARY KEY,

        title VARCHAR(255) NOT NULL,

        content TEXT NOT NULL,

        created_at TIMESTAMP WITHOUT TIME ZONE
          NOT NULL
          DEFAULT CURRENT_TIMESTAMP,

        created_by INTEGER NOT NULL,

        updated_at TIMESTAMP WITHOUT TIME ZONE,

        updated_by INTEGER,

        is_active BOOLEAN NOT NULL DEFAULT TRUE,

        CONSTRAINT fk_post_created_by
          FOREIGN KEY (created_by)
          REFERENCES users(id)
          ON DELETE RESTRICT,

        CONSTRAINT fk_post_updated_by
          FOREIGN KEY (updated_by)
          REFERENCES users(id)
          ON DELETE SET NULL

      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE post;
      DROP TABLE users;
    `);
  }
}
