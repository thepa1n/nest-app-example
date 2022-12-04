import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { QueryParams } from '@common/ddd/domain/ports/repository.ports';
import {
  TypeormRepositoryBase,
  WhereCondition,
} from '@common/ddd/infrastructure/database/base-classes/typeorm.repository.base';
import {
  ClientStatusEnum,
  ClientTypeEnum,
  Superuser,
} from '@orm-entities/superuser.orm-entity';
import { NotFoundException } from '@common/exceptions';
import { ExternalSystemEnum } from '@orm-entities/external-ids';
import { DocumentTypeEnum } from '@orm-entities/document';
import { ClientContactTypeEnum } from '@orm-entities/contacts';

export interface IFoundShortCustomerInfo
  extends Pick<
    Superuser,
    | 'id'
    | 'customer'
    | 'eddrCode'
    | 'clientContacts'
    | 'documents'
    | 'externalSystemIds'
    | 'status'
    | 'fatcaInfo'
  > {}

@Injectable()
export class SuperuserRepository extends TypeormRepositoryBase<
  Superuser,
  Superuser
> {
  constructor(
    @InjectRepository(Superuser)
    protected readonly _superuserRepo: Repository<Superuser>,
  ) {
    super(_superuserRepo, new Logger(SuperuserRepository.name));
  }

  protected relations: string[] = [
    'externalSystemIds',
    'customer',
    'customer.birthCountry',
    'customer.citizenCountry',
    'legalEntity',
    'legalEntity.ownershipType',
    'clientSegment',
    'clientType',
    'clientSubType',
    'identStatus',
    'registrationChannel',
    'registrationAccountGoals',
    'status',
    'responsibleManager',
    'responsibleManager.managerProfile',
    'responsibleManager.managerProfile.customer',
    'clientEconomicActivities',
  ];

  private async _updateByIdList(
    clientIds: string[],
    partialEntity: Partial<Omit<Superuser, 'id'>>,
  ): Promise<void> {
    await this._superuserRepo.update(
      {
        id: In(clientIds),
      },
      partialEntity,
    );
  }

  protected prepareQuery(
    params: QueryParams<Superuser>,
  ): WhereCondition<Superuser> {
    return params;
  }

  public async getSuperuserDataByIdOrFail(
    clientId: string,
    params?: Partial<Superuser>,
  ): Promise<Superuser> {
    const foundClient = await this._superuserRepo.findOne({
      where: {
        id: clientId,
        ...params,
      },
    });

    if (!foundClient) {
      throw new NotFoundException(`Client with id: ${clientId} not found!`);
    }

    return foundClient;
  }

  public async checkExistByIdList(
    clientIds: string[],
    clientType: ClientTypeEnum,
  ): Promise<boolean> {
    const foundEntries = await this._superuserRepo.count({
      where: {
        id: In(clientIds),
        clientTypeId: clientType,
        isActive: true,
      },
    });

    return foundEntries === clientIds.length;
  }

  public async setParentEntryForMultipleByIds(
    clientIds: string[],
    mainClientId: string,
  ): Promise<void> {
    await this._updateByIdList(clientIds, {
      parentClientId: mainClientId,
      statusId: ClientStatusEnum.DUPLICATE,
      isActive: false,
    });
  }

  public async findByIdList({
    loadRelations = true,
    ...params
  }: {
    clientIds: string[];
    size?: number;
    loadRelations?: boolean;
    conditions?: Partial<Omit<Superuser, 'id'>>;
  }): Promise<Superuser[]> {
    return this._superuserRepo.find({
      where: { id: In(params.clientIds || []), ...params.conditions },
      relations: loadRelations ? this.relations : [],
      take: params?.size || 10,
    });
  }

  /**
   * Часть для ФО
   */

  public async getShortCustomerOrFail(
    clientId: string,
    params?: Partial<Superuser>,
  ): Promise<Superuser> {
    const foundClient = await this._superuserRepo.findOne({
      where: {
        id: clientId,
        clientTypeId: ClientTypeEnum.CUSTOMER,
        ...params,
      },
    });

    if (!foundClient) {
      throw new NotFoundException(`Customer with id: ${clientId} not found!`);
    }

    return foundClient;
  }

  public async findCustomerShortInfoWithDocsContacts(
    clientId: string,
  ): Promise<IFoundShortCustomerInfo> {
    return this._superuserRepo
      .createQueryBuilder('superuser')
      .leftJoinAndSelect('superuser.status', 'status')
      .leftJoinAndSelect('superuser.fatcaInfo', 'fatcaInfo')
      .leftJoinAndSelect('superuser.customer', 'customer')
      .leftJoinAndSelect('customer.gender', 'gender')
      .leftJoinAndSelect(
        'superuser.documents',
        'documents',
        `documents.typeId in ('${DocumentTypeEnum.ID_CARD}','${DocumentTypeEnum.PASSPORT}')
            and documents.isActive = true`,
      )
      .leftJoinAndSelect(
        'superuser.clientContacts',
        'clientContacts',
        `clientContacts.contactTypeId = '${ClientContactTypeEnum.CUSTOMER_PHONE}'
        and clientContacts.isFinancial = true`,
      )
      .leftJoinAndSelect(
        'superuser.externalSystemIds',
        'externalSystemIds',
        `externalSystemIds.externalSystemId = '${ExternalSystemEnum.UGB}'`,
      )
      .where({
        id: clientId,
        isActive: true,
        clientTypeId: ClientTypeEnum.CUSTOMER,
      })
      .getOne();
  }
}
