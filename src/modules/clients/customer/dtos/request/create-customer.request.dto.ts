import {
  IsBoolean,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { IsOnlyDate } from '@common/validators';
import { ApiProperty } from '@nestjs/swagger';

export class ClientAdditionalInfoRequestDto {
  @ApiProperty({
    description: 'Customer firstName',
  })
  @IsOptional()
  @IsString()
  @Length(2, 32)
  latFirstName?: string;

  @ApiProperty({
    description: 'Customer firstName',
  })
  @IsOptional()
  @IsString()
  @Length(2, 32)
  latLastName?: string;

  @ApiProperty({
    description: 'Country ID(uuid version 4)',
  })
  @IsOptional()
  @IsUUID('4')
  birthCountryId?: string;

  @ApiProperty({
    description: 'Place of Birth',
  })
  @IsOptional()
  @IsString()
  @Length(2, 256)
  birthPlace?: string;

  @ApiProperty({
    description: 'Gender ID(uuid version 4)',
  })
  @IsOptional()
  @IsUUID('4')
  genderId?: string;

  @ApiProperty({
    description: 'Country ID(uuid version 4)',
  })
  @IsOptional()
  @IsUUID('4')
  citizenCountryId?: string;

  @ApiProperty({
    description: 'Is resident or not',
  })
  @IsBoolean()
  isResident: boolean;

  @ApiProperty({
    description: 'Is public figure or not',
  })
  @IsOptional()
  @IsBoolean()
  isPublicFigure?: boolean;

  @ApiProperty({
    description: 'Code from place of registration',
  })
  @IsOptional()
  @IsString()
  @Length(5, 64)
  registrationPlaceCode?: string;

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

  @ApiProperty({
    description: 'Permission for disturb client',
  })
  @IsOptional()
  @IsBoolean()
  canDisturb?: boolean;

  @ApiProperty({
    description: 'Permission for process personal data',
  })
  @IsOptional()
  @IsBoolean()
  permProcessData?: boolean;

  @ApiProperty({
    description: 'Permission for send promo mailings',
  })
  @IsOptional()
  @IsBoolean()
  permReceivePromoMailings?: boolean;
}

export class CreateCustomerRequestDto {
  @ApiProperty({
    description: 'Customer firstName',
  })
  @IsString()
  @Length(2, 32)
  public readonly firstName: string;

  @ApiProperty({
    description: 'Customer lastname',
  })
  @IsString()
  @Length(2, 32)
  public readonly lastName: string;

  @ApiProperty({
    description: 'Customer middleName',
    minLength: 2,
    maxLength: 32,
  })
  @IsOptional()
  @IsString()
  @Length(2, 32)
  public readonly middleName?: string;

  @ApiProperty({
    description: 'Customer date of birth',
  })
  @IsOnlyDate()
  public readonly dateOfBirth: string;

  @ApiProperty({
    description: 'Is religious customer',
  })
  @IsBoolean()
  public readonly isReligious: boolean;

  @ApiProperty({
    description: 'Is taxpayer code, only number chars',
  })
  @IsOptional()
  @ValidateIf((o: CreateCustomerRequestDto) => o.isReligious === false)
  @Transform((params: { value: unknown; obj: CreateCustomerRequestDto }) =>
    params.obj.isReligious === false ? params.value : undefined,
  )
  @IsNumberString()
  @IsNotEmpty()
  @Length(10, 10)
  public readonly inn?: string;

  @ApiProperty({
    description: 'Additional client information',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ClientAdditionalInfoRequestDto)
  public readonly additionalInfo?: ClientAdditionalInfoRequestDto;

  @ApiProperty({
    description: 'List of Registration goal ID(uuid version 4)',
  })
  @IsOptional()
  @IsUUID('4', { each: true })
  public readonly registrationGoalsId?: string[];

  @ApiProperty({
    description: 'Client Sub Type ID(uuid version 4)',
  })
  @IsOptional()
  @IsUUID('4')
  public readonly subTypeId?: string;
}
