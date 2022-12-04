import { HttpStatus } from '@nestjs/common';
import { AppHttpException } from './AppHttpException';

export class DatabaseException extends AppHttpException {
  constructor(message: string, error?: any) {
    super(
      error?.status ||
        error?.response?.status ||
        HttpStatus.INTERNAL_SERVER_ERROR,
      'DatabaseException',
      error?.detail || error?.message || message,
    );
  }
}
