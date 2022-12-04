import { v4 } from 'uuid';

import { RegularObjectsUtil } from '../../../utils';
import { Guard } from '../guard';

export type CommandProps<T> = Omit<
  T,
  'correlationId' | 'id' | 'baseInfo' | 'getProps'
> &
  Partial<CommandBase>;

export type BaseCommandProps = Omit<CommandBase, 'baseInfo' | 'getProps'>;

export abstract class CommandBase {
  protected constructor(props: CommandProps<unknown>) {
    const filteredProps = RegularObjectsUtil.removeUndefinedProps(
      props,
  ) as CommandProps<unknown>;

  if (Guard.isEmpty(filteredProps)) {
      throw new Error('Command props should not be empty!');
  }

  this.correlationId = filteredProps.correlationId || v4();
  this.id = filteredProps.id || v4();
  this.initiatorId = filteredProps.initiatorId;

  Object.assign(this, filteredProps);
  }

  /**
   * Command id, in case if we want to save it
   * for auditing purposes and create a correlation/causation chain
   */
  public readonly id: string;

  /**
   * ID for correlation purposes (for UnitOfWork, for commands that
   * arrive from other microservices,logs correlation etc).
   */
  public readonly correlationId: string;

  /**
   * Causation id to reconstruct execution ordering if needed
   */
  public readonly causationId?: string;

  /**
   * The unique identifier of the user or system that initiated this action
   */
  public readonly initiatorId: string;
}
