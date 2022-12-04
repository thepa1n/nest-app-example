import { BaseChildProcessProcedure } from './base-child-process.procedures';
import { ShellCommandsEnum } from './enums';

export class ApplicationRuntimeProcedures extends BaseChildProcessProcedure {
  public static async startDatabaseMigrationsAndSeeds(): Promise<void> {
    const appProceduresInstance = new ApplicationRuntimeProcedures();

    await appProceduresInstance.startDatabaseMigrations();
    await appProceduresInstance.startDatabaseSeeds();
  }

  public async startDatabaseMigrations(): Promise<void> {
    this.logger.info('Database Migrations Started!');

    await this.execShellCommand(ShellCommandsEnum.DATABASE_MIGRATIONS);

    this.logger.info('Database Migrations Finished!');
  }

  public async startDatabaseSeeds(): Promise<void> {
    this.logger.info('Database Seeds Started!');

    await this.execShellCommand(ShellCommandsEnum.DATABASE_SEEDS);

    this.logger.info('Database Seeds Finished!');
  }
}
