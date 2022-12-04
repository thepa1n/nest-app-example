import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { RegistrationAccountGoal } from '@orm-entities/registration-goal';
import {
  ClientStatusChangeHistory,
  ClientSubTypeOrmEntity,
  RegistrationChannel,
} from '@orm-entities/profile';
import { Superuser } from '@orm-entities/superuser.orm-entity';
import {
  GeneralClientService,
} from './services';
import {
  SuperuserRepository,
} from './repositories';

const services = [
  GeneralClientService,
];
const repositories = [
  SuperuserRepository,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Superuser,
      RegistrationAccountGoal,
      ClientStatusChangeHistory,
      RegistrationChannel,
      ClientSubTypeOrmEntity,
    ]),
  ],
  providers: [...services, ...repositories],
  exports: [
    GeneralClientService,
    SuperuserRepository,
  ],
})
export class GeneralClientModule {}
