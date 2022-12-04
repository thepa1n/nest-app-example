import { SuperuserCustomerType } from '@orm-entities/superuser.orm-entity';
import {
  ShortCustomerInfoResponse,
  ClientGeneralInfoResponse,
  CustomerProfileResponseDto,
} from '@modules/clients/customer/dtos/response';
import { IFoundShortCustomerInfo } from '@modules/clients/general-client-module/repositories';
import { ExternalSystemEnum } from '@orm-entities/external-ids';
import { Customer } from '@orm-entities/customer';

export class CustomerMapper {
  static mapToShortExtendedResponse(
    clients: IFoundShortCustomerInfo[],
  ): ClientGeneralInfoResponse[] {
    return clients.map(
      (client) =>
        new ClientGeneralInfoResponse({
          id: client.id,
          ugbId:
            client?.externalSystemIds?.find(
              (id) => id.externalSystemId === ExternalSystemEnum.UGB,
            )?.externalId || null,

          firstName: client?.customer?.firstName || null,
          lastName: client?.customer?.lastName || null,
          middleName: client?.customer?.middleName || null,
          dateOfBirth: client?.customer?.dateOfBirth || null,
          gender: client?.customer?.gender || null,
          status: client?.status || null,
          isReligious: client?.customer?.isReligious,
          isPublicFigure: client?.customer?.isPublicFigure,
          haveFATCA: !!client.fatcaInfo,
          inn: client?.customer?.innCode || null,
          eddrCode: client?.eddrCode || null,
          passport: {
            number: client?.documents[0]?.number || null,
            series: client?.documents[0]?.series || null,
          },
          financialPhone: client?.clientContacts[0]?.value || null,
        }),
    );
  }

  static mapToShortMultipleResponse(
    clients: SuperuserCustomerType[],
  ): ShortCustomerInfoResponse[] {
    return clients.map(
      (client) =>
        new ShortCustomerInfoResponse({
          id: client.id,

          firstName: client.customer?.firstName || null,
          lastName: client.customer?.lastName || null,
          middleName: client.customer?.middleName || null,
          dateOfBirth: client.customer?.dateOfBirth || null,
          gender: client?.customer?.gender?.title || null,
        }),
    );
  }

  static mapToCustomerOnlyProfileResponse(
    customer: Customer,
  ): CustomerProfileResponseDto {
    return new CustomerProfileResponseDto({
      firstName: customer?.firstName,
      lastName: customer?.lastName,
      middleName: customer?.middleName,
      latFirstName: customer?.latFirstName,
      latLastName: customer?.latLastName,
      birthPlace: customer?.birthPlace,
      citizenCountry: customer?.citizenCountry,
      birthCountry: customer?.birthCountry,
      dateOfBirth: customer?.dateOfBirth,
      gender: customer?.gender,
      innCode: customer?.innCode,
      isPublicFigure: customer?.isPublicFigure,
      isReligious: customer?.isReligious,
      isResident: customer?.isResident,
      createdAt: customer?.createdAt,
      updatedAt: customer?.updatedAt,
    });
  }
}
