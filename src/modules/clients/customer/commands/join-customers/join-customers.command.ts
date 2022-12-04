import {
  CommandBase,
  CommandProps,
} from '@common/ddd/domain/base-classes/command.base';

export class JoinCustomersCommand extends CommandBase {
  constructor(props: CommandProps<JoinCustomersCommand>) {
    super(props);

    this.mainClientId = props.mainClientId;
    this.duplicateClientIds = props.duplicateClientIds;
  }

  public readonly mainClientId: string;
  public readonly duplicateClientIds: string[];
}
