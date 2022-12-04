import { IsString, Length } from 'class-validator';

export class BlockClientRequestDto {
  @IsString()
  @Length(5, 255)
  comment: string;
}
