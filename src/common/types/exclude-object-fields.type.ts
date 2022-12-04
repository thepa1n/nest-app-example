export type ExcludeObjectFields<T> = Pick<
  T,
  { [K in keyof T]: T[K] extends object ? never : K }[keyof T]
>;
