import {
  DomainPrimitive,
  ValueObject,
} from '../base-classes/value-object.base';

export class DateVO extends ValueObject<Date> {
  public static now(): DateVO {
    return new DateVO(Date.now());
  }

  constructor(value: Date | string | number) {
    const date = new Date(value);
    super({ value: date });
  }

  public get value(): Date {
    return this.props.value;
  }

  protected validate({ value }: DomainPrimitive<Date>): void {
    if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
      throw new Error('Incorrect date');
    }
  }
}
