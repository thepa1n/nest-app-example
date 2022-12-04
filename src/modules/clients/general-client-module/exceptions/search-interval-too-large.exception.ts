import { HttpStatus } from '@nestjs/common';

import { AppHttpException } from '@common/exceptions';

export class SearchIntervalTooLargeException extends AppHttpException {
  constructor(message: string) {
    super(HttpStatus.BAD_REQUEST, 'SearchIntervalTooLargeException', message);
  }
}
