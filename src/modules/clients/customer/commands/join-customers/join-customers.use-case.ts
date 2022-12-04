import { Inject, Injectable } from '@nestjs/common';

import { WrongRequestException } from '@common/exceptions';
import { JoinCustomersCommand } from './join-customers.command';
import { ID, UUID } from '@common/ddd/domain/value-objects';
import { TransactionalCommandHandlerBase } from '@common/ddd/domain/base-classes/command-handler.base';
import { UnitOfWorkSymbol } from '@common/ddd/domain/ports';
import { IApplicationUnitOfWork } from '../../../../../infrastructure/database/unit-of-work/unit-of-work';
import {
  AuditLogAggregatesEnum,
  AuditLogEventEnum,
  AuditLogEventPublisherPort,
  AuditLoggingPubSymbol,
  ClientDataAuditLogEvent,
} from '@cross-cutting-concerns/audit-logging';
import { ClientTypeEnum } from '@orm-entities/superuser.orm-entity';

@Injectable()
export class JoinCustomersUseCase extends TransactionalCommandHandlerBase<ID> {
  constructor(
    @Inject(UnitOfWorkSymbol)
    protected readonly unitOfWork: IApplicationUnitOfWork,
    @Inject(AuditLoggingPubSymbol)
    private readonly _auditLogging: AuditLogEventPublisherPort,
  ) {
    super(unitOfWork);
  }

  protected async handle(command: JoinCustomersCommand): Promise<ID> {
    if (command.duplicateClientIds.includes(command.mainClientId)) {
      throw new WrongRequestException(
        '`mainClientId` cannot be used in `duplicateClientIds`',
      );
    }

    const superuserRepo = this.unitOfWork.getSuperuserRepository(
      command.correlationId,
    );

    const mainClient = await superuserRepo.getSuperuserDataByIdOrFail(
      command.mainClientId,
    );

    if (!mainClient.isActive) {
      throw new WrongRequestException('Main Client must be active!');
    }

    const duplicateClientsExist = await superuserRepo.checkExistByIdList(
      command.duplicateClientIds,
      ClientTypeEnum.CUSTOMER,
    );

    if (!duplicateClientsExist) {
      throw new WrongRequestException(
        'One or more duplicate customer IDs do not exist ' +
          'in the database, or the records are not active!',
      );
    }

    await superuserRepo.setParentEntryForMultipleByIds(
      command.duplicateClientIds,
      mainClient.id,
    );

    await this._auditLogging.publishEvent(
      new ClientDataAuditLogEvent({
        aggregateName: AuditLogAggregatesEnum.PERSON,
        commandName: JoinCustomersCommand.name,
        initiatorId: command.initiatorId,
        clientId: mainClient.id,
        entityId: mainClient.id,
        command: command,
        eventType: AuditLogEventEnum.UPDATE,
      }),
    );

    return new UUID(mainClient.id);
  }
}
