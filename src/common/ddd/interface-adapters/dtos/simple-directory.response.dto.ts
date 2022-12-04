import { ApiProperty } from '@nestjs/swagger';

export class SimpleDirectoryResponse {
  constructor(props: SimpleDirectoryResponse) {
    this.id = props.id;
    this.title = props.title;
  }

  @ApiProperty({ description: 'Unique Record Identifier' })
  public readonly id: string;

  @ApiProperty({ description: 'Title of the value in the directory' })
  public readonly title: string;
}
