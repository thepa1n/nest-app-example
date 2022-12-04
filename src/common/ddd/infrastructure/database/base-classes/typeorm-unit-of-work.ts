import { EntityTarget, getConnection, QueryRunner, Repository } from 'typeorm';

import { UnitOfWorkPort } from '@common/ddd/domain/ports/unit-of-work.port';
import { IsolationLevel } from 'typeorm/driver/types/IsolationLevel';
import { LoggerPort } from '@common/ddd/domain/ports/logger.port';

export class TypeormUnitOfWork implements UnitOfWorkPort {
  constructor(private readonly logger: LoggerPort) {}

  private queryRunners: Map<string, QueryRunner> = new Map();

  private async _rollbackTransaction(
    correlationId: string,
    error: Error,
  ): Promise<void> {
    const queryRunner = this.getQueryRunner(correlationId);
    try {
      await queryRunner.rollbackTransaction();
      this.logger.debug(
        `[Transaction rolled back] ${(error as Error).message}`,
      );
    } finally {
      await this._finish(correlationId);
    }
  }

  private async _finish(correlationId: string): Promise<void> {
    const queryRunner = this.getQueryRunner(correlationId);
    try {
      await queryRunner.release();
    } finally {
      this.queryRunners.delete(correlationId);
    }
  }

  public getQueryRunner(correlationId: string): QueryRunner {
    const queryRunner = this.queryRunners.get(correlationId);
    if (!queryRunner) {
      throw new Error(
        'Query runner not found. Incorrect correlationId or transaction' +
          'is not started. To start a transaction wrap' +
          'operations in a "execute" method.',
      );
    }
    return queryRunner;
  }

  public getOrmRepository<OrmEntity>(
    entity: EntityTarget<OrmEntity>,
    correlationId: string,
  ): Repository<OrmEntity> {
    const queryRunner = this.getQueryRunner(correlationId);
    return queryRunner.manager.getRepository(entity);
  }

  /**
   * Execute a UnitOfWork.
   * Database operations wrapped in a `execute` method will run
   * in a single transactional operation, so everything gets
   * saved (including changes done by Domain Events) or nothing at all.
   */
  async execute<T>(
    correlationId: string,
    callback: () => Promise<T>,
    options?: { isolationLevel: IsolationLevel },
  ): Promise<T> {
    if (!correlationId) {
      throw new Error('Correlation ID must be provided');
    }
    const queryRunner = getConnection().createQueryRunner();
    this.queryRunners.set(correlationId, queryRunner);
    this.logger.debug(`[Starting transaction]`);
    await queryRunner.startTransaction(options?.isolationLevel);

    let result: T;
    try {
      result = await callback();
    } catch (error) {
      await this._rollbackTransaction(correlationId, error as Error);
      throw error;
    }

    try {
      await queryRunner.commitTransaction();
    } finally {
      await this._finish(correlationId);
    }

    this.logger.debug(`[Transaction committed]`);

    return result;
  }
}
