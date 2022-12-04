import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

class PassportDataForSearch {
  @ApiProperty({
    description: 'Passport series',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }: TransformFnParams) =>
    value?.replace(/[!@#$%^&*()_+=\[\]{};:"\\|,.<>\/?]+/g, ''),
  )
  public readonly series?: string;

  @ApiProperty({
    description: 'Customer passport number',
  })
  @IsNumberString()
  @Transform(({ value }: TransformFnParams) =>
    value?.replace(/[!@#$%^&*()_+=\[\]{};:"\\|,.<>\/?]+/g, ''),
  )
  public readonly number: string;
}

export class SearchClientByFiltersRequestDto {
  @ApiProperty({
    description: 'Customer firstname',
    minLength: 2,
    maxLength: 32,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(32)
  @Transform(({ value }: TransformFnParams) =>
    value?.replace(/[!@#$%^&*()_+=\[\]{};:"\\|,.<>\/?]+/g, ''),
  )
  public readonly firstName?: string;

  @ApiProperty({
    description: 'Customer lastname',
    minLength: 2,
    maxLength: 32,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(32)
  @Transform(({ value }: TransformFnParams) =>
    value?.replace(/[!@#$%^&*()_+=\[\]{};:"\\|,.<>\/?]+/g, ''),
  )
  public readonly lastName?: string;

  @ApiProperty({
    description: 'Customer middleName',
    minLength: 2,
    maxLength: 32,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(32)
  @Transform(({ value }: TransformFnParams) =>
    value?.replace(/[!@#$%^&*()_+=\[\]{};:"\\|,.<>\/?]+/g, ''),
  )
  public readonly middleName?: string;

  @ApiProperty({
    description: 'Customer phone number',
    minLength: 7,
    maxLength: 15,
  })
  @IsOptional()
  @IsNumberString()
  @IsNotEmpty()
  @Length(7, 15)
  @Transform(({ value }: TransformFnParams) =>
    value?.replace(/[!@#$%^&*()_+=\[\]{};:"\\|,.<>\/?]+/g, ''),
  )
  public readonly phoneNumber?: string;

  @ApiProperty({
    description: 'Customer taxpayer code',
    minLength: 10,
    maxLength: 10,
  })
  @IsOptional()
  @IsNumberString()
  @IsNotEmpty()
  @Length(10, 10)
  @Transform(({ value }: TransformFnParams) =>
    value?.replace(/[!@#$%^&*()_+=\[\]{};:"\\|,.<>\/?]+/g, ''),
  )
  public readonly innCode?: string;

  @ApiProperty({
    description: 'Customer UGB code',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) =>
    value?.replace(/[!@#$%^&*()_+=\[\]{};:"\\|,.<>\/?]+/g, ''),
  )
  public readonly ugbCode?: string;

  @ApiProperty({
    description: 'Responsible manager ID(uuid version 4)',
  })
  @IsOptional()
  @IsUUID('4')
  @IsNotEmpty()
  public readonly responsibleManagerId?: string;

  @ApiProperty({
    description: 'Customer passport information',
  })
  @ValidateNested()
  @Type(() => PassportDataForSearch)
  public readonly passport: PassportDataForSearch;
}
