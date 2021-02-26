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

  public async delete(key: string) {
    this.redis.delete(key);
    await localStorage.removeItem(key);
  }

  public get(key: string) {
    let redisValue = this.redis.get(key);
    if (!redisValue) {
      redisValue = localStorage.getItem(key) || undefined;
    }
    return redisValue;
  }

  public async save(key: string, value: string) {
    this.redis.set(key, value);
    return localStorage.setItem(key, value);
  }
}

export const Shared = SharedPreference.getInstance();
