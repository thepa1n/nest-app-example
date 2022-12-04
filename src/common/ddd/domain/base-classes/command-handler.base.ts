import { UnitOfWorkPort } from '@common/ddd/domain/ports/unit-of-work.port';
import { CommandBase } from './command.base';

/**
 * Command Handler without DB transaction
 */
export abstract class CommandHandlerBase<CommandHandlerReturnType = unknown> {
  /**
   * Forces all command handlers to implement a handle method
   */
  protected abstract handle(
    command: CommandBase,
  ): Promise<CommandHandlerReturnType>;

  /**
   * Execute a command for consistency with Transactional Command Handler
   */
  execute(command: CommandBase): Promise<CommandHandlerReturnType> {
    return this.handle(command);
  }
}

/**
 * Command Handler with DB transaction
 */
export abstract class TransactionalCommandHandlerBase<
  CommandHandlerReturnType = unknown,
> {
  protected constructor(protected readonly unitOfWork: UnitOfWorkPort) {}

  /**
   * Forces all command handlers to implement a handle method
   */
  protected abstract handle(
    command: CommandBase,
  ): Promise<CommandHandlerReturnType>;

  /**
   * Execute a command as a UnitOfWork to include
   * everything in a single atomic database transaction
   */
  execute(command: CommandBase): Promise<CommandHandlerReturnType> {
    return this.unitOfWork.execute(command.correlationId, async () =>
      this.handle(command),
    );
  }
}


/**
 * Частный случай, вытянут из другого модуля, когда нужно было логировать все комманды
 * над сущностью в одинаковом формате
 */

import {
  AuditLogAggregatesEnum,
  AuditLogEventEnum,
  AuditLogEventPublisherPort,
  DirectoryAuditLogEvent,
} from '@cross-cutting-concerns/audit-logging';

export abstract class UpsertDirectoryCommandHandlerBase<
  CommandHandlerReturnType = unknown,
> {
  protected constructor(
    protected readonly unitOfWork: UnitOfWorkPort,
    protected readonly auditLogging: AuditLogEventPublisherPort,
  ) {}

  private async _handleContainer(
    command: CommandBase,
  ): Promise<CommandHandlerReturnType> {
    const result = await this.handle(command);

    await this.auditLogging.publishEvent(
      new DirectoryAuditLogEvent({
        aggregateName: AuditLogAggregatesEnum.DIRECTORY,
        command: command,
        commandName: command.constructor.name,
        entityId: AuditLogAggregatesEnum.DIRECTORY,
        initiatorId: command.initiatorId,
        eventType: AuditLogEventEnum.UPDATE,
      }),
    );

    return result;
  }

  protected abstract handle(
    command: CommandBase,
  ): Promise<CommandHandlerReturnType>;

  /**
   * Execute a command as a UnitOfWork to include
   * everything in a single atomic database transaction
   */
  execute(command: CommandBase): Promise<CommandHandlerReturnType> {
    return this.unitOfWork.execute(command.correlationId, async () =>
      this._handleContainer(command),
    );
  }
}

