/*
 * @author kaysaith
 * @date 2021/7/21
 */

import { ValueChecker } from '../util/value.checker';

export class PhoneModel {
  constructor(private readonly number: string) {
  }

  get phone(): string | undefined {
    if (this.isValid()) return this.number;
    else return undefined;
  }

  isValid(): boolean {
    return ValueChecker.isPhoneNumber(this.number);
  }
}
