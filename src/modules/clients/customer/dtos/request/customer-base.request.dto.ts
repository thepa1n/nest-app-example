import {
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CustomerBaseRequestDto {
  @ApiProperty({
    description: 'Name in Latin letters',
    minLength: 2,
    maxLength: 32,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(32)
  public readonly latFirstName?: string;

  @ApiProperty({
    description: 'Lastname in Latin letters',
    minLength: 2,
    maxLength: 32,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(32)
  public readonly latLastName?: string;

  @ApiProperty({
    description: 'Country ID(uuid version 4)',
  })
  @IsOptional()
  @IsUUID('4')
  public readonly birthCountryId?: string;

  @ApiProperty({
    description: 'Place of Birth',
  })
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(255)
  public readonly birthPlace?: string;

  @ApiProperty({
    description: 'Gender ID(uuid version 4)',
  })
  @IsOptional()
  @IsUUID('4')
  public readonly genderId?: string;

  @ApiProperty({
    description: 'Country ID(uuid version 4)',
  })
  @IsOptional()
  @IsUUID('4')
  public readonly citizenCountryId?: string;

  @ApiProperty({
    description: 'System registration place code',
    minLength: 3,
    maxLength: 18,
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(18)
  public readonly registrationPlaceCode?: string;

  @ApiProperty({
    description: 'EDDR code',
    example: '12345678-1234',
  })
  @IsOptional()
  @IsString()
  @Length(13, 13)
  @Matches(/^([0-9]{8})-([0-9]{4}$)/, {
    message:
      'The EDDR code must be 13 characters long. ' +
      '8 digits, dash, 4 digits. Example: 12345678-1234',
  })
  public readonly eddrCode?: string;
}
