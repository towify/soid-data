/*
 * @author kaysaith
 * @date 2020/4/13 22:34
 */
export class Nullable<T> {
  constructor(
    public readonly status: boolean,
    public readonly value?: T
  ) {}

  public orElse(action: () => void) {
    if (this.status) {
      action();
    }
  }

  public isNotNull(hold: (result: T) => void) {
    if (!this.status) {
      hold(this.value!);
    }
    return this;
  }
}