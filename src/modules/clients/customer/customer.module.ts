import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { DeactivateCustomerUseCase } from './commands/deactivate-customer/deactivate-customer.use-case';
import { CreateCustomerUseCase } from './commands/create-customer/create-customer.use-case';
import { JoinCustomersUseCase } from './commands/join-customers/join-customers.use-case';
import { Customer, Gender } from '@orm-entities/customer';
import {
  CustomerController,
  FindCustomersController,
} from './controllers';
import { CustomerRepository } from './repositories';
import {
  CustomerQueriesService,
  CustomerService,
} from './services';
import { GeneralClientModule } from '@modules/clients';
import { Superuser } from '@orm-entities/superuser.orm-entity';

const commandHandlers = [
  CreateCustomerUseCase,
  DeactivateCustomerUseCase,
  JoinCustomersUseCase,
];

const controllers = [
  CustomerController,
  FindCustomersController,
];

const repositories = [CustomerRepository];

@Module({
  imports: [
    TypeOrmModule.forFeature([Superuser, Customer, Gender]),
    GeneralClientModule,
  ],
  controllers: [...controllers],
  providers: [
    ...repositories,
    CustomerService,
    CustomerQueriesService,
    ...commandHandlers,
  ],
  exports: [CustomerService],
})
export class CustomerModule {}
