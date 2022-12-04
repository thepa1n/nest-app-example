import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Customer } from './customer';
import { ExcludeObjectFields } from '@common/types';
export enum ClientStatusEnum {
  ACTIVE = '76147fac-94a9-4941-8ef5-2a1fb829efe9',
  INACTIVE = 'f34aad65-f99f-4693-8b1d-9f70e060da12',
  LEAD = '16ea0f1e-944a-403b-986e-a538a445800f',
  DUPLICATE = '6db7411e-156c-448c-86f7-ba865eb9a137',
}

export enum ClientTypeEnum {
  CUSTOMER = '0ebc2d0a-c88e-4627-9ab9-091ebdb06b91',
  LEGAL_ENTITY = '33dc9e7a-516b-4eaf-92ad-ed36305be3e4',
}

export type SuperuserCustomerType = Omit<Superuser, 'legalEntity'>;
export type SuperuserLegalEntityType = Omit<
  Superuser,
  'customer' | 'individualEntrepreneur' | 'fatcaInfo'
>;
export type SuperuserWithoutRelationsType = ExcludeObjectFields<Superuser>;

@Entity('superuser')
export class Superuser {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
    comment: 'Unique record identifier',
  })
  id: string;

  @Column('uuid', {
    name: 'client_type_id',
    nullable: true,
    comment: 'Reference. Client type',
  })
  clientTypeId: string;

  @Column('uuid', {
    name: 'client_sub_type_id',
    nullable: true,
    comment: 'Reference. Client Sub type',
  })
  clientSubTypeId?: string;

  @Column('character varying', {
    name: 'system_id',
    nullable: true,
    length: 10,
  })
  systemId: string | null;

  @Column('character varying', {
    name: 'registration_place_code',
    nullable: true,
    length: 64,
    comment: 'Client Registration Location Code',
  })
  registrationPlaceCode: string | null;

  @Column('character varying', {
    name: 'block_comment',
    nullable: true,
    comment: 'Comment on why the client was blocked',
  })
  blockComment: string | null;

  @Column('boolean', {
    name: 'can_disturb',
    nullable: false,
    default: true,
    comment: 'Is it possible to disturb the client',
  })
  canDisturb: boolean;

  @Column('boolean', {
    name: 'perm_process_data',
    nullable: false,
    default: true,
    comment: 'Have permission to process personal data',
  })
  permProcessData: boolean;

  @Column('boolean', {
    name: 'perm_receive_promo_mailings',
    nullable: false,
    default: true,
    comment: 'Is it possible to do marketing mailing list',
  })
  permReceivePromoMailings: boolean;

  @Column('boolean', {
    name: 'exists_cred_out',
    nullable: true,
    default: () => 'false',
  })
  existsCredOut: boolean | null;

  @Column('character varying', {
    name: 'eddr_code',
    nullable: true,
    length: 32,
  })
  eddrCode: string | null;

  @Column('uuid', {
    name: 'registration_channel_id',
    nullable: true,
    comment: 'Reference. Client registration channel',
  })
  registrationChannelId?: string;

  @Column('uuid', {
    name: 'client_segment_id',
    nullable: true,
    comment: 'Reference. Client segment',
  })
  segmentId?: string;

  @Column('boolean', {
    name: 'is_active',
    nullable: false,
    default: true,
    comment: 'Is active entry or not',
  })
  isActive: boolean;

  @Column('timestamp without time zone', {
    name: 'registration_date',
    nullable: true,
    comment: 'Client registration date',
  })
  registrationDate?: Date;

  @Column('uuid', {
    name: 'status_id',
    nullable: false,
    comment: 'Reference. Client status',
  })
  statusId: string;

  @Column('uuid', {
    name: 'ident_status_id',
    nullable: true,
    comment: 'Reference. Client identification status',
  })
  identStatusId: string;

  @Column('uuid', {
    name: 'parent_client_id',
    nullable: true,
    comment: 'Reference. Client information that will hide the current',
  })
  parentClientId?: string;

  @Column('uuid', {
    name: 'responsible_manager_id',
    nullable: true,
    comment: 'Reference. Responsible manager',
  })
  responsibleManagerId?: string;

  @CreateDateColumn({
    name: 'created_at',
    default: () => 'now()',
    comment: 'Record creation date',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    default: () => 'now()',
    comment: 'Record update date',
  })
  updatedAt: Date;

  /**
   *
   * Relations
   *
   */

  @OneToOne(() => Customer, (customers) => customers.superuser, {
    cascade: true,
  })
  customer: Customer;

  @OneToMany(() => Superuser, (superuser) => superuser.parentClient)
  childClients: Superuser[];

  @ManyToOne(() => Superuser, (superuser) => superuser.childClients)
  @JoinColumn([{ name: 'parent_client_id', referencedColumnName: 'id' }])
  parentClient: Superuser;
}
