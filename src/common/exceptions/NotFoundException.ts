import { HttpStatus } from '@nestjs/common';
import { AppHttpException } from './AppHttpException';

export class NotFoundException extends AppHttpException {
  constructor(message: string) {
    super(HttpStatus.NOT_FOUND, 'NotFoundException', message);
  }
}
