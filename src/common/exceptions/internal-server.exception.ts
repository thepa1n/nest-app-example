import { HttpStatus } from '@nestjs/common';
import { AppHttpException } from './AppHttpException';

export class InternalServerException extends AppHttpException {
  constructor(message: string, error?: any, hideDetails: boolean = false) {
    super(
      error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      'InternalServerException',
      error?.detail || error?.message || message,
      hideDetails
        ? undefined
        : {
            details: error.stack || undefined,
          },
    );
  }
}
