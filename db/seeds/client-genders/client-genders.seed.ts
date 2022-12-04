import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';

import valueForInsert from './data/client-genders.data.json';
import { Gender } from '@orm-entities/customer/gender.orm-entity';

export default class ClientGendersSeed implements Seeder {
  public async run(_factory: Factory, connection: Connection): Promise<void> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(Gender)
      .values(valueForInsert)
      .orUpdate(['title', 'system_title'], ['id'])
      .execute();
  }
}
