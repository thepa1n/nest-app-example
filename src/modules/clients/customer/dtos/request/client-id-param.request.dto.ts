import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ClientIdParamRequestDto {
  @ApiProperty({
    description: 'Client ID(uuid version 4)',
  })
  @IsUUID('4')
  clientId: string;
}
