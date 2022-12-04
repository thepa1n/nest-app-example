import { applyDecorators } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';

export class SwaggerConfig {
  static tags = {
    responsibleManager: 'Responsible Manager',
    contact: 'Contacts',
    address: 'Addresses',
    clients: 'Clients',
    customer: 'Customer',
    legalEntity: 'Legal Entity',
    document: 'Documents',
    estates: 'Estates',
    vehicles: 'Vehicles',
    incomes: 'Incomes',
    fatca: 'Fatca',
    individualEntrepreneurs: 'Individual entrepreneur',
    securities: 'Securities',
    identificationHistory: 'Identification History',
    additionalAttributes: 'Additional Attributes',
    clientExternalId: 'Client External Ids',
    externalBankAccounts: 'External Bank Accounts',
    restrictions: 'Restriction',
    relationships: 'Relationships',
    tagging: 'Tagging',
    directories: 'Directories',
    commonDirectories: 'Common Directories',
  };
}

export enum ApplicationSecurityName {
  USER_HEADER = 'USER_HEADER',
}

export function AppControllerSwagger(...tagTitle: string[]): Function {
  return applyDecorators(
    ApiTags(...tagTitle),
    ApiSecurity(ApplicationSecurityName.USER_HEADER),
  );
}
