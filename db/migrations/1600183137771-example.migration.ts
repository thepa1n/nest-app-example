import { MigrationInterface, QueryRunner } from 'typeorm';

export class ExampleMigration1600183137771 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('Migration Up!');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    console.log('Migration Down!');
  }
}
