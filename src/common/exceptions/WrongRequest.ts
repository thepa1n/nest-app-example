import { HttpStatus } from '@nestjs/common';
import { AppHttpException } from './AppHttpException';

export class WrongRequestException extends AppHttpException {
  constructor(message: string, construction?: any) {
    super(
      HttpStatus.BAD_REQUEST,
      'WrongRequestException',
      message,
      construction,
    );
  }
}
