import { Injectable, Logger } from '@nestjs/common';
import {
  TypeormRepositoryBase,
  WhereCondition,
} from '@common/ddd/infrastructure/database/base-classes/typeorm.repository.base';
import { Superuser } from '@orm-entities/superuser.orm-entity';
import { QueryParams } from '@common/ddd/domain/ports/repository.ports';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '@orm-entities/customer/customer.orm-entity';
import {
  generateSearchCustomersByFilterSql,
  IFoundCustomersByFilter,
  ISearchCustomerFilter,
} from '@modules/clients/customer/repositories/sql-queries';

interface CheckByNameAndBirthDayParam {
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: string;
  clientId?: string;
}

@Injectable()
export class CustomerRepository extends TypeormRepositoryBase<
  Customer,
  Customer
> {
  constructor(
    @InjectRepository(Customer)
    private readonly _customerRepo: Repository<Customer>,
  ) {
    super(_customerRepo, new Logger('CustomerRepository'));
  }

  protected relations: string[] = [];

  protected prepareQuery(
    params: QueryParams<Superuser>,
  ): WhereCondition<Superuser> {
    return params;
  }

  public async checkExistByInn(inn: string, clientId?: string): Promise<boolean> {
    const found = await this._customerRepo
      .createQueryBuilder('customer')
      .leftJoinAndSelect('customer.superuser', 'superuser')
      .where({
        innCode: inn,
      })
      .andWhere('superuser.isActive = :isActiveValue', {
        isActiveValue: true,
      })
      .getOne();

    return found && found.clientId === clientId ? false : !!found;
  }

  public async checkExistsByNameAndBirthDay(
    param: CheckByNameAndBirthDayParam,
  ): Promise<boolean> {
    const found = await this._customerRepo
      .createQueryBuilder('customer')
      .leftJoinAndSelect('customer.superuser', 'superuser')
      .where({
        firstName: param.firstName,
        lastName: param.lastName,
        middleName: param?.middleName,
        dateOfBirth: param.dateOfBirth,
      })
      .andWhere('superuser.isActive = :isActiveValue', {
        isActiveValue: true,
      })
      .getOne();

    return found && found.clientId === param.clientId ? false : !!found;
  }

  public async findByFilter(
    filter: ISearchCustomerFilter,
  ): Promise<IFoundCustomersByFilter[]> {
    const queryForSearch = generateSearchCustomersByFilterSql(filter);

    return this._customerRepo.query(queryForSearch);
  }
}
