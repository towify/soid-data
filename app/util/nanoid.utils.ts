/*
 * @author kaysaith
 * @date 2022/4/8
 */

import { nanoid } from 'nanoid';

export class NanoIdHelper {
  static short() {
    return nanoid(16);
  }

  static custom(size?: number) {
    return nanoid(size);
  }
}

