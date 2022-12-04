import { Inject, Injectable } from '@nestjs/common';

import { ClientStatusEnum } from '@orm-entities/superuser.orm-entity';
import { DeactivateCustomerCommand } from '@modules/clients/customer/commands/deactivate-customer/deactivate-customer.command';
import { WrongRequestException } from '@common/exceptions';
import { TransactionalCommandHandlerBase } from '@common/ddd/domain/base-classes/command-handler.base';
import { UnitOfWorkSymbol } from '@common/ddd/domain/ports';
import { IApplicationUnitOfWork } from '../../../../../infrastructure/database/unit-of-work/unit-of-work';
import { ClientStatusChangeHistory } from '@orm-entities/profile';
import {
  AuditLogAggregatesEnum,
  AuditLogEventEnum,
  AuditLogEventPublisherPort,
  AuditLoggingPubSymbol,
  ClientDataAuditLogEvent,
} from '@cross-cutting-concerns/audit-logging';

@Injectable()
export class DeactivateCustomerUseCase extends TransactionalCommandHandlerBase<void> {
  constructor(
    @Inject(UnitOfWorkSymbol)
    protected readonly unitOfWork: IApplicationUnitOfWork,
    @Inject(AuditLoggingPubSymbol)
    private readonly _auditLogging: AuditLogEventPublisherPort,
  ) {
    super(unitOfWork);
  }

  protected async handle(command: DeactivateCustomerCommand): Promise<void> {
    const superuserRepo = this.unitOfWork.getSuperuserRepository(
      command.correlationId,
    );

    const statusHistoryRepo = this.unitOfWork.getSuperuserStatusHistoryRepo(
      command.correlationId,
    );

    const foundClient = await superuserRepo.getSuperuserDataByIdOrFail(
      command.clientId,
    );

    if (
      foundClient.statusId === ClientStatusEnum.INACTIVE &&
      foundClient.isActive === false
    ) {
      throw new WrongRequestException(
        'The current customer has been deactivated before!',
      );
    }

    foundClient.statusId = ClientStatusEnum.INACTIVE;
    foundClient.blockComment = command.comment;
    foundClient.isActive = false;

    await statusHistoryRepo.save(
      new ClientStatusChangeHistory({
        clientId: foundClient.id,
        statusId: ClientStatusEnum.INACTIVE,
        blockComment: command.comment,
      }),
    );

    await superuserRepo.save(foundClient);

    await this._auditLogging.publishEvent(
      new ClientDataAuditLogEvent({
        aggregateName: AuditLogAggregatesEnum.PERSON,
        commandName: DeactivateCustomerCommand.name,
        initiatorId: command.initiatorId,
        clientId: foundClient.id,
        entityId: foundClient.id,
        command: command,
        eventType: AuditLogEventEnum.UPDATE,
      }),
    );
  }
}
