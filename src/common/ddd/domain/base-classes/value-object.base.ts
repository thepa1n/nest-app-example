import { Guard } from '../guard';
import { convertPropsToObject } from '../utils';

export type Primitives = string | number | boolean;
export interface DomainPrimitive<T extends Primitives | Date> {
  value: T;
}

type ValueObjectProps<T> = T extends Primitives | Date ? DomainPrimitive<T> : T;

export abstract class ValueObject<T> {
  static isValueObject(obj: unknown): obj is ValueObject<unknown> {
    return obj instanceof ValueObject;
  }

  protected constructor(props: ValueObjectProps<T>) {
    this._checkIfEmpty(props);
    this.validate(props);
    this.props = props;
  }

  protected readonly props: ValueObjectProps<T>;

  protected abstract validate(props: ValueObjectProps<T>): void;

  private _checkIfEmpty(props: ValueObjectProps<T>): void {
    if (
      Guard.isEmpty(props) ||
      (this._isDomainPrimitive(props) && Guard.isEmpty(props.value))
    ) {
      throw new Error('Property cannot be empty');
    }
  }

  private _isDomainPrimitive(
    obj: unknown,
  ): obj is DomainPrimitive<T & (Primitives | Date)> {
    return !!Object.prototype.hasOwnProperty.call(obj, 'value');
  }

  /**
   *  Check if two Value Objects are equal. Checks structural equality.
   * @param vo ValueObject
   */
  public equals(vo?: ValueObject<T>): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }
    return JSON.stringify(this) === JSON.stringify(vo);
  }

  /**
   * Unpack a value object to get its raw properties
   */
  public unpack(): T {
    if (this._isDomainPrimitive(this.props)) {
      return this.props.value;
    }

    const propsCopy = convertPropsToObject(this.props);

    return Object.freeze(propsCopy);
  }
}
