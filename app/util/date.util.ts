/*
 * @author kaysaith
 * @date 2021/9/16
 */
export class DateUtil {
  static formatByType(isoString: string, format: 'MM/DD/YY' | 'DD/MM/YY' | 'YY/MM/DD' | 'M/D/YY' | 'YY/M/D') {
    const date = new Date(isoString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    const mm = month > 9 ? month : ('0' + month);
    const dd = day > 9 ? day : ('0' + day);
    switch (format) {
      case 'DD/MM/YY': {
        return `${ dd }-${ mm }-${ year }`;
      }
      case 'M/D/YY': {
        return `${ day }-${ month }-${ year }`;
      }
      case 'MM/DD/YY': {
        return `${ mm }-${ dd }-${ year }`;
      }
      case 'YY/M/D': {
        return `${ year }-${ month }-${ day }`;
      }
      default:
        return `${ year }-${ mm }-${ dd }`;
    }
  }
}

