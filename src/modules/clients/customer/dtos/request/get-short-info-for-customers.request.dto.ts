import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsNotEmpty,
  IsUUID,
} from 'class-validator';

export class GetShortInfoForCustomersRequestDto {
  @ApiProperty({
    description: 'Client ID List(uuid version 4)',
    minLength: 1,
    maxLength: 10,
  })
  @IsUUID('4', { each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @IsNotEmpty()
  clientIdList: string[];
}
