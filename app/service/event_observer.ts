/*
 * @author kaysaith
 * @date 2020/10/29 10:55
 */

export class EventObserverService {
  private static instance?: EventObserverService;
  readonly #events: { [key: string]: { [key: string]: (message: any) => void } };

  private constructor() {
    this.#events = {};
  }

  static getInstance(): EventObserverService {
    EventObserverService.instance ??= new EventObserverService();
    return EventObserverService.instance;
  }

  register<T>(name: string, key: string, event: (message?: T) => void): this {
    this.#events[name] ??= {};
    this.#events[name][key] = event;
    return this;
  }

  unregister(name: string): boolean {
    if (this.#events[name]?.length) {
      this.#events[name] = {};
      delete this.#events[name];
      return true;
    }
    return false;
  }

  notify(name: string, message?: any) {
    this.#events[name] && Object.values(this.#events[name]).forEach(event => {
      event(message);
    });
  }
}
