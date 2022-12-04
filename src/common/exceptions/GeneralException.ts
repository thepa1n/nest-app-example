import { HttpStatus } from '@nestjs/common';
import { AppHttpException } from './AppHttpException';

export class GeneralException extends AppHttpException {
  constructor(message: string) {
    super(HttpStatus.INTERNAL_SERVER_ERROR, 'GeneralException', message);
  }
}
