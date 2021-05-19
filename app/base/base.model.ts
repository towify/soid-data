/*
 * @author kaysaith
 * @date 2021/5/19
 */

/**
 * 这个 Mode 是用来做 Class Constructor 平铺参数类型限定用的
 * */
export abstract class BaseModel<T> {
  protected constructor(options?: Partial<T>) {
  }
}