/*
 * @author kaysaith
 * @date 2020/10/6 15:19
 */

/*
 * @author kaysaith
 * @date 2020/4/24 19:00
 */

export class DeltaEventManager<T> {
  #resizeTime: number | undefined;
  #timeout: boolean = false;
  #delta: number = 200;
  #event?: (data?: T) => void;
  #handler?: number;
  readonly #watcher: (data?: T) => void;

  constructor() {
    this.#watcher = (data?: T) => {
      this.#resizeTime = new Date().getTime();
      if (!this.#timeout) {
        this.#timeout = true;
        this.#handler = window.setTimeout(() => endEvent(data), this.#delta);
      }
    };
    const endEvent = (data?: T) => {
      if (new Date().getTime() - this.#resizeTime! < this.#delta) {
        this.#handler = window.setTimeout(() => endEvent(data), this.#delta);
      } else {
        this.#timeout = false;
        !this.#event || this.#event(data);
        window.clearTimeout(this.#handler);
      }
    };
  }

  setDeltaTime(value: number) {
    this.#delta = value;
    return this;
  }

  setEvent(event: (data?: T) => void) {
    this.#event = event;
    return this;
  }

  getWatcher(data?: T): void {
    return this.#watcher(data);
  }
}
