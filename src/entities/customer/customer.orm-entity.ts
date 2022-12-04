import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Superuser } from '../superuser.orm-entity';
import { Gender } from './gender.orm-entity';

@Entity('customer')
export class Customer {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
    comment: 'Unique record identifier',
  })
  id: string;

  @Column('uuid', {
    name: 'client_id',
    nullable: false,
    comment: 'Reference. Client owner',
  })
  clientId: string;

  @Column('character varying', {
    name: 'first_name',
    nullable: true,
    length: 32,
    comment: 'Client first name',
  })
  firstName: string | null;

  @Column('character varying', {
    name: 'last_name',
    nullable: true,
    length: 32,
    comment: 'Client last name',
  })
  lastName: string | null;

  @Column('character varying', {
    name: 'middle_name',
    nullable: true,
    length: 32,
    comment: 'Client second name',
  })
  middleName?: string | null;

  @Column('character varying', {
    name: 'lat_first_name',
    nullable: true,
    length: 32,
    comment: 'Client first name in Latin',
  })
  latFirstName: string | null;

  @Column('character varying', {
    name: 'lat_last_name',
    nullable: true,
    length: 32,
    comment: 'Client last name in Latin',
  })
  latLastName: string | null;

  @Column('date', {
    name: 'birth_date',
    nullable: true,
    comment: 'Date of Birth',
  })
  dateOfBirth: string | null;

  @Column('uuid', {
    name: 'birth_country_id',
    nullable: true,
    comment: 'County of birth',
  })
  birthCountryId: string | null;

  @Column('character varying', {
    name: 'birth_place',
    nullable: true,
    length: 255,
    comment: 'Place of Birth',
  })
  birthPlace: string | null;

  @Column('uuid', {
    name: 'gender_id',
    comment: 'Reference. Gender',
    nullable: true,
  })
  genderId: string;

  @Column('character varying', {
    name: 'inn_code',
    nullable: true,
    length: 10,
    comment: 'Identification code',
  })
  innCode: string | null;

  @Column('boolean', {
    name: 'is_religious',
    default: () => 'false',
    comment: 'When client is religious',
  })
  isReligious: boolean;

  @Column('boolean', {
    name: 'is_resident',
    default: true,
    comment: 'When client resident of Ukraine',
  })
  isResident: boolean;

  @Column('uuid', {
    name: 'citizen_country_id',
    comment: 'Reference. Country(when client is not resident)',
    nullable: true,
  })
  citizenCountryId: string;

  @Column('boolean', {
    name: 'is_public_figure',
    nullable: true,
    default: () => 'false',
    comment: 'When client is public figure',
  })
  isPublicFigure: boolean | null;

  @Column('jsonb', {
    name: 'custom_attributes',
    nullable: true,
    comment: 'Can contain any additional information about this client',
  })
  customAttributes: object | null;

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


  @OneToOne(() => Superuser, (superuser) => superuser.customer)
  @JoinColumn([{ name: 'client_id', referencedColumnName: 'id' }])
  superuser: Superuser;

  @ManyToOne(() => Gender, (genders) => genders.customers)
  @JoinColumn([{ name: 'gender_id', referencedColumnName: 'id' }])
  gender: Gender;
}
