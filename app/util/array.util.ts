/*
 * @author kaysaith
 * @date 12/23/20 11:10
 */

export class ArrayUtils {
  /**
   * @description 将二维数组降为一维数组
   * @param array
   */
  static flat<U>(array: U[][]): U[] {
    if (((array as unknown) as U[]).every((value) => !Array.isArray(value))) {
      return ((array as unknown) as U[]).slice();
    }
    return array.reduce(
      (acc, value) =>
        acc.concat(
          Array.isArray(value)
            ? ArrayUtils.flat((value as unknown) as U[][])
            : value
        ),
      []
    );
  }
}
