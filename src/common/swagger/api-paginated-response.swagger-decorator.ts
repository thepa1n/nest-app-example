import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { applyDecorators, HttpStatus, Type } from '@nestjs/common';

import { PaginationHttpResponse } from '@common/ddd/interface-adapters';

export function ApiPaginatedResponse<TModel extends Type>(
  status: HttpStatus,
  model: TModel,
): Function {
  return applyDecorators(
    ApiExtraModels(PaginationHttpResponse, model),
    ApiResponse({
      status,
      schema: {
        allOf: [
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
          { $ref: getSchemaPath(PaginationHttpResponse) },
        ],
      },
    }),
  );
}
