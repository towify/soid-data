/*
 * @author kaysaith
 * @date 2020/10/6 15:19
 */

export class DeltaEventManager {
  #resizeTime: number | undefined;
  #timeout: boolean = false;
  #delta: number = 200;
  #event?: (...args: any[]) => void;
  #handler?: number;
  readonly #watcher: (...args: any[]) => void;

  constructor() {
    this.#watcher = (...args: any[]) => {
      this.#resizeTime = new Date().getTime();
      if (!this.#timeout) {
        this.#timeout = true;
        this.#handler = window.setTimeout(() => endEvent(...args), this.#delta);
      }
    };
    const endEvent = (...args: any[]) => {
      if (new Date().getTime() - this.#resizeTime! < this.#delta) {
        this.#handler = window.setTimeout(() => endEvent(...args), this.#delta);
      } else {
        this.#timeout = false;
        !this.#event || this.#event(...args);
        window.clearTimeout(this.#handler);
      }
    };
  }

  /**
   * @description 设置时间阈值
   * @param value 阈值，单位 ms
   */
  setDeltaTime(value: number) {
    this.#delta = value;
    return this;
  }

  /**
   * @description 设置回调方法
   * @param event
   */
  setEvent(event: (...args: any[]) => void) {
    this.#event = event;
    return this;
  }

  /**
   * @description 开始观察
   * @param args
   */
  getWatcher(...args: any[]): void {
    return this.#watcher(...args);
  }
}
