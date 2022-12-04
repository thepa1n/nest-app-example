import {
  ArrayMaxSize,
  ArrayMinSize,
  IsNotEmpty,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class JoinCustomersRequestDto {
  @ApiProperty({
    description: 'Client ID(uuid version 4)',
  })
  @IsUUID('4')
  @IsNotEmpty()
  mainClientId: string;

  @ApiProperty({
    description: 'Client ID List(uuid version 4)',
    minLength: 1,
    maxLength: 5,
  })
  @IsUUID('4', { each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  @IsNotEmpty()
  duplicateClientIds: string[];
}
