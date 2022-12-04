import {
  CommandBase,
  CommandProps,
} from '@common/ddd/domain/base-classes/command.base';

export class CreateCustomerCommand extends CommandBase {
  constructor(props: CommandProps<CreateCustomerCommand>) {
    super(props);
  }

  public readonly firstName: string;
  public readonly lastName: string;
  public readonly middleName?: string;
  public readonly dateOfBirth: string;
  public readonly isReligious: boolean;
  public readonly inn?: string;

  public readonly latFirstName?: string;
  public readonly latLastName?: string;
  public readonly birthCountryId?: string;
  public readonly birthPlace?: string;
  public readonly genderId?: string;
  public readonly citizenCountryId?: string;
  public readonly isResident: boolean;
  public readonly isPublicFigure?: boolean;
  public readonly registrationPlaceCode?: string;
  public readonly eddrCode?: string;
  public readonly canDisturb?: boolean;
  public readonly permProcessData?: boolean;
  public readonly permReceivePromoMailings?: boolean;

  public readonly registrationChannelId?: string;
  public readonly segmentId?: string;
  public readonly clientSubTypeId?: string;

  public readonly registrationGoals?: Array<{
    id: string;
  }>;
}
