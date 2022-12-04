import { Injectable } from '@nestjs/common';

import { TypeormUnitOfWork } from '@common/ddd/infrastructure/database/base-classes/typeorm-unit-of-work';
import { UnitOfWorkPort } from '@common/ddd/domain/ports/unit-of-work.port';
import { Superuser } from '@orm-entities/superuser.orm-entity';
import { CustomerRepository } from '@modules/clients/customer/repositories/customer.repository';
import { Customer } from '@orm-entities/customer/customer.orm-entity';

import {
  SuperuserRepository,
} from '@modules/clients/general-client-module/repositories';

export interface IApplicationUnitOfWork extends UnitOfWorkPort {
  getSuperuserRepository(correlationId: string): SuperuserRepository;

  getCustomerRepository(correlationId: string): CustomerRepository;
}

@Injectable()
export class UnitOfWork
  extends TypeormUnitOfWork
  implements IApplicationUnitOfWork
{
  public getSuperuserRepository(correlationId: string): SuperuserRepository {
    return new SuperuserRepository(
      this.getOrmRepository(Superuser, correlationId),
    ).setCorrelationId(correlationId);
  }

  public getCustomerRepository(correlationId: string): CustomerRepository {
    return new CustomerRepository(
      this.getOrmRepository(Customer, correlationId),
    ).setCorrelationId(correlationId);
  }
}
