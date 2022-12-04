import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

import { DataWithPaginationMeta } from '@common/ddd/domain/ports';

export class PaginationHttpResponse<T> implements DataWithPaginationMeta<T> {
  constructor(props: PaginationHttpResponse<T>) {
    Object.assign(this, props);
  }

  @ApiHideProperty()
  data: T[];

  @ApiProperty({
    description: 'The number of records found by the passed criteria',
  })
  totalCount: number;

  @ApiProperty({
    description: 'What quantity limit was set by the request',
  })
  limit: number;

  @ApiProperty({
    description: 'Current page number',
  })
  page: number;

  @ApiProperty({
    description: 'Number of received records on the current page',
  })
  take: number;

  @ApiProperty({
    description: 'Total number of pages',
  })
  totalPages: number;
}
