import { ApiOperation } from '@nestjs/swagger';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { SearchClientByFiltersRequestDto } from '../dtos/request';
import { CustomerMapper } from '@modules/clients/customer/mappers';
import { CustomerQueriesService } from '../services';
import { AppControllerSwagger, SwaggerConfig } from '@config';
import {
  ClientIdParamRequestDto,
  GetShortInfoForCustomersRequestDto,
  ShortCustomerInfoResponse,
  ClientGeneralInfoResponse,
} from '@modules/clients/customer/dtos';

@AppControllerSwagger(SwaggerConfig.tags.customer)
@Controller()
export class FindCustomersController {
  constructor(
    private readonly _customerQueriesService: CustomerQueriesService,
  ) {}

  @ApiOperation({
    summary: 'Get short summary information about Customer',
  })
  @Get('/general-info/:clientId')
  public async getClientGeneralInfoByIdHandler(
    @Param() params: ClientIdParamRequestDto,
  ): Promise<ClientGeneralInfoResponse> {
    const foundClient =
      await this._customerQueriesService.getCustomerGeneralInfo(
        params.clientId,
      );

    const formattedClient = CustomerMapper.mapToShortExtendedResponse([
      foundClient,
    ]);

    return formattedClient[0];
  }

  @ApiOperation({
    summary: 'Get short info about Customer by id list',
  })
  @Post('/short/multiple')
  public async getCustomersShortInfoByIdListHandler(
    @Body() reqBody: GetShortInfoForCustomersRequestDto,
  ): Promise<ShortCustomerInfoResponse[]> {
    const foundClients =
      await this._customerQueriesService.getCustomersByIdList(
        reqBody.clientIdList,
      );

    return CustomerMapper.mapToShortMultipleResponse(foundClients);
  }

  @ApiOperation({
    summary: 'Search Customers by criteria',
  })
  @Post('/search')
  public async searchClientsByFilterHandler(
    @Body() bodyReq: SearchClientByFiltersRequestDto,
  ): Promise<ShortCustomerInfoResponse[]> {
    return this._customerQueriesService.searchCustomersByFilter(bodyReq);
  }
}
