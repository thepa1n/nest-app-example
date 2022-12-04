import { BaseCommandProps } from '@common/ddd/domain/base-classes';

export enum AuditLogEventEnum {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
}

export enum AuditLogAggregatesEnum {
  PERSON = 'PERSON',
  LEGAL_ENTITY = 'LEGAL_ENTITY',
  PERSON_LEAD = 'PERSON_LEAD',
  LEGAL_ENTITY_LEAD = 'LEGAL_ENTITY_LEAD',
  CONTACT = 'CONTACT',
  LINK_SERVICE_CONTACT = 'LINK_SERVICE_CONTACT',
  ADDRESS = 'ADDRESS',
  DOCUMENT = 'DOCUMENT',
  ADDITIONAL_ATTRIBUTE = 'ADDITIONAL_ATTRIBUTE',
  FATCA = 'FATCA',
  IDENTIFICATION = 'IDENTIFICATION',
  INCOMES = 'INCOMES',
  INDIVIDUAL_ENTREPRENEUR = 'INDIVIDUAL_ENTREPRENEUR',
  ESTATE = 'ESTATE',
  SECURITIES = 'SECURITIES',
  VEHICLE = 'VEHICLE',
  RELATIONSHIP = 'RELATIONSHIP',
  CLIENT_RESTRICTION = 'CLIENT_RESTRICTION',
  GENERAL_RESTRICTION = 'GENERAL_RESTRICTION',
  TAGGING = 'TAGGING',
  EXTERNAL_BANK_ACCOUNT = 'EXTERNAL_BANK_ACCOUNT',
  EXTERNAL_ID = 'EXTERNAL_ID',
  DIRECTORY = 'DIRECTORY',
  RESPONSIBLE_MANAGER = 'RESPONSIBLE_MANAGER',
}

export class AuditLogEvent {
  constructor(props: Omit<AuditLogEvent, 'eventTimestamp'>) {
    Object.assign(this, props);

    this.eventTimestamp = new Date();
  }

  public readonly entityId: string;
  public readonly clientId?: string;
  public readonly commandName: string;
  public readonly aggregateName: AuditLogAggregatesEnum;
  public readonly eventType: AuditLogEventEnum;
  public readonly initiatorId: string;
  public readonly eventTimestamp: Date;
  public readonly command: BaseCommandProps & object;
}

export class ClientDataAuditLogEvent extends AuditLogEvent {
  constructor(props: Omit<ClientDataAuditLogEvent, 'eventTimestamp'>) {
    super(props);
  }

  public readonly clientId: string;
}

export class DirectoryAuditLogEvent extends AuditLogEvent {
  constructor(props: Omit<DirectoryAuditLogEvent, 'eventTimestamp'>) {
    super(props);
  }
}
