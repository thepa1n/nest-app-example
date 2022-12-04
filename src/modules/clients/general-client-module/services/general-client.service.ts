import { Injectable } from '@nestjs/common';
import { ClientTypeEnum, Superuser } from '@orm-entities/superuser.orm-entity';
import { SuperuserRepository } from '../repositories';
import { DateVO, UUID } from '@common/ddd/domain/value-objects';
import { RegistrationAccountGoal } from '@orm-entities/registration-goal';
import { ClientStatusChangeHistory } from '@orm-entities/profile';
import { Customer } from '@orm-entities/customer/customer.orm-entity';
import { LegalEntityOrmEntity } from '@orm-entities/legal-entity';

interface CreateSuperuserParams {
  readonly statusId: string;
  readonly clientTypeId: ClientTypeEnum;
  readonly clientSubTypeId?: string;
  readonly registrationPlaceCode?: string;
  readonly eddrCode?: string;
  readonly canDisturb?: boolean;
  readonly permProcessData?: boolean;
  readonly permReceivePromoMailings?: boolean;
  readonly registrationChannelId?: string;
  readonly segmentId?: string;
  readonly registrationGoals?: Array<{
    id: string;
  }>;
}

export interface CreateSuperuserCustomer
  extends Omit<CreateSuperuserParams, 'clientTypeId'> {
  customer: Customer;
}

export interface CreateSuperuserLegalEntity
  extends Omit<CreateSuperuserParams, 'clientTypeId'> {
  legalEntity: LegalEntityOrmEntity;
}

@Injectable()
export class GeneralClientService {
  constructor(private readonly _superuserRepo: SuperuserRepository) {}

  private _createSuperuserEntity(params: CreateSuperuserParams): Superuser {
    const client = new Superuser();
    client.id = UUID.generate().value;
    client.registrationDate = DateVO.now().value;
    client.statusId = params.statusId;
    client.clientTypeId = params.clientTypeId;
    client.clientSubTypeId = params?.clientSubTypeId;
    client.registrationPlaceCode = params?.registrationPlaceCode;
    client.eddrCode = params?.eddrCode;
    client.canDisturb = params?.canDisturb;
    client.permProcessData = params?.permProcessData;
    client.permReceivePromoMailings = params?.permReceivePromoMailings;
    client.registrationChannelId = params?.registrationChannelId;
    client.segmentId = params?.segmentId;

    client.clientStatusChangeHistories = [
      new ClientStatusChangeHistory({
        clientId: client.id,
        statusId: params.statusId,
      }),
    ];

    if (params?.registrationGoals?.length) {
      client.registrationAccountGoals = params.registrationGoals.map((goal) => {
        const entity = new RegistrationAccountGoal();
        entity.id = goal.id;
        return entity;
      });
    }

    return client;
  }

  public createSuperuserCustomer(params: CreateSuperuserCustomer): Superuser {
    const superuser = this._createSuperuserEntity({
      ...params,
      clientTypeId: ClientTypeEnum.CUSTOMER,
    });

    superuser.customer = params.customer;

    return superuser;
  }

  public createSuperuserLegalEntity(
    params: CreateSuperuserLegalEntity,
  ): Superuser {
    const superuser = this._createSuperuserEntity({
      ...params,
      clientTypeId: ClientTypeEnum.LEGAL_ENTITY,
    });

    superuser.legalEntity = params.legalEntity;

    return superuser;
  }

  public updateIdentificationStatus(
    superuserEntity: Superuser,
    identStatus: string,
  ): Superuser {
    /**
     * TODO: Добавить логику, когда будет система по идентификации
     */
    superuserEntity.identStatusId = identStatus;
    return superuserEntity;
  }

  public async getOrFailById(clientId: string): Promise<Superuser> {
    return this._superuserRepo.getSuperuserDataByIdOrFail(clientId);
  }
}
