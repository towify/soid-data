/*
 * @author kaysaith
 * @date 2020/10/29 10:55
 */

export class EventObserverService {
  private static instance?: EventObserverService;
  readonly #events: {
    [key: string]: { [key: string]: (message: any) => void };
  };

  private constructor() {
    this.#events = {};
  }

  /**
   * @description 获取单利对象
   */
  static getInstance(): EventObserverService {
    EventObserverService.instance ??= new EventObserverService();
    return EventObserverService.instance;
  }

  /**
   * @description 注册监听事件
   * @param name 主标识
   * @param key  子标识
   * @param event 事件回调
   */
  public register<T>(
    name: string,
    key: string,
    event: (message?: T) => void
  ): this {
    this.#events[name] ??= {};
    this.#events[name][key] = event;
    return this;
  }

  /**
   * @description 移除主标识对应的所有回调
   * @param name 主标识
   * @param key
   */
  public unregister(name: string, key?: string): boolean {
    if (this.#events[name] && Object.keys(this.#events[name])?.length) {
      if (key) {
        delete this.#events[name][key];
      } else {
        this.#events[name] = {};
        delete this.#events[name];
      }
      return true;
    }
    return false;
  }

  /**
   * @description 发送消息
   * @param name 主标识
   * @param message 消息
   */
  public notify(name: string, message?: any) {
    this.#events[name] &&
    Object.values(this.#events[name]).forEach((event) => {
      event(message);
    });
  }

  public async notifyAsQueue(name: string, message?: any) {
    if (!this.#events[name]) return;
    const tasks: ((message: any) => void)[] = Object.values(this.#events[name]);
    return new Promise(resolve => {
      let interval = setInterval(() => {
        console.debug('SOID DATA: task left count', tasks.length);
        let queue = tasks.splice(0, 20);
        queue.forEach(task => task(message));
        if (tasks.length <= 0) {
          clearInterval(interval);
          resolve(undefined);
        }
      }, 300);
    });
  }
}
