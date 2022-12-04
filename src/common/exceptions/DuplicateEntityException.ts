import { HttpStatus } from '@nestjs/common';
import { AppHttpException } from './AppHttpException';

export class DuplicateEntityException extends AppHttpException {
  constructor(message: string) {
    super(HttpStatus.CONFLICT, 'DuplicateEntityException', message);
  }
}
