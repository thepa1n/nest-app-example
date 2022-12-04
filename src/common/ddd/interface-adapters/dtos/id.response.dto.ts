import { ApiProperty } from '@nestjs/swagger';

import { Id } from '../interfaces/id.interface';

export class IdResponse implements Id {
  constructor(id: string) {
    this.id = id;
  }

  @ApiProperty({ description: 'Unique Record Identifier' })
  public readonly id: string;
}
