import { ClientContactTypeEnum } from '@orm-entities/contacts';
import { DocumentTypeEnum } from '@orm-entities/document/document-type.orm-entity';
import { ExternalSystemEnum } from '@orm-entities/external-ids/external-system.orm-entity';
import { CustomerConstants } from '@modules/clients/customer/customer.constants';
import { ClientTypeEnum } from '@orm-entities/superuser.orm-entity';

export interface ISearchCustomerFilter {
  readonly firstName?: string;
  readonly lastName?: string;
  readonly middleName?: string;
  readonly innCode?: string;
  readonly ugbCode?: string;
  readonly phoneNumber?: string;
  readonly passport?: {
    readonly series?: string;
    readonly number?: string;
  };
  readonly responsibleManagerId?: string;
}

export interface IFoundCustomersByFilter {
  id: string;
  firstName: string;
  lastName: string;
  middleName: string;
  dateOfBirth: string;
  gender: string;
}

export const generateSearchCustomersByFilterSql = (
  filter: ISearchCustomerFilter,
): string => {
  const { passport } = filter;

  return `
    select
      s.id as id,
      cu.first_name as "firstName",
      cu.last_name as "lastName",
      cu.middle_name as "middleName",
      gender.title as "gender",
      cu.birth_date as "dateOfBirth"
    from superuser s
    left join client_match_external_system cmes 
    on cmes.client_id = s.id 
    left join customer cu
    on cu.client_id = s.id
    left join client_document cd 
    on cd.client_id = s.id 
    left join client_contact cc
    on cc.client_id = s.id 
    left join gender
    on gender.id = cu.gender_id 
    where
        s.client_type_id = '${ClientTypeEnum.CUSTOMER}'
        and
        s.is_active = true
        and
        (
            ${filter.ugbCode ? `${filter.ugbCode}` : null} is null
            or
            cmes.external_system_id = '${ExternalSystemEnum.UGB}'
            and
            cmes.external_id = '${filter.ugbCode}'
        )
        and
        (
          (
              ${filter.firstName ? `'${filter.firstName}'` : null} is null
              or
              cu.first_name ilike '${filter.firstName}'
          )
          and
          (
              ${filter.lastName ? `'${filter.lastName}'` : null} is null
              or
              cu.last_name ilike '${filter.lastName}'
          )
          and
          (
              ${filter?.middleName ? `'${filter.middleName}'` : null} is null
              or
              cu.middle_name ilike '${filter.middleName}'
          )
          and
          (
              ${filter.innCode ? `'${filter.innCode}'` : null} is null
              or
              cu.inn_code = '${filter.innCode}'
          )
        )
        and
        (
          (
            ${passport?.series ? `'${passport.series}'` : null} is null
            or
            cd.type_id in (
              '${DocumentTypeEnum.PASSPORT}','${DocumentTypeEnum.ID_CARD}'
            )
            and
            cd.seria ilike '${passport?.series}'
          )
          and 
          (
            ${passport?.number ? `'${passport.number}'` : null} is null
            or
            cd.type_id in (
              '${DocumentTypeEnum.PASSPORT}','${DocumentTypeEnum.ID_CARD}'
            )
            and
            cd."number" = '${passport?.number}' 
          )
        )
        and
        (
          (
              ${filter.phoneNumber ? `'${filter.phoneNumber}'` : null} is null
              or
              cc.is_active = true
              and
              cc.contact_type_id = '${ClientContactTypeEnum.CUSTOMER_PHONE}'
              and
              cc.value ilike '${filter.phoneNumber}%'
          )
        )
        and
        (
            ${
              filter?.responsibleManagerId
                ? `'${filter.responsibleManagerId}'`
                : null
            } is null
            or
            s.responsible_manager_id = ${
              filter?.responsibleManagerId
                ? `'${filter.responsibleManagerId}'`
                : null
            }
        )
    group by s.id, cu.id, gender.id
    limit ${CustomerConstants.MAX_SIZE_OF_CUSTOMERS_IN_RESPONSE + 5}
  `;
};
