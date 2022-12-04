import { HttpStatus } from '@nestjs/common';
import { AppHttpException } from './AppHttpException';

export class UnauthorizedException extends AppHttpException {
  constructor(message?: string) {
    super(
      HttpStatus.NOT_FOUND,
      'UnauthorizedException',
      message || 'User not authorized',
    );
  }
}
