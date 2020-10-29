/*
 * @author kaysaith
 * @date 2020/10/29 10:55
 */

import exp from 'constants';

export class EventObserverService {
  private static _bus: EventObserverService | undefined;
  readonly #eventMap: Map<string, (message: any) => void>;

  private constructor() {
    this.#eventMap = new Map();
  }

  static getInstance() {
    if (!EventObserverService._bus) {
      EventObserverService._bus = new EventObserverService();
    }
    return EventObserverService._bus;
  }

  register(name: string, event: (message?: any) => void): this {
    this.#eventMap.set(name, event);
    return this;
  }

  unregister(name: string): boolean {
    if (this.#eventMap.has(name)) {
      this.#eventMap.delete(name);
      return true;
    }
    return false;
  }

  notify(name: string, message?: any): boolean {
    if (this.#eventMap.has(name)) {
      this.#eventMap.get(name)!(message);
      return true;
    }
    return false;
  }
}
