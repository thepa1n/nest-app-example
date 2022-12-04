import { HttpStatus } from '@nestjs/common';
import { AppHttpException } from './AppHttpException';

export class ArgumentInvalidException extends AppHttpException {
  constructor(message: string) {
    super(HttpStatus.BAD_REQUEST, 'ArgumentInvalidException', message);
  }
}
