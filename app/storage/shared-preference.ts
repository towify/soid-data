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

  /**
   * @description 删除键值对
   * @param key 键
   */
  public async delete(key: string) {
    this.redis.delete(key);
    await localStorage.removeItem(key);
  }

  /**
   * @description 获取指定键对应的值
   * @param key 键值
   */
  public get(key: string) {
    let redisValue = this.redis.get(key);
    if (!redisValue) {
      redisValue = localStorage.getItem(key) || undefined;
    }
    return redisValue;
  }

  /**
   * @description 保存键值对，如果已经存在则进行更新
   * @param key 键
   * @param value 值
   */
  public async save(key: string, value: string) {
    this.redis.set(key, value);
    return localStorage.setItem(key, value);
  }
}

export const Shared = SharedPreference.getInstance();
