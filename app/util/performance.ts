/*
 * @author kaysaith
 * @date 2020/10/6 15:20
 */

export class Performance {

  /**
   * @description 防抖动
   * @param action 回调方法
   * @param timeout 时间长度，单位ms
   */
  static debounce<T extends any[]>(
    action: (...args: T) => any,
    timeout: number,
  ): (...args: T) => void {
    let timer: number;
    return (...args: T) => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => action(...args), timeout);
    };
  }

  /**
   * @description 延迟调用
   * @param  ms 延迟时间，单位ms
   */
  static delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * @description 间隔调用方法
   * @param func 方法
   * @param threshhold 间隔时间，单位ms
   * @param scope 方法调用者
   */
  static throttle<T extends (...args: any[]) => any>(
    func: T,
    threshhold: number = 20,
    scope?: any
  ): T {
    if (threshhold < 0) {
      throw new TypeError("invalid thresh hold value.");
    }

    let timer: number = 0;
    let rtn: any;

    return <T>function (this: any, ...args: any[]): any {
      if (!timer) {
        const ctx = typeof scope === "undefined" ? this : scope;
        timer = window.setTimeout(() => {
          timer = 0;
          rtn = func.apply(ctx, args);
        }, threshhold);
      }
      return rtn;
    };
  }
}
