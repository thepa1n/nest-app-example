import { Response } from 'express';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  UnauthorizedException as NestUnauthorizedException,
  HttpStatus,
} from '@nestjs/common';

import { UnauthorizedException } from '@common/exceptions';

@Catch(NestUnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost): void {
    console.log('Unauthorized Filter Catch exception: ', { exception });

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    response
      .status(HttpStatus.UNAUTHORIZED)
      .json(new UnauthorizedException(exception.message).getResponse());
  }
}
