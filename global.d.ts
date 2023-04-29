/**
 * Exclude from an array of type T elements that matches U
 *
 * @example
 * ExcludeFromArray<(number | string)[], string> === number[]
 */
type ExcludeFromArray<T extends any[], U> = T extends (infer D)[]
  ? Exclude<D, U>[]
  : never;
