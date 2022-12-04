import { Inject, Injectable } from '@nestjs/common';

import { TransactionalCommandHandlerBase } from '@common/ddd/domain/base-classes';
import { IApplicationUnitOfWork } from '../../../../../infrastructure/database/unit-of-work/unit-of-work';
import { UnitOfWorkSymbol } from '@common/ddd/domain/ports';
import { WrongRequestException } from '@common/exceptions';
import { CustomerAlreadyExistsException } from '../../exceptions';
import { UUID, ID } from '@common/ddd/domain/value-objects';
import { CreateCustomerCommand } from './create-customer.command';
import { Guard } from '@common/ddd/domain/guard';
import { CustomerService } from '@modules/clients/customer/services';
import { ClientStatusEnum } from '@orm-entities/superuser.orm-entity';
import {
  AuditLogAggregatesEnum,
  AuditLogEventEnum,
  AuditLogEventPublisherPort,
  AuditLoggingPubSymbol,
  ClientDataAuditLogEvent,
} from '@cross-cutting-concerns/audit-logging';

@Injectable()
export class CreateCustomerUseCase extends TransactionalCommandHandlerBase<ID> {
  constructor(
    @Inject(UnitOfWorkSymbol)
    protected readonly unitOfWork: IApplicationUnitOfWork,
    @Inject(AuditLoggingPubSymbol)
    private readonly _auditLogging: AuditLogEventPublisherPort,
    private readonly _customerService: CustomerService,
  ) {
    super(unitOfWork);
  }

  protected async handle(command: CreateCustomerCommand): Promise<ID> {
    if (!command.inn && !command.isReligious) {
      throw new WrongRequestException(
        'The taxpayer code is mandatory if the person is not religious!',
      );
    }

    if (
      !command.isReligious &&
      !Guard.isNumberStringWithLength(command.inn, 10)
    ) {
      throw new WrongRequestException(
        'Taxpayer Code must be 10 char length and only numbers!',
      );
    }

    const isExist = await this._customerService.checkUniqueness(command);

    if (isExist) {
      throw new CustomerAlreadyExistsException('Customer already exists!');
    }

    const client = this._customerService.createCustomerEntry({
      ...command,
      statusId: ClientStatusEnum.ACTIVE,
    });

    await this.unitOfWork
      .getSuperuserRepository(command.correlationId)
      .save(client);

    await this._auditLogging.publishEvent(
      new ClientDataAuditLogEvent({
        aggregateName: AuditLogAggregatesEnum.PERSON,
        command: command,
        commandName: CreateCustomerCommand.name,
        entityId: client.id,
        clientId: client.id,
        initiatorId: command.initiatorId,
        eventType: AuditLogEventEnum.CREATE,
      }),
    );

    return new UUID(client.id);
  }
}
