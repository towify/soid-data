/*
 * @author kaysaith
 * @date 2020/3/12 13:15
 */

class SharedPreference {
  static shared?: SharedPreference;

  public static getInstance() {
    SharedPreference.shared ??= new SharedPreference();
    return SharedPreference.shared;
  }

  private redis: Map<string, string> = new Map();

  private constructor() {}

  public delete(key: string) {
    return new Promise((resolve) => {
      this.redis.delete(key);
      localStorage.removeItem(key);
      resolve();
    });
  }

  public get(key: string) {
    let redisValue = this.redis.get(key);
    if (!redisValue) {
      redisValue = localStorage.getItem(key) || undefined;
    }
    return redisValue;
  }

  public save(key: string, value: string) {
    return new Promise((resolve) => {
      this.redis.set(key, value);
      localStorage.setItem(key, value);
      resolve();
    });
  }
}

export const Shared = SharedPreference.getInstance();
