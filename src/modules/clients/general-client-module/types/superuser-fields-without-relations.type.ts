import { Superuser } from '@orm-entities/superuser.orm-entity';
import { ExcludeObjectFields } from '@common/types';

export type SuperuserFieldsWithoutRelationsType =
  ExcludeObjectFields<Superuser>;
