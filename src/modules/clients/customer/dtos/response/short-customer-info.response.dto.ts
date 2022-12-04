import { SimpleDirectoryResponse } from '@common/ddd/interface-adapters';

export class ClientGeneralInfoResponse {
  constructor(props: ClientGeneralInfoResponse) {
    Object.assign(this, props);
  }

  public readonly id: string;
  public readonly ugbId: string;

  public readonly firstName: string;
  public readonly lastName: string;
  public readonly middleName: string;
  public readonly dateOfBirth: string;
  public readonly gender: SimpleDirectoryResponse;
  public readonly status: SimpleDirectoryResponse;
  public readonly isReligious: boolean;
  public readonly isPublicFigure: boolean;
  public readonly haveFATCA: boolean;
  public readonly inn: string;
  public readonly eddrCode?: string;
  public readonly passport: {
    readonly series?: string;
    readonly number: string;
  };
  public readonly financialPhone: string;
}

export class ShortCustomerInfoResponse {
  constructor(props: ShortCustomerInfoResponse) {
    Object.assign(this, props);
  }

  public readonly id: string;

  public readonly firstName?: string;
  public readonly lastName?: string;
  public readonly middleName?: string;

  public readonly dateOfBirth?: string;
  public readonly gender?: string;
}
