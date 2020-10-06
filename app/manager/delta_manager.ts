/*
 * @author kaysaith
 * @date 2020/10/6 15:19
 */
/*
 * @author kaysaith
 * @date 2020/4/24 19:00
 */

export class DeltaEventManager {
  #resizeTime: number | undefined;
  #timeout: boolean = false;
  #delta: number = 200;
  #event?: () => void;
  #handler?: number;
  readonly #watcher: () => void;

  constructor() {
    this.#watcher = () => {
      this.#resizeTime = new Date().getTime();
      if (!this.#timeout) {
        this.#timeout = true;
        this.#handler = window.setTimeout(endEvent, this.#delta);
      }
    };
    const endEvent = () => {
      if (new Date().getTime() - this.#resizeTime! < this.#delta) {
        this.#handler = window.setTimeout(endEvent, this.#delta);
      } else {
        this.#timeout = false;
        !this.#event || this.#event();
        window.clearTimeout(this.#handler);
      }
    };
  }

  setDeltaTime(value: number) {
    this.#delta = value;
    return this;
  }

  setEvent(event: () => void) {
    this.#event = event;
    return this;
  }

  getWatcher(): void {
    return this.#watcher();
  }
}
