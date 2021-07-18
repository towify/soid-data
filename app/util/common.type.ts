/*
 * @author kaysaith
 * @date 2021/7/18
 */

export type Merge<T> = { [K in keyof T]: T[K] };

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export type Entries<T> = { [K in keyof T]: [K, T[K]]; }[keyof T][];

export type ChangeTypeOfKeys<T extends object,
  Keys extends keyof T,
  NewType> = {
  // Loop to every key. We gonna check if the key
  // is assignable to Keys. If yes, change the type.
  // Else, retain the type.
  [key in keyof T]: key extends Keys ? NewType : T[key]
}
