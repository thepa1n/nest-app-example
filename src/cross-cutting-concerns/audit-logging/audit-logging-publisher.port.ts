import { PublisherPort } from '../publishers-base';
import { AuditLogEvent } from './audit-logging.event';

export const AuditLoggingPubSymbol = Symbol('AuditLoggingPubSymbol');

export interface AuditLogEventPublisherPort
  extends PublisherPort<AuditLogEvent> {}
