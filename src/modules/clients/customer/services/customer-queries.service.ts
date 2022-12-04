import { Injectable } from '@nestjs/common';

import {
  ClientTypeEnum,
  SuperuserCustomerType,
} from '@orm-entities/superuser.orm-entity';
import { CustomerRepository } from '../repositories';
import { CustomerConstants } from '@modules/clients/customer/customer.constants';
import { NotFoundException, WrongRequestException } from '@common/exceptions';
import { SearchIntervalTooLargeException } from '@modules/clients/general-client-module/exceptions';
import {
  IFoundShortCustomerInfo,
  SuperuserRepository,
} from '@modules/clients/general-client-module/repositories';
import { RegularObjectsUtil } from '@common/utils';
import {
  IFoundCustomersByFilter,
  ISearchCustomerFilter,
} from '@modules/clients/customer/repositories/sql-queries';

@Injectable()
export class CustomerQueriesService {
  constructor(
    private readonly _superuserRepo: SuperuserRepository,
    private readonly _customerRepository: CustomerRepository,
  ) {}

  public async getCustomersByIdList(
    clientIds: string[],
  ): Promise<SuperuserCustomerType[]> {
    const foundCustomers = await this._superuserRepo.findByIdList({
      clientIds,
      conditions: {
        clientTypeId: ClientTypeEnum.CUSTOMER,
      },
    });

    // Сортируем в порядке идентификаторов, которые пришли к нам
    return foundCustomers.sort(function (a, b) {
      return clientIds.indexOf(a.id) - clientIds.indexOf(b.id);
    });
  }

  public async searchCustomersByFilter(
    filter: ISearchCustomerFilter,
  ): Promise<IFoundCustomersByFilter[]> {
    if (!Object.keys(RegularObjectsUtil.removeUndefinedProps(filter))?.length) {
      throw new WrongRequestException('Filter Must have least one criteria!');
    }

    const foundClients = await this._customerRepository.findByFilter(filter);

    if (
      foundClients.length > CustomerConstants.MAX_SIZE_OF_CUSTOMERS_IN_RESPONSE
    ) {
      throw new SearchIntervalTooLargeException(
        'The search interval is too large! Refine your search criteria!',
      );
    }

    return foundClients;
  }

  public async getCustomerGeneralInfo(
    clientId: string,
  ): Promise<IFoundShortCustomerInfo> {
    const foundCustomer =
      await this._superuserRepo.findCustomerShortInfoWithDocsContacts(clientId);

    if (!foundCustomer) {
      throw new NotFoundException(`Customer with id: ${clientId} not found!`);
    }

    return foundCustomer;
  }
}
