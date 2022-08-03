/*
 * @author kaysaith
 * @date 2022/4/8
 */

import { customAlphabet, nanoid } from 'nanoid';

export class NanoIdHelper {
  static short() {
    return customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 16)();
  }
  static custom(size?: number) {
    return nanoid(size);
  }
}

