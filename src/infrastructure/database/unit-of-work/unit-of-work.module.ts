import { Global, Logger, Module } from '@nestjs/common';

import { UnitOfWorkSymbol } from '@common/ddd/domain/ports';
import { UnitOfWork } from './unit-of-work';

const unitOfWorkSingletonProvider = {
  provide: UnitOfWorkSymbol,
  useFactory: (): UnitOfWork => new UnitOfWork(new Logger()),
};

@Global()
@Module({
  imports: [],
  providers: [unitOfWorkSingletonProvider],
  exports: [UnitOfWorkSymbol],
})
export class UnitOfWorkModule {}
