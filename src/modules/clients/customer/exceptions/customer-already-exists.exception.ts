import { HttpStatus } from '@nestjs/common';
import { AppHttpException } from '@common/exceptions';

export class CustomerAlreadyExistsException extends AppHttpException {
  constructor(message: string) {
    super(HttpStatus.BAD_REQUEST, 'CustomerAlreadyExistsException', message);
  }
}
