import { Controller, Post, Put, Param, Body } from '@nestjs/common';

import { DeactivateCustomerUseCase } from '../commands/deactivate-customer/deactivate-customer.use-case';
import { DeactivateCustomerCommand } from '../commands/deactivate-customer/deactivate-customer.command';
import { CreateCustomerUseCase } from '../commands/create-customer/create-customer.use-case';
import { CreateCustomerCommand } from '../commands/create-customer/create-customer.command';
import { JoinCustomersUseCase } from '../commands/join-customers/join-customers.use-case';
import { JoinCustomersCommand } from '../commands/join-customers/join-customers.command';
import { IdResponse } from '@common/ddd/interface-adapters/dtos';
import { AppControllerSwagger, SwaggerConfig } from '@config';
import {
  ClientIdParamRequestDto,
  CreateCustomerRequestDto,
  JoinCustomersRequestDto,
  BlockClientRequestDto,
} from '../dtos';
import {
  AppCoreHeadersRequestDto,
  ExtractCoreHeaders,
} from '@cross-cutting-concerns/application-core-headers';

@AppControllerSwagger(SwaggerConfig.tags.customer)
@Controller()
export class CustomerController {
  constructor(
    private readonly _createCustomerUseCase: CreateCustomerUseCase,
    private readonly _deactivateCustomerUseCase: DeactivateCustomerUseCase,
    private readonly _joinCustomersUseCase: JoinCustomersUseCase,
  ) {}

  @Post()
  public async createCustomerHandler(
    @Body() body: CreateCustomerRequestDto,
    @ExtractCoreHeaders() coreHeaders: AppCoreHeadersRequestDto,
  ): Promise<IdResponse> {
    const command = new CreateCustomerCommand({
      initiatorId: coreHeaders.userId,
      firstName: body.firstName,
      lastName: body.lastName,
      middleName: body.middleName,
      dateOfBirth: body.dateOfBirth,
      isReligious: body.isReligious,
      inn: body.inn,

      birthCountryId: body.additionalInfo?.birthCountryId,
      birthPlace: body.additionalInfo?.birthPlace,
      canDisturb: body.additionalInfo?.canDisturb,
      citizenCountryId: body.additionalInfo?.citizenCountryId,
      eddrCode: body.additionalInfo?.eddrCode,
      genderId: body.additionalInfo?.genderId,
      isPublicFigure: body.additionalInfo?.isPublicFigure,
      isResident: body.additionalInfo?.isResident,
      latFirstName: body.additionalInfo?.latFirstName,
      latLastName: body.additionalInfo?.latLastName,
      permProcessData: body.additionalInfo?.permProcessData,
      permReceivePromoMailings: body.additionalInfo?.permReceivePromoMailings,
      registrationPlaceCode: body.additionalInfo?.registrationPlaceCode,
      clientSubTypeId: body?.subTypeId,

      registrationGoals: body?.registrationGoalsId?.map((id) => ({ id })),
    });

    const createdClientId = await this._createCustomerUseCase.execute(command);

    return new IdResponse(createdClientId.value);
  }

  @Put('/deactivate/:clientId')
  public async deactivateCustomerHandler(
    @Param() params: ClientIdParamRequestDto,
    @Body() body: BlockClientRequestDto,
    @ExtractCoreHeaders() coreHeaders: AppCoreHeadersRequestDto,
  ): Promise<void> {
    const command = new DeactivateCustomerCommand({
      initiatorId: coreHeaders.userId,
      clientId: params.clientId,
      comment: body.comment,
    });

    await this._deactivateCustomerUseCase.execute(command);
  }

  @Post('/join')
  public async joinCustomersToOneHandler(
    @Body() joinDto: JoinCustomersRequestDto,
    @ExtractCoreHeaders() coreHeaders: AppCoreHeadersRequestDto,
  ): Promise<IdResponse> {
    const command = new JoinCustomersCommand({
      initiatorId: coreHeaders.userId,
      mainClientId: joinDto.mainClientId,
      duplicateClientIds: joinDto.duplicateClientIds,
    });

    const mainEntryId = await this._joinCustomersUseCase.execute(command);

    return new IdResponse(mainEntryId.value);
  }
}
