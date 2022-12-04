export interface ILineData {
  readonly firstName?: string;
  readonly lastName?: string;
  readonly middleName?: string;
  readonly dateOfBirth?: string;
  readonly isReligious?: boolean;
  readonly inn?: string;

  readonly latFirstName?: string;
  readonly latLastName?: string;
  readonly birthCountryId?: string;
  readonly birthPlace?: string;
  readonly genderId?: string;
  readonly citizenCountryId?: string;
  readonly isResident?: boolean;
  readonly isFigure?: boolean;
  readonly isPublicFigure?: boolean;
  readonly registrationPlaceCode?: string;
  readonly eddrCode?: string;
  readonly canDisturb?: boolean;
  readonly permProcessData?: boolean;
  readonly permReceivePromoMailings?: boolean;

  readonly registrationGoals?: string;
}
