import { ILike } from 'typeorm';

import {
  TypeormRepositoryBase,
  WhereCondition,
} from '@common/ddd/infrastructure/database/base-classes/typeorm.repository.base';
import { FindManyPaginatedParams, QueryParams } from '@common/ddd/domain/ports';
import { RegularObjectsUtil } from '@common/utils';

export interface SimpleDirectoryOrmEntity {
  id: string;
  title: string;
}

export abstract class DirectoryTypeormRepositoryBase<
  OrmEntity extends SimpleDirectoryOrmEntity,
> extends TypeormRepositoryBase<OrmEntity, OrmEntity> {
  static getDefaultSearchConditions(conditions: {
    skip?: number;
    size?: number;
  }): FindManyPaginatedParams<{ title: string }> {
    return {
      pagination: {
        skip: conditions.skip || 0,
        limit: conditions.size || 20,
      },
      orderBy: {
        title: 'ASC',
      },
      loadRelations: false,
    };
  }

  protected prepareQuery(
    params: QueryParams<OrmEntity>,
  ): WhereCondition<OrmEntity> {
    const where: WhereCondition<{ title?: string }> = {};

    if (params?.title) {
      where.title = ILike(`%${params.title}%`);
    }

    return RegularObjectsUtil.removeUndefinedProps({ ...params, ...where });
  }
}
