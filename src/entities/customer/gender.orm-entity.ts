import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Customer } from './customer.orm-entity';

@Entity('gender')
export class Gender {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
    comment: 'Unique record identifier',
  })
  id: string;

  @Column('character varying', {
    name: 'title',
    length: 100,
    comment: 'Title for show on view',
  })
  title: string;

  @Column('character varying', {
    name: 'system_title',
    nullable: true,
    length: 32,
    comment: 'Title for system usage',
  })
  systemTitle: string | null;

  /**
   *
   * Relations
   *
   */

  @OneToMany(() => Customer, (customers) => customers.gender)
  customers: Customer[];
}
