import { FindConditions, ObjectLiteral, Repository } from 'typeorm';

import { ID } from '@common/ddd/domain/value-objects';
import {
  LoggerPort,
  QueryParams,
  FindManyPaginatedParams,
  RepositoryPort,
  DataWithPaginationMeta,
  FindManyParams,
} from '@common/ddd/domain/ports';

import { NotFoundException, DatabaseException } from '@common/exceptions';

export type WhereCondition<OrmEntity> =
  | FindConditions<OrmEntity>[]
  | FindConditions<OrmEntity>
  | ObjectLiteral
  | string;

export abstract class TypeormRepositoryBase<EntityProps, OrmEntity>
  implements RepositoryPort<OrmEntity, EntityProps>
{
  protected constructor(
    protected readonly repository: Repository<OrmEntity>,
    protected readonly logger: LoggerPort,
  ) {}

  /**
   * Specify relations to other tables.
   * For example: `relations = ['user', ...]`
   */
  protected abstract relations: string[];

  protected tableName = this.repository.metadata.tableName;

  protected abstract prepareQuery(
    params: QueryParams<EntityProps>,
  ): WhereCondition<OrmEntity>;

  public async save(ormEntity: OrmEntity): Promise<OrmEntity> {
    try {
      const result = await this.repository.save(ormEntity);

      this.logger.debug(`[${ormEntity.constructor.name}] persisted`);

      return result;
    } catch (error) {
      this.logger.error('When try to save one orm entity to DB!', error);
      throw new DatabaseException(error.message);
    }
  }

  public async saveMultiple(ormEntities: OrmEntity[]): Promise<OrmEntity[]> {
    try {
      const result = await this.repository.save(ormEntities);

      this.logger.debug(`[${ormEntities}]: persisted`);

      return result;
    } catch (error) {
      this.logger.error('When try to save multiple orm entity to DB!', error);
      throw new DatabaseException(error.message, error);
    }
  }

  public async findOne(
    params: QueryParams<EntityProps> | QueryParams<EntityProps>[] = {},
  ): Promise<OrmEntity | undefined> {
    const where = this.prepareQuery(params);

    const found = await this.repository.findOne({
      where,
      relations: this.relations,
    });

    return found || undefined;
  }

  public async findOneOrThrow(
    params: QueryParams<EntityProps> = {},
  ): Promise<OrmEntity> {
    const found = await this.findOne(params);

    if (!found) {
      throw new NotFoundException('Not found any entry!');
    }

    return found;
  }

  public async findOneByIdOrThrow(id: ID | string): Promise<OrmEntity> {
    const found = await this.repository.findOne({
      where: { id: id instanceof ID ? id.value : id },
    });

    if (!found) {
      throw new NotFoundException(
        `Not found any entry with ID: ${id instanceof ID ? id.value : id}!`,
      );
    }

    return found;
  }

  public async findMany({
    params,
    orderBy,
    loadRelations = true,
  }: FindManyParams<EntityProps>): Promise<OrmEntity[]> {
    return this.repository.find({
      where: this.prepareQuery(params),
      relations: loadRelations ? this.relations : [],
      order: orderBy as never,
    });
  }

  public async findManyPaginated({
    params = {},
    pagination,
    orderBy,
    loadRelations = true,
  }: FindManyPaginatedParams<EntityProps>): Promise<
    DataWithPaginationMeta<OrmEntity>
  > {
    const [data, totalCountRows] = await this.repository.findAndCount({
      skip: pagination?.skip,
      take: pagination?.limit,
      where: this.prepareQuery(params),
      order: orderBy as never,
      relations: loadRelations ? this.relations : [],
    });

    return {
      data,
      limit: parseInt(`${pagination?.limit}`, 10) || undefined,
      take: data.length,
      page: Math.round((pagination?.skip || 0) / (pagination?.limit || 0)) + 1,
      totalCount: parseInt(`${totalCountRows}`, 10),
      totalPages: Math.ceil(totalCountRows / pagination?.limit),
    };
  }

  public async delete(entity: OrmEntity): Promise<OrmEntity> {
    await this.repository.remove(entity);
    this.logger.debug(`[${entity.constructor.name}] deleted`);
    return entity;
  }

  protected correlationId?: string;

  public setCorrelationId(correlationId: string): this {
    this.correlationId = correlationId;
    this._setContext();
    return this;
  }

  private _setContext(): void {
    if (this.correlationId) {
      this.logger.log(
        'Need set context! ' + `${this.constructor.name}:${this.correlationId}`,
      );
    } else {
      this.logger.log(
        'Need set context without correlationId! ' +
          `constructor.name: ${this.constructor.name}`,
      );
    }
  }
}
