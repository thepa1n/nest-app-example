import {
  CommandBase,
  CommandProps,
} from '@common/ddd/domain/base-classes/command.base';

export class DeactivateCustomerCommand extends CommandBase {
  constructor(props: CommandProps<DeactivateCustomerCommand>) {
    super(props);
  }

  public readonly clientId: string;
  public readonly comment: string;
}
