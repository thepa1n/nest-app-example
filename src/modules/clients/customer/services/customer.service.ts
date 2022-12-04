import { Injectable } from '@nestjs/common';

import { Superuser } from '@orm-entities/superuser.orm-entity';
import { CustomerRepository } from '../repositories';
import { Customer } from '@orm-entities/customer/customer.orm-entity';
import { UUID } from '@common/ddd/domain/value-objects';
import { CustomerConstants } from '../customer.constants';
import { CreateCustomerCommand } from '../commands/create-customer/create-customer.command';
import { GeneralClientService } from '@modules/clients/general-client-module/services';

@Injectable()
export class CustomerService {
  constructor(
    private readonly _customerRepository: CustomerRepository,
    private readonly _generalClientService: GeneralClientService,
  ) {}

  public async checkUniqueness(params: {
    firstName: string;
    lastName: string;
    middleName?: string;
    dateOfBirth: string;
    isReligious: boolean;
    inn?: string;
  }): Promise<boolean> {
    let isExists: boolean;

    if (params.isReligious) {
      isExists = await this._customerRepository.checkExistsByNameAndBirthDay({
        firstName: params.firstName,
        lastName: params.lastName,
        middleName: params.middleName,
        dateOfBirth: params.dateOfBirth,
      });
    } else {
      isExists = await this._customerRepository.checkExistByInn(params.inn);
    }

    return isExists;
  }

  public createCustomerEntry(
    params: Partial<CreateCustomerCommand> & { statusId: string },
  ): Superuser {
    const customerProfile = new Customer();

    /**
     * Если ИНН нет(или он религиозынй), то резиденту 10 нулей, не резиденту 9 нулей
     */
    if (params.isReligious) {
      if (params.isResident) {
        customerProfile.innCode = CustomerConstants.INN_CODE_IF_RELIGIOUS;
      } else {
        customerProfile.innCode = CustomerConstants.INN_CODE_IF_NOT_RESIDENT;
      }
    } else if (!params.inn && !params.isResident) {
      customerProfile.innCode = CustomerConstants.INN_CODE_IF_NOT_RESIDENT;
    } else {
      customerProfile.innCode = params.inn;
    }

    customerProfile.id = UUID.generate().value;
    customerProfile.firstName = params.firstName;
    customerProfile.firstName = params.firstName;
    customerProfile.lastName = params.lastName;
    customerProfile.middleName = params?.middleName;
    customerProfile.dateOfBirth = params.dateOfBirth;
    customerProfile.isReligious = params.isReligious;
    customerProfile.latFirstName = params?.latFirstName;
    customerProfile.latLastName = params?.latLastName;
    customerProfile.birthCountryId = params?.birthCountryId;
    customerProfile.birthPlace = params?.birthPlace;
    customerProfile.genderId = params?.genderId;
    customerProfile.isResident = params?.isResident;
    customerProfile.citizenCountryId = params?.citizenCountryId;
    customerProfile.isPublicFigure = params?.isPublicFigure;

    return this._generalClientService.createSuperuserCustomer({
      ...params,
      customer: customerProfile,
    });
  }
}
